import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Pagination from '../index.vue'
import Select from '../../select/index.vue'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createMocks } from '../../share/util/test'
import Input from '../../input/index.vue'

describe('Pagination Component', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders correct page items for given total, pageSlot and pageSize', async () => {
		const wrapper = mount(Pagination, {
			props: {
				total: 100,
				pageSlot: 7,
				defaultPageSize: 10
			}
		})

		// collect page items excluding arrows
		const pageItems = wrapper
			.findAll('.px-pagination-page-item')
			.filter((w) => !w.classes().includes('px-pagination-icon-wrapper'))
			.map((w) => w.text())

		expect(pageItems).toEqual(['1', '2', '3', '4', '5', '...', '10'])
	})

	it('controlled page prop triggers update and relevant events', async () => {
		const onUpdatePage = vi.fn()
		const wrapper = mount(Pagination, {
			props: {
				page: 2,
				total: 100,
				pageSlot: 7,
				'onUpdate:page': onUpdatePage
			}
		})

		const page4 = wrapper.findAll('.px-pagination-page-item').find((w) => w.text() === '4')!
		await page4.trigger('click')

		expect(onUpdatePage).toHaveBeenCalled()
		expect(wrapper.emitted('pageSelect')?.[0]?.[0]).toBe(4)
		expect(wrapper.emitted('pageChange')?.[0]?.[0]).toBe(4)

		// prev arrow (first icon wrapper)
		const arrows = wrapper.findAll('.px-pagination-icon-wrapper')
		await arrows[0].trigger('click')
		expect(wrapper.emitted('movePrev')).toBeTruthy()
		await arrows[1].trigger('click')
		expect(wrapper.emitted('moveNext')).toBeTruthy()
	})

	it('uncontrolled defaultPage updates internal state and emits events', async () => {
		const wrapper = mount(Pagination, {
			props: {
				defaultPage: 3,
				total: 100,
				pageSlot: 7
			}
		})

		// next arrow (last icon wrapper)
		const arrows = wrapper.findAll('.px-pagination-icon-wrapper')
		await arrows.at(-1)!.trigger('click')
		await nextTick()

		const active = wrapper.find('.px-pagination-page-item__active')
		expect(active.text()).toBe('4')
		expect(wrapper.emitted('pageChange')?.[0]?.[0]).toBe(4)
	})

	it('page jump via jumper input emits pageJump and pageChange', async () => {
		const wrapper = mount(Pagination, {
			props: {
				showJumper: true,
				showSize: true, // jumper is gated by showSize in current implementation
				defaultPage: 1,
				total: 100
			}
		})

		const input = wrapper.find('.px-pagination-jumper').find('input')
		await input.setValue('5')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()

		expect(wrapper.emitted('pageJump')?.[0]?.[0]).toBe(5)
		expect(wrapper.emitted('pageChange')?.[0]?.[0]).toBe(5)
		const active = wrapper.find('.px-pagination-page-item__active')
		expect(active.text()).toBe('5')
	})

	it('controlled and uncontrolled pageSize behavior and events', async () => {
		// controlled pageSize
		const onUpdatePageSize = vi.fn()
		const wrapperControlled = mount(Pagination, {
			props: {
				pageSize: 20,
				total: 100,
				showSize: true,
				'onUpdate:pageSize': onUpdatePageSize
			}
		})

		const selectControlled = wrapperControlled.findComponent(Select)
		await selectControlled.vm.$emit('select', 50)
		expect(onUpdatePageSize).toHaveBeenCalledWith(50)
		await new Promise((r) => setTimeout(r))
		expect(wrapperControlled.emitted('pageSizeChange')?.[0]?.[0]).toBe(50)

		// uncontrolled (defaultPageSize)
		const wrapper = mount(Pagination, {
			props: {
				defaultPageSize: 10,
				total: 100,
				showSize: true
			}
		})

		const select = wrapper.findComponent(Select)
		await select.vm.$emit('select', 20)
		await nextTick()
		expect(wrapper.emitted('pageSizeChange')?.[0]?.[0]).toBe(20)
		expect(select.props('modelValue')).toBe(20)
	})

	it('pageSizeOptions are passed to Select correctly', () => {
		const wrapper = mount(Pagination, {
			props: {
				pageSizeOptions: [10, { label: 'Fifty', value: 50 }],
				showSize: true
			}
		})

		const select = wrapper.findComponent(Select)
		const options = select.props('options') as any[]
		expect(options.length).toBe(2)
		expect(options[1]).toEqual({ label: 'Fifty', value: 50 })
		expect(options[0]).toHaveProperty('value', 10)
		expect(options[0]).toHaveProperty('label')
	})

	it('showTotal, showSize, showJumper, itemsOrder, totalLabel and jumperLabel behaviors', async () => {
		// showTotal and totalLabel
		const wrapperTotal = mount(Pagination, {
			props: {
				total: 123,
				showTotal: true,
				totalLabel: 'Total: 123'
			}
		})
		expect(wrapperTotal.find('.px-pagination-total').text()).toBe('Total: 123')

		const wrapperJumperOnly = mount(Pagination, { props: { showJumper: true } })
		expect(wrapperJumperOnly.find('.px-pagination-jumper').exists()).toBe(true)

		const wrapperJumper = mount(Pagination, {
			props: { showJumper: true, showSize: true, jumperLabel: 'Go to' }
		})
		expect(wrapperJumper.find('.px-pagination-jumper-label').text()).toBe('Go to')

		// items order
		const wrapperOrder = mount(Pagination, {
			props: { itemsOrder: ['page', 'total'], showTotal: true }
		})
		const children = wrapperOrder.find('.px-pagination').element.children
		expect(children[0].className).toContain('px-pagination-page')
		expect(children[1].className).toContain('px-pagination-total')
	})

	it('totalLabel and jumperLabel slot overrides prop and slot receives prop', () => {
		// totalLabel prop is present but slot should override and receive total prop
		const wrapperTotalSlot = mount(Pagination, {
			props: { total: 321, showTotal: true, totalLabel: 'Total: 321' },
			slots: {
				'total-label': (slotProps: any) => `Slot Total ${slotProps.total}`
			}
		})
		expect(wrapperTotalSlot.find('.px-pagination-total').text()).toBe('Slot Total 321')

		// jumperLabel prop is present but slot should override
		const wrapperJumperSlot = mount(Pagination, {
			props: { showJumper: true, showSize: true, jumperLabel: 'Prop Label' },
			slots: {
				'jumper-label': () => 'Slot Jumper'
			}
		})
		expect(wrapperJumperSlot.find('.px-pagination-jumper-label').text()).toBe('Slot Jumper')
	})

	it('variant and size classes applied', () => {
		const wrapper = mount(Pagination, {
			props: { variant: 'solid', size: 'large', showSize: false }
		})

		expect(wrapper.find('.px-pagination-page').classes()).toContain('px-pagination-page__solid')
		expect(wrapper.find('.px-pagination').classes()).toContain('px-pagination__large')
	})

	it('simple mode input change via Enter and blur emits pageInput and pageChange', async () => {
		const wrapper = mount(Pagination, {
			props: { simple: true, defaultPage: 2, total: 100 }
		})

		const input = wrapper.find('.px-pagination-page-simple-control').find('input')
		await input.setValue('5')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()

		expect(wrapper.emitted('pageCommit')?.[0]?.[0]).toBe(5)
		expect(wrapper.emitted('pageCommit')?.[0]?.[1]).instanceOf(Event)
		expect(wrapper.emitted('pageChange')?.[0]?.[0]).toBe(5)

		// blur triggers as well
		await input.setValue('3')
		await input.trigger('focusout')
		await new Promise((r) => setTimeout(r, 300))
		expect(wrapper.emitted('pageCommit')?.[1]?.[0]).toBe(3)
		expect(wrapper.emitted('pageChange')?.[1]?.[0]).toBe(3)
	})

	it('simple mode arrows trigger movePrev/moveNext and pageChange (controlled and uncontrolled)', async () => {
		// uncontrolled
		const wrapper = mount(Pagination, { props: { simple: true, defaultPage: 2, total: 100 } })
		const arrows = wrapper.findAll('.px-pagination-icon-wrapper')
		await arrows[0].trigger('click')
		await nextTick()
		expect(wrapper.emitted('movePrev')).toBeTruthy()
		expect(wrapper.emitted('pageChange')?.[0]?.[0]).toBe(1)

		// controlled
		const onUpdatePage = vi.fn()
		const wrapperControlled = mount(Pagination, {
			props: { simple: true, page: 2, total: 100, 'onUpdate:page': onUpdatePage }
		})
		const arrowsControlled = wrapperControlled.findAll('.px-pagination-icon-wrapper')
		await arrowsControlled[1].trigger('click')
		expect(onUpdatePage).toHaveBeenCalledWith(3)
		expect(wrapperControlled.emitted('moveNext')).toBeTruthy()
		expect(wrapperControlled.emitted('pageChange')?.[0]?.[0]).toBe(3)
	})
	it('disabled mode', async () => {
		const wrapper = mount(Pagination, {
			props: { disabled: true, total: 100, showTotal: true, showJumper: true, showSize: true }
		})
		expect(wrapper.findAll('.px-pagination-page-item__disabled').length).toBe(9)
		expect(wrapper.findComponent(Select).props('disabled')).toBe(true)
		expect(wrapper.findComponent(Input).props('disabled')).toBe(true)

		const wrapperSimple = mount(Pagination, {
			props: {
				disabled: true,
				total: 100,
				simple: true,
				showTotal: true,
				showJumper: true,
				showSize: true
			}
		})
		expect(wrapperSimple.findAll('.px-pagination-page-item__disabled').length).toBe(2)
		expect(wrapperSimple.findComponent(Select).props('disabled')).toBe(true)
		expect(wrapperSimple.findComponent(Input).props('disabled')).toBe(true)
		expect(wrapperSimple.findAllComponents(Input)[1].props('disabled')).toBe(true)
	})
})
