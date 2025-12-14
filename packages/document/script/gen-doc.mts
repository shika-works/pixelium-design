import { promises as fs } from 'fs'
import * as path from 'path'
import { kebabCase, pairsToObject, pascalCase } from 'parsnip-kit'
import { resolve } from './resolve-api.mts'

const BLOCK_RE = /\[\[\[\s*([a-zA-Z-]+)([\s\S]*?)\]\]\]/g
const API_BLOCK_RE = /\[\[\[api(?: +([a-zA-Z-]+))? +([a-zA-Z-]+)(\s*[\s\S]*?\]\]\])/g
const collapseNewlines = (s: string): string => s.trim().replace(/\n{3,}/g, '\n\n')

function getValidLineNumber(mdContent: string): number {
	const lines = mdContent.split(/\r?\n/)
	let inFrontmatter = false
	let frontmatterStartLine = -1
	let frontmatterEndLine = -1

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		if (!inFrontmatter && line === '---') {
			inFrontmatter = true
			frontmatterStartLine = i
			continue
		}
		if (inFrontmatter && line === '---') {
			frontmatterEndLine = i
			inFrontmatter = false
			break
		}
	}

	if (frontmatterStartLine === -1 || frontmatterEndLine === -1) {
		return 0
	}
	for (let i = frontmatterEndLine + 1; i < lines.length; i++) {
		const originalLine = lines[i]
		if (originalLine.trim().length > 0) {
			return i
		}
	}
	return frontmatterEndLine + 1
}

async function processMd(src: string, dst: string, lang: string): Promise<void> {
	const text = await fs.readFile(src, 'utf8')
	let newText = text.replace(BLOCK_RE, (_: any, l: string, c: any) => {
		return l === 'api' ? _ : l === lang ? c || '' : ''
	})
	newText = newText.replace(
		API_BLOCK_RE,
		(_: any, compName: string, curLang: string, content: string) => {
			if (curLang !== lang) {
				return ''
			}

			const docMap = pairsToObject(
				content
					.split('\n')
					.map((line: string) => {
						const arr = line.split(':')
						if (arr.length < 2) {
							return []
						}
						return [arr.slice(0, -1).join(':'), arr[arr.length - 1]]
					})
					.filter((parts: string[]) => parts.length === 2)
					.map((parts: string[]) => parts.map((str) => str.trim()))
			)

			const fileName = kebabCase(compName || path.basename(src, '.md'))
			return resolve(`../web-vue/lib/${fileName}/type.ts`, pascalCase(fileName), lang, docMap)
		}
	)
	newText = collapseNewlines(newText)
	await fs.mkdir(path.dirname(dst), { recursive: true })
	if (lang === 'en' && path.basename(src) === 'index.md') {
		await fs.writeFile('./index.md', newText, 'utf8')
	}
	if (lang !== 'zh' && path.basename(src) !== 'index.md') {
		const idx = getValidLineNumber(newText)
		const rows = newText.split(/\r?\n/)
		newText = [
			...rows.slice(0, idx),
			'\n<div style="font-size: 0.8em; color: #777; text-align: right;">🌏 Translated with the assistance of DeepSeek and ChatGPT</div>\n',
			...rows.slice(idx)
		].join('\n')
	}
	await fs.writeFile(dst, newText, 'utf8')
}

async function build(lang: string): Promise<void> {
	const templateDir = path.resolve('template')
	const outDir = path.resolve(lang)
	await fs.rm(outDir, { recursive: true, force: true })

	const walk = async (rel = '') => {
		const dir = path.join(templateDir, rel)
		for (const name of await fs.readdir(dir, { withFileTypes: true })) {
			const src = path.join(dir, name.name)
			const dst = path.join(outDir, rel, name.name)
			if (name.isDirectory()) {
				await walk(path.join(rel, name.name))
			} else {
				await fs.mkdir(path.dirname(dst), { recursive: true })
				if (name.name.toLowerCase().endsWith('.md')) {
					await processMd(src, dst, lang)
				} else {
					await fs.copyFile(src, dst)
				}
			}
		}
	}
	await walk()
}

const lang = ['zh', 'en']
lang.forEach((l) => {
	build(l)
})
