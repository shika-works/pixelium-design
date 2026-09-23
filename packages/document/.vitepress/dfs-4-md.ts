import fs from 'fs'
import { titleCase } from 'parsnip-kit'
import { order, guideOrder, dualCategoryItems } from './share'

const badge = `<span class="VPBadge tip" style="background-color: rgba(203, 231, 202, 1);color: rgba(0, 180, 42, 1)">NEW!</span>`

const groupText = (
	name: string,
	titleMap: Record<string, string>,
	additionMap: Record<string, string>
) => {
	const add = additionMap?.[name.toLowerCase()]
	return (titleMap[name.toLowerCase()] || titleCase(name)) + (add ? `  ${add}` : '')
}

const dfs = (
	files: string[],
	prefix: string[],
	container: any[],
	titleMap: Record<string, string>,
	additionMap: Record<string, string>,
	newItems: string[]
) => {
	files.forEach((file) => {
		if (['.vitepress', 'index.md', 'template', 'script'].includes(file)) {
			return
		}
		const fullPath = prefix.join('/') + `/${file}`
		if (fs.statSync(fullPath).isDirectory()) {
			const curFiles = fs.readdirSync(fullPath)
			prefix.push(file)
			const curContainer = [] as any[]

			container.push({
				key: file,
				text: groupText(file, titleMap, additionMap),
				items: curContainer,
				collapsible: true,
				collapsed: false
			})
			dfs(curFiles, prefix, curContainer, titleMap, additionMap, newItems)
			prefix.pop()
		} else {
			const [fileName, ext] = file.split('.')
			if (ext !== 'md') {
				return
			}
			const add = additionMap?.[fileName.toLowerCase()]

			container.push({
				text:
					(titleMap[fileName.toLowerCase()] || titleCase(fileName)) +
					(add ? `  ${add}` : '') +
					(newItems.includes(fileName) ? ` ${badge}` : ''),
				link: '/' + prefix.slice(0).join('/') + `/${fileName}`,
				key: fileName
			})
		}
	})
}

/**
 * 双重归属：把主分类中已有的组件条目复制一份挂到场景分类下，场景分类里没有页面时按分组规则补建。
 * 复制出的条目与主分类共用同一个 link，页面内容只有一份。
 */
const injectDualCategoryItems = (
	container: any[],
	titleMap: Record<string, string>,
	additionMap: Record<string, string>
) => {
	const findItem = (items: any[], key: string): any => {
		for (const item of items) {
			if (item.key?.toLowerCase() === key) {
				return item
			}
			if (item.items) {
				const found = findItem(item.items, key)
				if (found) {
					return found
				}
			}
		}
		return undefined
	}

	Object.keys(dualCategoryItems).forEach((groupKey) => {
		let group = container.find((item) => item.key?.toLowerCase() === groupKey)
		if (!group) {
			group = {
				key: groupKey,
				text: groupText(groupKey, titleMap, additionMap),
				items: [],
				collapsible: true,
				collapsed: false
			}
			container.push(group)
		}
		dualCategoryItems[groupKey].forEach((itemName) => {
			const key = itemName.toLowerCase()
			const entity = findItem(container, key)
			if (entity && !group.items.some((item: any) => item.key?.toLowerCase() === key)) {
				group.items.push({ ...entity })
			}
		})
	})
}

export const dfs4Md = (
	lang: string,
	titleMap: Record<string, string>,
	additionMap: Record<string, string>,
	newItems: string[]
) => {
	const ans: any[] = []
	const files = fs.readdirSync(lang)
	dfs(files, [lang], ans, titleMap, additionMap, newItems)
	injectDualCategoryItems(ans, titleMap, additionMap)
	const orderedAns: any[] = []
	order.forEach((e) => {
		const entity = ans.find((item) => item.key?.toLowerCase() === e)
		if (entity) {
			orderedAns.push(entity)
		}
	})

	const guidePages = orderedAns.find((e) => e.key?.toLowerCase() === 'guide')
	const cloned = [...guidePages.items]
	guidePages.items = []

	guideOrder.forEach((e) => {
		const entity = cloned.find((item) => item.key?.toLowerCase() === e)
		if (entity) {
			guidePages.items.push(entity)
		}
	})

	return orderedAns
}
