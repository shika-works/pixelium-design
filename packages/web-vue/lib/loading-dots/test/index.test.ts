import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import less from 'less'
import { mount } from '@vue/test-utils'
import LoadingDots from '../index.vue'
import { generatePalette, rgbaColor2string } from '../../share/util/color'
import { createMocks } from '../../share/util/test'

const mountDots = (props: Record<string, any> = {}) => mount(LoadingDots, { props })

const root = (wrapper: any) => wrapper.find('.px-loading-dots')
const dots = (wrapper: any) => wrapper.findAll('.px-loading-dots-dot')
const styleOf = (node: any) => node.attributes('style') || ''
const delayOf = (node: any) => styleOf(node).match(/animation-delay: ([^;]+)/)?.[1]

describe('LoadingDots', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders three dots on the primary theme by default', () => {
		const wrapper = mountDots()
		expect(root(wrapper).element.tagName).toBe('SPAN')
		expect(root(wrapper).classes()).toContain('px-loading-dots')
		expect(root(wrapper).classes()).toContain('px-loading-dots__primary')
		expect(root(wrapper).classes()).toContain('px-loading-dots__smooth')
		expect(dots(wrapper)).toHaveLength(3)
		expect(dots(wrapper).every((dot: any) => dot.element.tagName === 'I')).toBe(true)
	})

	it.each(['smooth', 'pixel'])('applies the %s variant class', (variant) => {
		expect(root(mountDots({ variant })).classes()).toContain(`px-loading-dots__${variant}`)
	})

	it('renders the given count', () => {
		expect(dots(mountDots({ count: 1 }))).toHaveLength(1)
		expect(dots(mountDots({ count: 5 }))).toHaveLength(5)
	})

	it.each(['primary', 'sakura', 'success', 'warning', 'danger', 'info', 'notice'])(
		'applies the %s theme class',
		(theme) => {
			expect(root(mountDots({ theme })).classes()).toContain(`px-loading-dots__${theme}`)
		}
	)

	it('leaves the dot size and the interval to the stylesheet by default', () => {
		const wrapper = mountDots()
		expect(styleOf(root(wrapper))).toBe('')
		expect(styleOf(dots(wrapper)[0])).not.toContain('width')
		expect(styleOf(dots(wrapper)[0])).not.toContain('height')
		expect(styleOf(dots(wrapper)[0])).not.toContain('gap')
	})

	it('writes the dot size on every dot', () => {
		const sized = mountDots({ dotSize: 8 })
		expect(
			dots(sized).every(
				(dot: any) =>
					styleOf(dot).includes('width: 8px') && styleOf(dot).includes('height: 8px')
			)
		).toBe(true)
		expect(styleOf(dots(mountDots({ dotSize: '6px' }))[0])).toContain('width: 6px')
	})

	it('writes the interval as the gap of the root', () => {
		expect(styleOf(root(mountDots({ interval: 8 })))).toContain('gap: 8px')
		expect(styleOf(root(mountDots({ interval: '1rem' })))).toContain('gap: 1rem')
		expect(styleOf(dots(mountDots({ interval: 8 }))[0])).not.toContain('gap')
	})

	it('staggers the dots by a 1/8 cycle at the default count', () => {
		const wrapper = mountDots()
		expect(dots(wrapper).map(delayOf)).toEqual(['0ms', '150ms', '300ms'])
		expect(styleOf(dots(wrapper)[0])).toContain('animation-duration: 1200ms')
	})

	it('scales the stagger with the count and the duration', () => {
		const wrapper = mountDots({ count: 5, animationDuration: 600 })
		// step = 600 / (5 * 2 + 2)
		expect(dots(wrapper).map(delayOf)).toEqual(['0ms', '50ms', '100ms', '150ms', '200ms'])
		expect(styleOf(dots(wrapper)[4])).toContain('animation-duration: 600ms')
	})

	it('follows a changed count and duration', async () => {
		const wrapper = mountDots()
		await wrapper.setProps({ count: 4, animationDuration: 800 })
		expect(dots(wrapper)).toHaveLength(4)
		expect(delayOf(dots(wrapper)[3])).toBe('240ms')
	})

	it('overrides the theme colour with color and keeps the css variables out of the markup', () => {
		const wrapper = mountDots({ color: '#8b5cf6' })
		expect(styleOf(root(wrapper))).toContain('color: rgb(139, 92, 246)')
		expect(wrapper.html()).not.toContain('--px')
	})

	it('takes the resting tone of a custom colour from its own 5th palette step', () => {
		const wrapper = mountDots({ color: '#8b5cf6' })
		const palette = generatePalette(139, 92, 246, 255, false)
		expect(styleOf(root(wrapper))).toContain(
			`--loading-dots-idle-color: ${rgbaColor2string(palette[4])}`
		)
		expect(styleOf(root(mountDots()))).not.toContain('--loading-dots-idle-color')
	})

	it('keeps the tone of a colour the parser cannot read', () => {
		expect(styleOf(root(mountDots({ color: 'currentColor' })))).toContain(
			'--loading-dots-idle-color: currentColor'
		)
	})
})

describe('LoadingDots stylesheet', () => {
	// cwd is the package root, as in the other stylesheet tests
	const lessFile = resolve('lib/loading-dots/index.less')
	const css = less
		.render(readFileSync(lessFile, 'utf-8'), { filename: lessFile })
		.then((result) => result.css)

	const keyframesOf = (source: string, name: string) => {
		const start = source.indexOf(`@keyframes ${name}`)
		const next = source.indexOf('@keyframes', start + 1)
		return source.slice(start, next === -1 ? undefined : next)
	}

	it('uses the palette for the resting tone instead of opacity or blending', async () => {
		const style = await css
		expect(style).not.toContain('opacity')
		expect(style).not.toContain('color-mix')
		expect(style).toContain('color: var(--px-neutral-9)')
		expect(style).toContain('--loading-dots-idle-color: var(--px-neutral-8)')
	})

	it.each(['primary', 'sakura', 'success', 'warning', 'danger', 'notice'])(
		'takes the resting tone of the %s theme from the 5th palette step',
		async (theme) => {
			expect(await css).toContain(`--loading-dots-idle-color: var(--px-${theme}-5)`)
		}
	)

	it.each(['px-loading-dots-bounce', 'px-loading-dots-step'])(
		'changes the tone along the %s animation',
		async (name) => {
			const keyframes = keyframesOf(await css, name)
			expect(keyframes).toContain('color: var(--loading-dots-idle-color)')
			expect(keyframes).toContain('color: currentColor')
		}
	)
})
