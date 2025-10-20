import fs from 'fs'
import { titleCase } from 'parsnip-kit'

const dfs = (
	files,
	prefix: string[],
	container: any[],
	titleMap: Record<string, string>,
	additionMap?: Record<string, string>
) => {
	files.forEach((file) => {
		if (['.vitepress', 'index.md', 'template', 'script'].includes(file)) {
			return
		}
		const fullPath = prefix.join('/') + `/${file}`
		if (fs.statSync(fullPath).isDirectory()) {
			const curFiles = fs.readdirSync(fullPath)
			prefix.push(file)
			const curContainer = []
			const add = additionMap?.[file.toLowerCase()]

			container.push({
				key: file,
				text: (titleMap[file.toLowerCase()] || titleCase(file)) + (add ? `  ${add}` : ''),
				items: curContainer,
				collapsible: true,
				collapsed: false
			})
			dfs(curFiles, prefix, curContainer, titleMap, additionMap)
			prefix.pop()
		} else {
			const [fileName, ext] = file.split('.')
			if (ext !== 'md') {
				return
			}
			const add = additionMap?.[fileName.toLowerCase()]

			container.push({
				text:
					(titleMap[fileName.toLowerCase()] || titleCase(fileName)) + (add ? `  ${add}` : ''),
				link: '/' + prefix.slice(0).join('/') + `/${fileName}`,
				key: fileName
			})
		}
	})
}

const order = ['guide', 'config', 'common', 'layout', 'data-input', 'feedback']

const guideOrder = ['intro', 'starting', 'update-plan', 'changelog']

export const dfs4Md = (
	lang: string,
	titleMap: Record<string, string>,
	additionMap?: Record<string, string>
) => {
	const ans: any[] = []
	const files = fs.readdirSync(lang)
	dfs(files, [lang], ans, titleMap, additionMap)
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
