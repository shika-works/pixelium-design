import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Rate from '../index.vue'
import RateItem from '../rate-item.vue'
import { createMocks } from '../../share/util/test'

describe('Rate Component', () => {
	const { pre, post } = createMocks()
	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	it('renders default count of rate items', () => {
		const wrapper = mount(Rate)
		expect(wrapper.findAll('.px-rate-item')).toHaveLength(5)
	})

	it('emits update:modelValue, select and change when a star is clicked', async () => {
		const updateModelValue = vi.fn()
		const select = vi.fn()
		const change = vi.fn()

		const wrapper = mount(Rate, {
			props: {
				modelValue: 0,
				'onUpdate:modelValue': updateModelValue,
				onSelect: select,
				onChange: change
			},
			attachTo: 'body'
		})

		const secondRate = wrapper.findAll('.px-rate-item')[1]
		await secondRate.trigger('click', { clientX: 15 })

		expect(updateModelValue).toHaveBeenCalledWith(2)
		expect(select).toHaveBeenCalledTimes(1)
		expect(change).toHaveBeenCalledWith(2, expect.any(MouseEvent))
	})

	it('supports allowHalf selection and emits half value', async () => {
		const updateModelValue = vi.fn()
		const change = vi.fn()

		const wrapper = mount(Rate, {
			props: {
				modelValue: 0,
				allowHalf: true,
				'onUpdate:modelValue': updateModelValue,
				onChange: change
			},
			attachTo: 'body'
		})

		const firstRate = wrapper.findAll('.px-rate-item')[0]

		const originGetBoundingClientRect = firstRate.element.getBoundingClientRect
		firstRate.element.getBoundingClientRect = () => {
			return {
				x: 0,
				y: 0,
				left: 0,
				width: 36,
				height: 28,
				right: 800,
				top: 0,
				bottom: 0,
				toJSON: () => ''
			}
		}

		await firstRate.trigger('click', { clientX: 5 })

		expect(updateModelValue).toHaveBeenCalledWith(0.5)
		expect(change).toHaveBeenCalledWith(0.5, expect.any(MouseEvent))
		firstRate.element.getBoundingClientRect = originGetBoundingClientRect
	})

	it('clears selected value when clearable and clicked again', async () => {
		const updateModelValue = vi.fn()
		const change = vi.fn()
		const clear = vi.fn()

		const wrapper = mount(Rate, {
			props: {
				modelValue: 2,
				clearable: true,
				'onUpdate:modelValue': updateModelValue,
				onChange: change,
				onClear: clear
			},
			attachTo: 'body'
		})

		const secondRate = wrapper.findAll('.px-rate-item')[1]
		await secondRate.trigger('click', { clientX: 15 })

		expect(updateModelValue).toHaveBeenCalledWith(0)
		expect(change).toHaveBeenCalledWith(0, expect.any(MouseEvent))
		expect(clear).toHaveBeenCalledWith(0, expect.any(MouseEvent))
	})

	it('does not emit events when disabled', async () => {
		const updateModelValue = vi.fn()
		const change = vi.fn()

		const wrapper = mount(Rate, {
			props: {
				modelValue: 1,
				disabled: true,
				'onUpdate:modelValue': updateModelValue,
				onChange: change
			},
			attachTo: 'body'
		})

		expect(wrapper.classes()).toContain('px-rate__disabled')

		const firstRate = wrapper.findAll('.px-rate-item')[0]
		await firstRate.trigger('click', { clientX: 15 })

		expect(updateModelValue).not.toHaveBeenCalled()
		expect(change).not.toHaveBeenCalled()
	})

	it('does not emit events when readonly', async () => {
		const updateModelValue = vi.fn()
		const change = vi.fn()

		const wrapper = mount(Rate, {
			props: {
				modelValue: 1,
				readonly: true,
				'onUpdate:modelValue': updateModelValue,
				onChange: change
			},
			attachTo: 'body'
		})

		expect(wrapper.classes()).toContain('px-rate__readonly')

		const firstRate = wrapper.findAll('.px-rate-item')[0]
		await firstRate.trigger('click', { clientX: 15 })

		expect(updateModelValue).not.toHaveBeenCalled()
		expect(change).not.toHaveBeenCalled()
	})

	it('updates hover state on mousemove when allowHalf is true', async () => {
		const wrapper = mount(Rate, {
			props: {
				modelValue: 0,
				allowHalf: true
			},
			attachTo: 'body'
		})

		const firstRate = wrapper.findAll('.px-rate-item')[0]
		await firstRate.trigger('mousemove', { clientX: 5 })
		await wrapper.vm.$nextTick()

		const rateItemWrappers = wrapper.findAllComponents(RateItem)
		expect(rateItemWrappers[0].props('active')).toBe(true)
		expect(rateItemWrappers[1].props('active')).toBe(false)
	})
})
