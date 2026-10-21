import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { computed, nextTick, ref } from 'vue'
import ActionListItem from '../index.vue'
import { ACTION_LIST_PROVIDE } from '../../share/const/provide-key'
import type { ActionListProvide } from '../../action-list/type'
import type { ActionListItemIndex } from '../type'
import { createMocks } from '../../share/util/test'

const stubs = {
	CheckSolid: true,
	EllipsesHorizontalSolid: true,
	ExclaimationSolid: true,
	Minus: true,
	RefreshSolid: true,
	TimesSolid: true
}

const createProvide = (overrides: Partial<ActionListProvide> = {}): ActionListProvide => {
	const expandedIndices = ref<ActionListItemIndex[] | undefined | null>([])
	return {
		size: computed(() => 'medium' as const),
		spacing: computed<number | string | undefined>(() => undefined),
		lineVariant: computed(() => 'solid' as const),
		animationDuration: computed(() => 0),
		expandedIndices,
		toggle: (index) => {
			const current = expandedIndices.value ?? []
			expandedIndices.value = current.includes(index)
				? current.filter((entry) => entry !== index)
				: [...current, index]
		},
		itemExpandedChange: () => {},
		id: 'test',
		...overrides
	}
}

const mountItem = (
	props: Record<string, any> = {},
	provide: Partial<ActionListProvide> = {},
	slots: Record<string, any> = {}
) =>
	mount(ActionListItem, {
		props: { index: 0, ...props },
		global: { stubs, provide: { [ACTION_LIST_PROVIDE]: createProvide(provide) } },
		slots
	})

const el = (wrapper: any, selector: string) => wrapper.find(selector)
const item = (wrapper: any) => el(wrapper, '.px-action-list-item')
const header = (wrapper: any) => el(wrapper, '.px-action-list-item-header')
const detail = (wrapper: any) => el(wrapper, '.px-action-list-item-detail')
const arrow = (wrapper: any) => el(wrapper, '.px-action-list-item-arrow')
const main = (wrapper: any) => el(wrapper, '.px-action-list-item-main')
const styleOf = (node: any) => node.attributes('style') || ''
const isCollapsedDetail = (node: any) => styleOf(node).includes('height: 0px')
// jsdom lays nothing out, so the measured content box is stubbed while the row is expanded.
const stubDetailHeight = (wrapper: any, height = 40) => {
	Object.defineProperty(
		el(wrapper, '.px-action-list-item-detail-box').element,
		'offsetHeight',
		{
			value: height,
			configurable: true
		}
	)
}
const isExpanded = (wrapper: any) =>
	item(wrapper).classes().includes('px-action-list-item__expanded')
const clickHeader = async (wrapper: any) => {
	await header(wrapper).trigger('click')
	await flushPromises()
}

const setWidths = (node: any, clientWidth: number, scrollWidth: number) => {
	Object.defineProperty(node.element, 'clientWidth', { value: clientWidth, configurable: true })
	Object.defineProperty(node.element, 'scrollWidth', { value: scrollWidth, configurable: true })
}

