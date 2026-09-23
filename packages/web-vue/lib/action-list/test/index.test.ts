import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import ActionList from '../index.vue'
import ActionListItem from '../../action-list-item/index.vue'
import { createMocks } from '../../share/util/test'
import type { ActionListItemData } from '../type'
import type { ActionListItemIndex } from '../../action-list-item/type'

const EXPANDABLE: ActionListItemData[] = [
	{ title: 'Search settings', expandable: true },
	{ title: 'Thinking', detail: '...', expandable: true },
	{ title: 'Rewrite the draft', detail: 'Rewrite the outline', expandable: true }
]

const mountList = (props: Record<string, any> = {}, slots: Record<string, any> = {}) =>
	mount(ActionList, { props, slots })

const el = (wrapper: any, selector: string) => wrapper.find(selector)
const list = (wrapper: any) => el(wrapper, '.px-action-list')
const items = (wrapper: any) => wrapper.findAll('.px-action-list-item')
const headers = (wrapper: any) => wrapper.findAll('.px-action-list-item-header')
const details = (wrapper: any) => wrapper.findAll('.px-action-list-item-detail')
const mainOf = (node: any) => node.find('.px-action-list-item-main')
const styleOf = (node: any) => node.attributes('style') || ''
// jsdom lays nothing out, so the rendered box is only told apart by the state class.
const isExpandedDetail = (node: any) =>
	node.classes().includes('px-action-list-item-detail__expanded')
const clickHeader = async (wrapper: any, index: number) => {
	await headers(wrapper)[index].trigger('click')
	await flushPromises()
}

const FOLDABLE: ActionListItemData[] = [
	{ title: 'Search settings' },
	{ title: 'Read the settings body' },
	{ title: 'Rewrite the draft' },
	{ title: 'Review the draft' },
	{ title: 'Publish the draft' }
]

const fold = (wrapper: any) => el(wrapper, '.px-action-list-fold')
const foldText = (wrapper: any) => el(wrapper, '.px-action-list-fold-text')
const body = (wrapper: any) => el(wrapper, '.px-action-list-items')
const clickFold = async (wrapper: any) => {
	await fold(wrapper).trigger('click')
	await nextTick()
}

// jsdom lays nothing out, so the folded body reports the height of the rows it renders.
const stubListHeight = (wrapper: any) => {
	Object.defineProperty(body(wrapper).element, 'offsetHeight', {
		configurable: true,
		get(this: HTMLElement) {
			return this.querySelectorAll('.px-action-list-item').length * 40
		}
	})
}

