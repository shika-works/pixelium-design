import { Project, SyntaxKind, TypeAliasDeclaration, InterfaceDeclaration } from 'ts-morph'
import { parse } from 'comment-parser'
import { camelCase } from 'parsnip-kit'

function getProps(node: TypeAliasDeclaration | InterfaceDeclaration, compName: string) {
	const props: {
		nodeApiType: string
		nodeName: string
		version: string
		props?: {
			prop: string
			type: string
			optional: boolean
			defaultValue: string
		}
		events?: {
			event: string
			params: {
				paramName: string
				paramType: string
			}[]
		}
		slots?: {
			slot: string
			params: {
				paramName: string
				paramType: string
			}[]
		}
	}[] = []
	const nodeName = node.getName()
	const nodeApiType =
		nodeName === `${compName}Events`
			? 'events'
			: nodeName === `${compName}Slots`
				? 'slots'
				: 'props'
	if (!nodeApiType) return props
	node.getDescendantsOfKind(SyntaxKind.PropertySignature).forEach((prop) => {
		let version = '',
			propType = ''
		const jsDocs = prop.getJsDocs()[0]?.getText()
		if (jsDocs) {
			const parsed = parse(jsDocs)
			version = parsed[0]?.tags.find((tag) => tag.tag === 'version')?.name || ''
			if (nodeApiType === 'props') {
				const propertyTag = parsed[0]?.tags.find((tag) => tag.tag === 'property')
				const name = propertyTag?.name || prop.getName()
				const optional = propertyTag?.optional || false
				propType = propertyTag?.type || ''
				const defaultValue = propertyTag?.default || ''

				props.push({
					nodeName,
					nodeApiType,
					version,
					props: {
						prop: name,
						type: propType,
						optional,
						defaultValue
					}
				})
			} else if (nodeApiType === 'events') {
				const eventTag = parsed[0]?.tags.find((tag) => tag.tag === 'event')
				const name = eventTag?.name || prop.getName()
				const data = {
					nodeName,
					nodeApiType,
					version,
					events: {
						event: name,
						params: [] as {
							paramName: string
							paramType: string
						}[]
					}
				}
				const paramTags = parsed[0]?.tags.filter((tag) => tag.tag === 'param')
				paramTags.forEach((tag) => {
					data.events.params.push({
						paramType: tag?.type || '',
						paramName: tag?.name || ''
					})
				})
				props.push(data)
			} else if (nodeApiType === 'slots') {
				const slotTag = parsed[0]?.tags.find((tag) => tag.tag === 'slot')
				const name = slotTag?.name || prop.getName()
				const data = {
					nodeName,
					nodeApiType,
					version,
					slots: {
						slot: name,
						params: [] as {
							paramName: string
							paramType: string
						}[]
					}
				}
				const paramTags = parsed[0]?.tags.filter((tag) => tag.tag === 'param')
				paramTags.forEach((tag) => {
					data.slots.params.push({
						paramType: tag?.type || '',
						paramName: tag?.name || ''
					})
				})
				props.push(data)
			}
		}
	})

	return props
}

function propsToMarkdown(
	props: ReturnType<typeof getProps>,
	lang: string,
	docMap: Record<string, string>
) {
	const grouped = props.reduce(
		(acc, prop) => {
			const key = `${prop.nodeName}-${prop.nodeApiType}`
			if (!acc[key]) {
				acc[key] = {
					nodeName: prop.nodeName,
					nodeApiType: prop.nodeApiType,
					items: []
				}
			}
			acc[key].items.push(prop)
			return acc
		},
		{} as Record<string, { nodeName: string; nodeApiType: string; items: typeof props }>
	)
	return Object.values(grouped).map((group) => {
		if (group.nodeApiType === 'props') {
			const nodeName = group.nodeName
			const headers =
				lang === 'zh'
					? ['属性', '类型', '可选', '默认值', '描述', '版本']
					: ['Attribute', 'Type', 'Optional', 'Default', 'Description', 'Version']
			const headerLine = `| ${headers.join(' | ')} |`
			const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`
			const rows = group.items.map((item) => {
				const description =
					docMap[`${camelCase(nodeName)}.${item.props?.prop || ''}`] ||
					docMap[item.props?.prop || ''] ||
					''

				return `| ${item.props?.prop || ''} | \`${item.props?.type.replaceAll('|', '\\|') || ' '}\` | ${
					item.props?.optional
						? lang === 'zh'
							? '是'
							: 'True'
						: lang === 'zh'
							? '否'
							: 'False'
				} | \`${item.props?.defaultValue.replaceAll('|', '\\|') || ' '}\` | ${description} | ${item.version} |`
			})
			return [headerLine, separatorLine, ...rows].join('\n')
		} else if (group.nodeApiType === 'events') {
			const headers =
				lang === 'zh'
					? ['事件', '参数', '描述', '版本']
					: ['Event', 'Parameter', 'Description', 'Version']
			const headerLine = `| ${headers.join(' | ')} |`
			const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`
			const rows = group.items.map((item) => {
				const description = docMap[`events.${item.events?.event || ''}`] || ''
				return `| ${item.events?.event || ''} | \`${
					item.events?.params
						.map((param) => {
							return `${param.paramName}: ${param.paramType}`
						})
						.join(', ')
						.replaceAll('|', '\\|') || ' '
				}\` | ${description} | ${item.version} |`
			})
			return [headerLine, separatorLine, ...rows].join('\n')
		} else if (group.nodeApiType === 'slots') {
			const headers =
				lang === 'zh'
					? ['插槽', '参数', '描述', '版本']
					: ['Slot', 'Parameter', 'Description', 'Version']
			const headerLine = `| ${headers.join(' | ')} |`
			const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`
			const rows = group.items.map((item) => {
				const description = docMap[`slots.${item.slots?.slot || ''}`] || ''
				return `| ${item.slots?.slot || ''} | \`${
					item.slots?.params
						.map((param) => {
							return `${param.paramName}: ${param.paramType}`
						})
						.join(', ')
						.replaceAll('|', '\\|') || ' '
				}\` | ${description} | ${item.version} |`
			})
			return [headerLine, separatorLine, ...rows].join('\n')
		}
	})
}

export function resolve(
	tsFile: string,
	compName: string,
	lang: string,
	docMap: Record<string, string>
) {
	const project = new Project()
	const sourceFile = project.addSourceFileAtPath(tsFile)

	const ans: string[] = []
	sourceFile.forEachChild((node) => {
		if (
			node.getKind() === SyntaxKind.TypeAliasDeclaration ||
			node.getKind() === SyntaxKind.InterfaceDeclaration
		) {
			const name = (node as any).getName()
			const props = getProps(node as any, compName)
			if (props.length) {
				ans.push(`### ${name}\n${propsToMarkdown(props, lang, docMap)}`)
			}
		}
	})
	return ans.join('\n\n')
}