describe('ActionListItem', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	describe('rendering', () => {
		it('renders the sections and the row texts', () => {
			const wrapper = mountItem({
				title: 'Read the settings body',
				content: 'Geography and Domains',
				detail: '7 hard facts'
			})
			expect(item(wrapper).classes()).toContain('px-action-list-item')
			expect(el(wrapper, '.px-action-list-item-indicator').exists()).toBe(true)
			expect(el(wrapper, '.px-action-list-item-line').exists()).toBe(true)
			expect(el(wrapper, '.px-action-list-item-icon').exists()).toBe(true)
			expect(main(wrapper).exists()).toBe(true)
			expect(header(wrapper).exists()).toBe(true)
			expect(el(wrapper, '.px-action-list-item-title').text()).toContain(
				'Read the settings body'
			)
			expect(el(wrapper, '.px-action-list-item-content').text()).toContain(
				'Geography and Domains'
			)
			expect(detail(wrapper).text()).toContain('7 hard facts')

			const bare = mountItem({ title: 'Search settings' })
			expect(el(bare, '.px-action-list-item-content').exists()).toBe(false)
			expect(detail(bare).exists()).toBe(false)
		})

		it('marks and measures the ellipsis header', async () => {
			expect(item(mountItem()).classes()).not.toContain('px-action-list-item__ellipsis')

			const wrapper = mountItem({
				ellipsis: true,
				title: 'Read the settings body',
				content: 'Geography and Domains'
			})
			expect(item(wrapper).classes()).toContain('px-action-list-item__ellipsis')
			expect(item(wrapper).classes()).not.toContain('px-action-list-item__title-overflow')
			expect(el(wrapper, '.px-action-list-item-content').exists()).toBe(true)

			setWidths(el(wrapper, '.px-action-list-item-header'), 300, 420)
			await wrapper.setProps({ title: 'Read the settings body of the world settings' })
			await nextTick()
			expect(item(wrapper).classes()).toContain('px-action-list-item__title-overflow')

			setWidths(el(wrapper, '.px-action-list-item-title'), 300, 240)
			await wrapper.setProps({ title: 'Read the settings body' })
			await nextTick()
			expect(item(wrapper).classes()).not.toContain('px-action-list-item__title-overflow')

			const plain = mountItem({ title: 'Search settings', content: 'Geography and Domains' })
			setWidths(el(plain, '.px-action-list-item-header'), 300, 420)
			await plain.setProps({ content: 'Geography and Domains, Aetheria (2 hits)' })
			await nextTick()
			expect(item(plain).classes()).not.toContain('px-action-list-item__title-overflow')
		})

		it('renders the row slots over the props', () => {
			const wrapper = mountItem(
				{ status: 'error', title: 'ignored', content: 'ignored', expandable: true },
				{ expandedIndices: ref<ActionListItemIndex[]>([0]) },
				{
					icon: '<span class="custom-icon">{{ params.status }}</span>',
					title: '<span class="custom-title">Rewrite the draft</span>',
					content: '<span class="custom-content">Geography and Domains - gate</span>',
					detail: '<p class="custom-detail">Keep the existing hard facts</p>'
				}
			)
			expect(el(wrapper, '.custom-icon').text()).toBe('error')
			expect(el(wrapper, '.px-action-list-item-icon svg').exists()).toBe(false)
			expect(el(wrapper, '.custom-title').text()).toBe('Rewrite the draft')
			expect(el(wrapper, '.custom-content').text()).toBe('Geography and Domains - gate')
			expect(el(wrapper, '.custom-detail').text()).toBe('Keep the existing hard facts')
		})

		it('applies the status class and renders its icon', () => {
			const statuses = ['pending', 'running', 'success', 'warning', 'error', 'skipped']
			statuses.forEach((status) => {
				const wrapper = mountItem({ status })
				const icon = el(wrapper, '.px-icon-hn')
				expect(item(wrapper).classes()).toContain(`px-action-list-item__${status}`)
				expect(icon.exists()).toBe(true)
				expect(icon.classes().includes('px-animation__loading-clockwise')).toBe(
					status === 'running'
				)
			})
		})

		it('follows the list size and line variant', () => {
			const large = mountItem({}, { size: computed(() => 'large' as const) })
			const dashed = mountItem({}, { lineVariant: computed(() => 'dashed' as const) })
			expect(item(large).classes()).toContain('px-action-list-item__large')
			expect(item(mountItem()).classes()).toContain('px-action-list-item__medium')
			expect(item(dashed).classes()).toContain('px-action-list-item__line-dashed')
			expect(item(mountItem()).classes()).toContain('px-action-list-item__line-solid')

			const overridden = mountItem(
				{ lineVariant: 'solid' },
				{ lineVariant: computed(() => 'dashed' as const) }
			)
			expect(item(overridden).classes()).toContain('px-action-list-item__line-solid')
			expect(item(overridden).classes()).not.toContain('px-action-list-item__line-dashed')
		})
	})

	describe('color and spacing', () => {
		it('colors the item root from the color prop', () => {
			const element = item(mountItem({ color: '#ff7d00' })).element as HTMLElement
			expect(element.style.color).toBe('rgb(255, 125, 0)')
		})

		it.each([
			[24, 24],
			['1.5rem', '1.5rem'],
			[0, 0]
		])('applies the %s spacing as %s over the list spacing', async (spacing, expected) => {
			const wrapper = mountItem({ spacing }, { spacing: computed(() => 6) })
			await flushPromises()
			expect(styleOf(main(wrapper))).toBe('')
			expect((wrapper.vm as any).spacingValue).toBe(expected)
		})

		it('takes the list spacing when the row has none', async () => {
			const fromList = mountItem({}, { spacing: computed(() => 6) })
			const blank = mountItem({ color: 'red' })
			await flushPromises()
			expect(styleOf(main(fromList))).toBe('')
			expect(styleOf(main(blank))).toBe('')
			expect(blank.html()).not.toContain('--px-')
		})
	})

	describe('expandable', () => {
		it('decides expansion from the detail and the flag', () => {
			const cases: [Record<string, any>, boolean][] = [
				[{ title: 'Review the draft (gate)' }, false],
				[{ title: 'Rewrite the draft', content: 'Geography and Domains' }, false],
				[{ title: 'Rewrite the draft', detail: 'Rewrite the outline' }, true],
				[{ title: 'Publish the draft', expandable: true }, false],
				[{ title: 'Publish the draft', detail: 'outline', expandable: false }, false]
			]
			cases.forEach(([props, expandable]) => {
				const wrapper = mountItem(props)
				expect(arrow(wrapper).exists()).toBe(expandable)
				expect(detail(wrapper).exists()).toBe(expandable)
			})
		})

		it('follows the expanded set of the list', async () => {
			const expandedIndices = ref<ActionListItemIndex[] | undefined | null>([])
			const wrapper = mountItem(
				{ index: 'step-1', detail: 'Keep and reuse the existing hard facts' },
				{ expandedIndices }
			)
			stubDetailHeight(wrapper)
			await nextTick()
			expect(isCollapsedDetail(detail(wrapper))).toBe(true)

			expandedIndices.value = ['step-1']
			await nextTick()
			await nextTick()
			expect(isExpanded(wrapper)).toBe(true)
			expect(isCollapsedDetail(detail(wrapper))).toBe(false)
			expect(styleOf(detail(wrapper))).toContain('height: 40px')
			expect(detail(wrapper).text()).toContain('Keep and reuse the existing hard facts')

			expandedIndices.value = []
			await nextTick()
			await nextTick()
			expect(isExpanded(wrapper)).toBe(false)
			vi.advanceTimersByTime(100)
			await nextTick()
			expect(isCollapsedDetail(detail(wrapper))).toBe(true)
		})

		it('keeps the gap animation off the measured box', async () => {
			const wrapper = mountItem(
				{ detail: 'some detail' },
				{ animationDuration: computed(() => 300) }
			)
			// The hook locks the wrapper to this box and re-measures it once the animation
			// settles, so a transition on the box itself would make the row jump by the gap.
			expect(styleOf(el(wrapper, '.px-action-list-item-detail-box'))).toBe('')
			expect(styleOf(header(wrapper))).toContain('transition: margin-bottom 300ms')
		})
	})

	describe('toggling', () => {
		it('expands on click, rotates the arrow and emits expandedChange', async () => {
			const wrapper = mountItem({ detail: 'some detail' })
			stubDetailHeight(wrapper)
			expect(styleOf(arrow(wrapper))).toContain('transform: rotate(90deg)')
			await clickHeader(wrapper)
			expect(styleOf(arrow(wrapper))).toContain('transform: rotate(180deg)')
			expect(wrapper.emitted('expandedChange')).toEqual([[true]])
			expect(wrapper.emitted('update:expanded')).toBeUndefined()
			expect(isExpanded(wrapper)).toBe(true)
			vi.advanceTimersByTime(100)
			await nextTick()
			expect(isCollapsedDetail(detail(wrapper))).toBe(false)
		})

		it('stays closed without the detail and leaves the state to the list', async () => {
			const plain = mountItem({ title: 'Review the draft (gate)' })
			await clickHeader(plain)
			expect(plain.emitted('expandedChange')).toBeUndefined()

			const toggle = vi.fn()
			const expandedIndices = ref<ActionListItemIndex[] | undefined | null>(undefined)
			const delegated = mountItem(
				{ index: 'step-3', detail: 'some detail' },
				{ expandedIndices, toggle }
			)
			await clickHeader(delegated)
			expect(toggle).toHaveBeenCalledWith('step-3')
			expect(delegated.emitted('expandedChange')).toEqual([[true]])
			expect(isExpanded(delegated)).toBe(false)
		})

		it('reports the row change to the list through the provide', async () => {
			const itemExpandedChange = vi.fn()
			const wrapper = mountItem(
				{ index: 'step-2', title: 'Rewrite the draft', detail: 'some detail' },
				{ itemExpandedChange }
			)
			await clickHeader(wrapper)
			expect(itemExpandedChange).toHaveBeenNthCalledWith(1, 'step-2', true)
			await clickHeader(wrapper)
			expect(itemExpandedChange).toHaveBeenLastCalledWith('step-2', false)

			// a row without a detail never toggles, so it reports nothing either
			await clickHeader(mountItem({ index: 'step-4' }, { itemExpandedChange }))
			expect(itemExpandedChange).toHaveBeenCalledTimes(2)
		})
	})
})
