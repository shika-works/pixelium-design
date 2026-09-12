import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import less from 'less'

// cwd is the package root; `import.meta.url` isn't a `file:` url under vitest's module runner
const ourLessFile = resolve('lib/scroll-bar/index.less')
const osCssFile = resolve('node_modules/overlayscrollbars/styles/overlayscrollbars.css')

const SHORTHANDS: Record<string, string[]> = {
	border: ['width', 'style', 'color'].flatMap((s) =>
		['top', 'right', 'bottom', 'left'].map((side) => `border-${side}-${s}`)
	),
	background: ['background-color', 'background-clip', 'background-image', 'background-origin'],
	transition: ['transition-property', 'transition-duration', 'transition-timing-function']
}
const longhands = (prop: string) => SHORTHANDS[prop] ?? [prop]

type Rule = { selector: string; props: string[] }

const parseRules = (css: string): Rule[] =>
	[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
		selector: m[1].replace(/\s+/g, ' ').trim(),
		props: m[2]
			.split(';')
			.map((declaration) => declaration.split(':')[0]?.trim() ?? '')
			.filter(Boolean)
			.flatMap(longhands)
	}))

/** [ids, classes/attributes/pseudo-classes, elements/pseudo-elements] */
const specificity = (selector: string): [number, number, number] => {
	const clean = selector.replace(/\([^)]*\)/g, '')
	const ids = (clean.match(/#[\w-]+/g) || []).length
	const classes = (clean.match(/\.[\w-]+/g) || []).length
	const attributes = (clean.match(/\[[^\]]*\]/g) || []).length
	const pseudoClasses = (clean.match(/:(?!:)[\w-]+/g) || []).length
	const pseudoElements = (clean.match(/::[\w-]+/g) || []).length
	const elements = (
		clean.replace(/[#.][\w-]+|\[[^\]]*\]|::?[\w-]+/g, '').match(/[a-zA-Z][\w-]*/g) || []
	).length
	return [ids, classes + attributes + pseudoClasses, elements + pseudoElements]
}

const outranks = (a: number[], b: number[]) =>
	a.some(
		(value, i) => value !== b[i] && value > b[i] && a.slice(0, i).every((v, j) => v === b[j])
	)

const compareSpecs = (a: number[], b: number[]) =>
	outranks(a, b) ? 1 : outranks(b, a) ? -1 : 0

const PSEUDO_ELEMENT =
	/(::|:(before|after|first-line|first-letter|placeholder|selection|marker|backdrop)\b)/
const isHandleCompound = (compound: string) =>
	compound.includes('.os-scrollbar-handle') &&
	!PSEUDO_ELEMENT.test(compound.replace(/\.os-scrollbar-handle/, ''))

const THEMES = ['.px-scroll-theme', '.px-scroll-simple-theme']

describe('scroll-bar themes', () => {
	// A tie with OS's `:hover` / `:active` is resolved by stylesheet order, so out-specify it.
	it('strictly out-specifies OverlayScrollbars for every property declared on the handle', async () => {
		const ourCss = (
			await less.render(readFileSync(ourLessFile, 'utf-8'), { filename: ourLessFile })
		).css
		const ourRules = parseRules(ourCss)

		const osEntries = parseRules(readFileSync(osCssFile, 'utf-8')).flatMap((rule) =>
			rule.selector
				.split(',')
				.map((part) => part.trim())
				.flatMap((part) => {
					const compound =
						part
							.split(/[>+~]|\s+/)
							.filter(Boolean)
							.at(-1) ?? ''
					return isHandleCompound(compound)
						? [{ spec: specificity(part), props: rule.props }]
						: []
				})
		)

		for (const theme of THEMES) {
			// the handle itself, not ::after / :hover
			const base = ourRules.find((rule) => {
				const compound =
					rule.selector
						.split(/[>+~]|\s+/)
						.filter(Boolean)
						.at(-1) ?? ''
				return rule.selector.includes(theme) && compound === '.os-scrollbar-handle'
			})
			expect(base, `no base rule found for \`${theme} .os-scrollbar-handle\``).toBeTruthy()

			const ourSpec = specificity(base!.selector)
			for (const prop of new Set(base!.props)) {
				const worst = osEntries
					.filter((entry) => entry.props.includes(prop))
					.map((entry) => entry.spec)
					.sort(compareSpecs)
					.at(-1)

				expect(
					worst === undefined || outranks(ourSpec, worst),
					`\`${base!.selector}\`: \`${prop}\` loses to an OverlayScrollbars rule ` +
						`(ours [${ourSpec}] vs OS [${worst}]). Keep \`.os-scrollbar\` on the selector, ` +
						'so an OS `border` / `background` shorthand cannot reset it.'
				).toBe(true)
			}
		}
	})
})