describe('ActionList', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	it('applies the size, line variant and fold placement classes', () => {
		const defaults = list(mountList()).classes()
		expect(defaults).toContain('px-action-list')
		expect(defaults).toContain('px-action-list__medium')
		expect(defaults).toContain('px-action-list__line-solid')
		expect(defaults).toContain('px-action-list__fold-start')

		const customized = list(
			mountList({ size: 'large', lineVariant: 'dashed', foldPlacement: 'end' })
		).classes()
		expect(customized).toContain('px-action-list__large')
		expect(customized).toContain('px-action-list__line-dashed')
		expect(customized).toContain('px-action-list__fold-end')
	})

	it('provides the size and line variant to the rows', () => {
		const wrapper = mountList({ items: EXPANDABLE, size: 'large', lineVariant: 'dashed' })
		const rendered = items(wrapper)
		expect(rendered[0].classes()).toContain('px-action-list-item__large')
		expect(rendered[0].classes()).toContain('px-action-list-item__line-dashed')
	})

	describe('items mode', () => {
		it('builds every row from the data and forwards its flags', () => {
			const wrapper = mountList({
				items: [
					{ status: 'success', title: 'Search settings', content: 'Geography and Domains' },
					{ status: 'running', title: 'Review the draft (gate)', ellipsis: true }
				]
			})
			const rendered = wrapper.findAllComponents(ActionListItem)
			expect(items(wrapper)).toHaveLength(2)
			expect(el(wrapper, '.px-action-list-item-title').text()).toBe('Search settings')
			expect(el(wrapper, '.px-action-list-item-content').text()).toBe('Geography and Domains')
			expect(rendered[0].classes()).toContain('px-action-list-item__success')
			expect(rendered[1].props('status')).toBe('running')
			expect(rendered.map((entry) => entry.props('ellipsis'))).toEqual([false, true])
		})

		it('lets the row data override the line variant of the list', () => {
			const wrapper = mountList({
				lineVariant: 'dashed',
				items: [
					{ title: 'Search settings', lineVariant: 'solid' },
					{ title: 'Rewrite the draft' }
				]
			})
			const rendered = items(wrapper)
			expect(rendered[0].classes()).toContain('px-action-list-item__line-solid')
			expect(rendered[1].classes()).toContain('px-action-list-item__line-dashed')
		})

		it('lets the data decide which rows stay closed to expansion', () => {
			const wrapper = mountList({
				items: [
					{ title: 'Search settings' },
					{ title: 'Read the settings body', detail: '2 hits', expandable: false },
					{ title: 'Rewrite the draft', detail: 'Rewrite the outline', expandable: true }
				]
			})
			const forwarded = wrapper.findAllComponents(ActionListItem)
			// the row default of the item fills the flag in, and only rows with a detail expand
			expect(forwarded.map((entry) => entry.props('expandable'))).toEqual([true, false, true])
			expect(
				items(wrapper).map((row: any) => row.find('.px-action-list-item-arrow').exists())
			).toEqual([false, false, true])
		})

		it('expands the rows listed in defaultExpanded', async () => {
			const wrapper = mountList({ items: EXPANDABLE, defaultExpanded: [0, 1] })
			await flushPromises()
			expect(
				items(wrapper).map((row: any) =>
					row.classes().includes('px-action-list-item__expanded')
				)
			).toEqual([true, true, false])
			// only the rows carrying a detail render a box
			expect(details(wrapper)).toHaveLength(2)
			expect(isExpandedDetail(details(wrapper)[0])).toBe(true)
			expect(isExpandedDetail(details(wrapper)[1])).toBe(false)
		})

		it('toggles a row on click and reports the row with its identifier', async () => {
			const wrapper = mountList({
				items: [
					{ index: 'search', title: 'Search settings', detail: '2 hits' },
					{ index: 'rewrite', title: 'Rewrite the draft', detail: 'Rewrite the outline' }
				]
			})
			await clickHeader(wrapper, 1)
			expect(isExpandedDetail(details(wrapper)[1])).toBe(true)
			expect(wrapper.emitted('itemExpandedChange')).toEqual([
				[
					{ index: 'rewrite', title: 'Rewrite the draft', detail: 'Rewrite the outline' },
					true,
					'rewrite'
				]
			])
			await clickHeader(wrapper, 1)
			vi.advanceTimersByTime(300)
			await nextTick()
			expect(wrapper.emitted('itemExpandedChange')![1][1]).toBe(false)
			expect(isExpandedDetail(details(wrapper)[1])).toBe(false)
		})

		it('reports the expanded set as a copy that cannot reach the state', async () => {
			const wrapper = mountList({
				items: [
					{ title: 'Search settings', detail: '2 hits' },
					{ title: 'Rewrite the draft', detail: 'Rewrite the outline' }
				]
			})
			await clickHeader(wrapper, 0)
			expect(wrapper.emitted('expandedChange')).toEqual([[[0]]])

			const payload = wrapper.emitted('expandedChange')![0][0] as ActionListItemIndex[]
			payload.push(1)
			await nextTick()
			expect(details(wrapper).map(isExpandedDetail)).toEqual([true, false])
		})

		it('reports the expanded array to the list and follows it back', async () => {
			const wrapper = mountList({
				items: [
					{ index: 'a', title: 'a', detail: 'x' },
					{ index: 'b', title: 'b', detail: 'y' }
				],
				expanded: ['b']
			})
			await clickHeader(wrapper, 0)
			expect(wrapper.emitted('update:expanded')).toEqual([[['b', 'a']]])
			expect(isExpandedDetail(details(wrapper)[0])).toBe(false)
			await wrapper.setProps({ expanded: ['b', 'a'] })
			await nextTick()
			expect(isExpandedDetail(details(wrapper)[0])).toBe(true)
		})

		it('builds the rows from the data and ignores the list slots', () => {
			const wrapper = mountList(
				{
					items: [
						{ title: 'Search settings', content: 'Geography and Domains', detail: '2 hits' },
						{ title: 'Review the draft (gate)' }
					]
				},
				{
					icon: '<span class="custom-icon">{{ params.status }}</span>',
					content: '<span class="stream-content">{{ params.index }}</span>',
					detail: '<span class="stream-detail">Geography and Domains</span>'
				}
			)
			expect(items(wrapper)).toHaveLength(2)
			expect(el(wrapper, '.custom-icon').exists()).toBe(false)
			expect(el(wrapper, '.stream-content').exists()).toBe(false)
			expect(el(wrapper, '.stream-detail').exists()).toBe(false)
			expect(el(wrapper, '.px-action-list-item-title').text()).toBe('Search settings')
			expect(el(wrapper, '.px-action-list-item-content').text()).toBe('Geography and Domains')
			expect(el(wrapper, '.px-action-list-item-detail').text()).toBe('2 hits')
		})
	})

	describe('slot mode', () => {
		it('renders the default slot instead of items', () => {
			const wrapper = mountList({}, { default: '<div class="custom-child">child</div>' })
			expect(el(wrapper, '.custom-child').exists()).toBe(true)
			expect(el(wrapper, '.px-action-list-item').exists()).toBe(false)
		})

		it('feeds the default slot the list config and drives its expansion', async () => {
			const wrapper = mountList(
				{ size: 'small', lineVariant: 'dashed', defaultExpanded: ['draft'] },
				{
					default: () =>
						h(ActionListItem, {
							index: 'draft',
							title: 'Rewrite the draft',
							detail: 'Rewrite the outline'
						})
				}
			)
			const classes = items(wrapper)[0].classes()
			expect(classes).toContain('px-action-list-item__small')
			expect(classes).toContain('px-action-list-item__line-dashed')
			expect(isExpandedDetail(el(wrapper, '.px-action-list-item-detail'))).toBe(true)
			await clickHeader(wrapper, 0)
			// the row event of ActionListItem is not re-emitted in slot mode, the set one still is
			expect(wrapper.emitted('itemExpandedChange')).toBeUndefined()
			expect(wrapper.emitted('expandedChange')).toEqual([[[]]])
			vi.advanceTimersByTime(300)
			await nextTick()
			expect(isExpandedDetail(el(wrapper, '.px-action-list-item-detail'))).toBe(false)
		})
	})

	describe('fold', () => {
		it('keeps only the first maxDisplayItems rows while folded', () => {
			const counts = [0, 1, 3]
			counts.forEach((maxDisplayItems) => {
				const wrapper = mountList({
					items: FOLDABLE,
					collapsible: true,
					maxDisplayItems,
					defaultCollapsed: true
				})
				expect(items(wrapper)).toHaveLength(maxDisplayItems)
				expect(fold(wrapper).exists()).toBe(true)
				expect(foldText(wrapper).text()).toBe(`Show ${FOLDABLE.length - maxDisplayItems} more`)
			})
		})

		it('unfolds every row on click and animates the body height', async () => {
			const wrapper = mountList({
				items: FOLDABLE,
				collapsible: true,
				maxDisplayItems: 2,
				defaultCollapsed: true
			})
			stubListHeight(wrapper)
			await clickFold(wrapper)
			expect(items(wrapper)).toHaveLength(5)
			expect(foldText(wrapper).text()).toBe('Show less')
			expect(wrapper.emitted('collapsedChange')).toEqual([[false]])
			expect(wrapper.emitted('update:collapsed')).toBeUndefined()
			expect(styleOf(body(wrapper))).toContain('transition: height 250ms')
			vi.advanceTimersByTime(300)
			await nextTick()
			expect(styleOf(body(wrapper))).toBe('')
		})

		it('follows the collapsed prop and emits update:collapsed when controlled', async () => {
			const wrapper = mountList({
				items: FOLDABLE,
				collapsible: true,
				maxDisplayItems: 2,
				collapsed: true
			})
			expect(items(wrapper)).toHaveLength(2)
			await clickFold(wrapper)
			expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
			expect(items(wrapper)).toHaveLength(2)
			await wrapper.setProps({ collapsed: false })
			await nextTick()
			expect(items(wrapper)).toHaveLength(5)
		})

		it('renders the rows inside the list body and the trigger as its sibling', () => {
			const wrapper = mountList({
				items: FOLDABLE,
				collapsible: true,
				maxDisplayItems: 2,
				defaultCollapsed: true
			})
			expect(body(wrapper).findAll('.px-action-list-item')).toHaveLength(2)
			expect(body(wrapper).find('.px-action-list-fold').exists()).toBe(false)
			expect(fold(wrapper).exists()).toBe(true)
		})

		it('drops the trigger when nothing is hidden or the list is not collapsible', () => {
			const plain = mountList({
				items: FOLDABLE,
				maxDisplayItems: 2,
				defaultCollapsed: true
			})
			expect(items(plain)).toHaveLength(5)
			expect(fold(plain).exists()).toBe(false)
			expect(
				fold(mountList({ items: FOLDABLE, collapsible: true, maxDisplayItems: 5 })).exists()
			).toBe(false)
			const slotMode = mountList(
				{ collapsible: true, maxDisplayItems: 0 },
				{ default: '<div class="custom-child">child</div>' }
			)
			expect(el(slotMode, '.custom-child').exists()).toBe(true)
			expect(fold(slotMode).exists()).toBe(false)
		})

		it('gives the fold slot the state, the hidden count and the total', async () => {
			const wrapper = mountList(
				{
					items: FOLDABLE,
					collapsible: true,
					maxDisplayItems: 2,
					defaultCollapsed: true
				},
				{
					fold: '<span class="fold-slot">{{ params.collapsed }}/{{ params.hiddenCount }}/{{ params.total }}</span>'
				}
			)
			expect(el(wrapper, '.fold-slot').text()).toBe('true/3/5')
			await clickFold(wrapper)
			expect(el(wrapper, '.fold-slot').text()).toBe('false/0/5')
		})

		it('keeps the list spacing on the last visible row and on the trigger', async () => {
			const wrapper = mountList({
				items: FOLDABLE,
				collapsible: true,
				maxDisplayItems: 2,
				defaultCollapsed: true,
				spacing: 20
			})
			await flushPromises()
			const rendered = items(wrapper)
			expect(styleOf(mainOf(rendered[0]))).toContain('padding-bottom: 20px')
			expect(styleOf(mainOf(rendered[1]))).toBe('')
			expect(styleOf(fold(wrapper))).toContain('padding-top: 20px')
			await clickFold(wrapper)
			expect(styleOf(mainOf(items(wrapper)[3]))).toContain('padding-bottom: 20px')
			expect(styleOf(mainOf(items(wrapper)[4]))).toBe('')
		})
	})
})
