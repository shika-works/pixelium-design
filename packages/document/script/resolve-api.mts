import {
	Project,
	SyntaxKind,
	TypeAliasDeclaration,
	InterfaceDeclaration,
	PropertySignature,
	IndexSignatureDeclaration
} from 'ts-morph'
import { parse } from 'comment-parser'
import { camelCase } from 'parsnip-kit'

const resolveJsDoc = (
	prop: PropertySignature | IndexSignatureDeclaration,
	nodeName: string,
	nodeApiType: 'props' | 'events' | 'slots',
	container: PropItem[]
) => {
	let version = '',
		propType = ''
	const jsDocs = prop.getJsDocs()[0]?.getText()
	const feedbackName = prop instanceof PropertySignature ? prop.getName() : prop.getText()
	if (jsDocs) {
		const parsed = parse(jsDocs)
		version = parsed[0]?.tags.find((tag) => tag.tag === 'version')?.name || ''
		if (nodeApiType === 'props') {
			const propertyTag = parsed[0]?.tags.find((tag) => tag.tag === 'property')
			const name = propertyTag?.name || feedbackName
			const optional = propertyTag?.optional || false
			const ignore = parsed[0]?.tags.find((tag) => tag.tag === 'ignore')
			propType = propertyTag?.type || ''
			const defaultValue = propertyTag?.default || ''

			if (!ignore) {
				container.push({
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
			}
		} else if (nodeApiType === 'events') {
			const eventTag = parsed[0]?.tags.find((tag) => tag.tag === 'event')
			const name = eventTag?.name || feedbackName
			const data = {
				nodeName,
				nodeApiType,
				version,
				events: {
					event: name,
					params: [] as {
						paramName: string
						paramType: string
						optional?: boolean
					}[]
				}
			}
			const paramTags = parsed[0]?.tags.filter((tag) => tag.tag === 'param')
			paramTags.forEach((tag) => {
				data.events.params.push({
					paramType: tag?.type || '',
					paramName: tag?.name || '',
					optional: tag?.optional || false
				})
			})
			container.push(data)
		} else if (nodeApiType === 'slots') {
			const slotTag = parsed[0]?.tags.find((tag) => tag.tag === 'slot')
			const name = slotTag?.name || feedbackName
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
			container.push(data)
		}
	}
}

type PropItem = {
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
			optional?: boolean
		}[]
	}
	slots?: {
		slot: string
		params: {
			paramName: string
			paramType: string
		}[]
	}
}

function getProps(node: TypeAliasDeclaration | InterfaceDeclaration, compName: string) {
	const props: PropItem[] = []
	const nodeName = node.getName()
	const nodeApiType =
		nodeName === `${compName}Events`
			? 'events'
			: nodeName === `${compName}Slots`
				? 'slots'
				: 'props'
	if (!nodeApiType) return props
	node
		.getDescendantsOfKind(SyntaxKind.PropertySignature)
		.forEach((e) => resolveJsDoc(e, nodeName, nodeApiType, props))
	node
		.getDescendantsOfKind(SyntaxKind.IndexSignature)
		.forEach((e) => resolveJsDoc(e, nodeName, nodeApiType, props))

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

				const name = (item.props?.prop || '').replaceAll('|', '\\|')
				return `| ${name} | \`${item.props?.type.replaceAll('|', '\\|') || ' '}\` | ${
					item.props?.optional
						? lang === 'zh'
							? '是'
							: 'True'
						: lang === 'zh'
							? '否'
							: 'False'
				} | \`${item.props?.defaultValue.replaceAll('|', '\\|') || ' '}\` | ${description.replaceAll('|', '\\|')} | ${item.version} |`
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
				const name = (item.events?.event || '').replaceAll('|', '\\|')
				return `| ${name} | \`${
					item.events?.params
						.map((param) => {
							return `${param.paramName}${param.optional ? '?' : ''}: ${param.paramType}`
						})
						.join(', ')
						.replaceAll('|', '\\|') || ' '
				}\` | ${description.replaceAll('|', '\\|')} | ${item.version} |`
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
				const name = (item.slots?.slot || '').replaceAll('|', '\\|')
				return `| ${name} | \`${
					item.slots?.params
						.map((param) => {
							return `${param.paramName}: ${param.paramType}`
						})
						.join(', ')
						.replaceAll('|', '\\|') || ' '
				}\` | ${description.replaceAll('|', '\\|')} | ${item.version} |`
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
