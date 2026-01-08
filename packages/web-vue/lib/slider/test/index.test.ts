import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from '../index.vue'
import { createMocks } from '../../share/util/test'
import { ref } from 'vue'

describe('Slider Component', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('should render single value slider correctly', () => {
		const wrapper = mount(Slider, {
			props: {
				modelValue: 30,
				min: 0,
				max: 100
			}
		})

		expect(wrapper.find('.px-slider').exists()).toBe(true)
		expect(wrapper.find('.px-slider-thumb').exists()).toBe(true)
		expect(wrapper.find('.px-slider-thumb-start').exists()).toBe(false)
	})

	it('should render range slider correctly', () => {
		const wrapper = mount(Slider, {
			props: {
				modelValue: [20, 80],
				range: true,
				min: 0,
				max: 100
			}
		})

		expect(wrapper.find('.px-slider-thumb-start').exists()).toBe(true)
		expect(wrapper.find('.px-slider-thumb-end').exists()).toBe(true)
	})

	it('should not be interactive when disabled', async () => {
		const changeFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 50,
				disabled: true,
				'onUpdate:modelValue': changeFn
			}
		})

		expect(wrapper.find('.px-slider__disabled').exists()).toBe(true)

		await wrapper.find('.px-slider').trigger('click')
		expect(changeFn).not.toHaveBeenCalled()

		const thumb = wrapper.find('.px-slider-thumb')
		await thumb.trigger('mousedown')
		await wrapper.trigger('mousemove', { clientX: 200 })
		await wrapper.trigger('mouseup')
		expect(changeFn).not.toHaveBeenCalled()
	})

	it('should not be interactive when readonly', async () => {
		const changeFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 50,
				readonly: true,
				'onUpdate:modelValue': changeFn
			}
		})

		expect(wrapper.find('.px-slider__readonly').exists()).toBe(true)
		await wrapper.find('.px-slider').trigger('click')
		expect(changeFn).not.toHaveBeenCalled()
	})

	it('should render horizontal direction correctly', () => {
		const wrapper = mount(Slider, {
			props: {
				direction: 'horizontal'
			}
		})
		expect(wrapper.find('.px-slider__horizontal').exists()).toBe(true)
	})

	it('should render vertical direction correctly', () => {
		const wrapper = mount(Slider, {
			props: {
				direction: 'vertical'
			}
		})
		expect(wrapper.find('.px-slider__vertical').exists()).toBe(true)
	})

	it('single value slider should update value when dragged', async () => {
		const modelValue = ref(0)
		const updateFn = vi.fn((v: number) => (modelValue.value = v)) as any
		const wrapper = mount(Slider, {
			props: {
				modelValue: modelValue.value,
				min: 0,
				max: 100,
				'onUpdate:modelValue': updateFn
			},
			attachTo: 'body'
		})

		const sliderEl = wrapper.find('.px-slider').element
		const thumbEl = wrapper.find('.px-slider-thumb').element

		vi.spyOn(sliderEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 410,
			bottom: 30,
			width: 400,
			height: 20,
			x: 10,
			y: 10,
			toJSON: vi.fn()
		} as DOMRect)

		vi.spyOn(thumbEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10
		} as DOMRect)
		const targetClientX = 210

		wrapper.find('.px-slider-thumb').trigger('mousedown', { clientX: 10 })
		wrapper.trigger('mousemove', { clientX: targetClientX })
		await new Promise((res) => setTimeout(res, 200))

		expect(updateFn).toBeCalledTimes(2)
		const firstValue = updateFn.mock.calls[0][0]
		expect(firstValue).toBe(0)

		const secondValue = updateFn.mock.calls[1][0]
		expect(secondValue).toBe(50)
	})
	it('drag event should be dispatched', async () => {
		const dragStart = vi.fn()
		const dragEnd = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 0,
				min: 0,
				max: 100,
				onDragStart: dragStart,
				onDragEnd: dragEnd
			},
			attachTo: 'body'
		})

		wrapper.find('.px-slider-thumb').trigger('mousedown', { clientX: 10 })
		wrapper.trigger('mousemove', { clientX: 114 })
		await new Promise((res) => setTimeout(res, 200))
		wrapper.trigger('mouseup')

		expect(dragStart).toBeCalledTimes(1)
		expect(dragEnd).toBeCalledTimes(1)
	})

	it('range slider should update corresponding values when dragged', async () => {
		const updateFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: [0, 100],
				range: true,
				min: 0,
				max: 100,
				'onUpdate:modelValue': updateFn
			},
			attachTo: 'body'
		})

		const sliderEl = wrapper.find('.px-slider').element
		const thumbStartEl = wrapper.find('.px-slider-thumb-start').element
		const thumbEndEl = wrapper.find('.px-slider-thumb-end').element

		vi.spyOn(sliderEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 410,
			bottom: 30,
			width: 400,
			height: 20,
			x: 10,
			y: 10,
			toJSON: vi.fn()
		} as DOMRect)
		vi.spyOn(thumbStartEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10
		} as DOMRect)
		vi.spyOn(thumbEndEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10
		} as DOMRect)

		const startThumb = wrapper.find('.px-slider-thumb-start')
		startThumb.trigger('mousedown', { clientX: 10 })
		wrapper.trigger('mousemove', { clientX: 100 })
		await new Promise((res) => setTimeout(res, 200))
		wrapper.trigger('mouseup')

		expect(updateFn).toBeCalledTimes(2)
		const firstValue = updateFn.mock.calls[0][0]
		const secondValue = updateFn.mock.calls[1][0]
		expect(firstValue).toEqual([0, 100])
		expect(secondValue).toEqual([21, 100])

		const endThumb = wrapper.find('.px-slider-thumb-end')
		endThumb.trigger('mousedown')
		wrapper.trigger('mousemove', { clientX: 300 })
		await new Promise((res) => setTimeout(res, 200))
		wrapper.trigger('mouseup')

		expect(updateFn).toBeCalledTimes(4)

		let [, newEnd] = updateFn.mock.calls[1][0]
		expect(newEnd).toBeLessThanOrEqual(100)
	})

	it('clicking track should update slider position', async () => {
		const updateFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 0,
				'onUpdate:modelValue': updateFn
			},
			attachTo: 'body'
		})
		const sliderEl = wrapper.find('.px-slider').element
		const thumbEl = wrapper.find('.px-slider-thumb').element

		vi.spyOn(sliderEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 410,
			bottom: 30,
			width: 400,
			height: 20,
			x: 10,
			y: 10,
			toJSON: vi.fn()
		} as DOMRect)

		vi.spyOn(thumbEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10
		} as DOMRect)

		await wrapper.find('.px-slider').trigger('click', { clientX: 150 })
		expect(updateFn).toHaveBeenCalledWith(expect.any(Number))
		expect(updateFn.mock.calls[0][0]).toBeGreaterThan(0)
	})

	it('should render marks correctly', async () => {
		const marks = [
			{ value: 0, label: '0' },
			{ value: 50, label: '50' },
			{ value: 100, label: '100' }
		]
		const wrapper = mount(Slider, {
			props: { marks },
			attachTo: 'body'
		})

		await new Promise((res) => setTimeout(res))
		expect(wrapper.find('.px-slider-mark').exists()).toBe(true)
		const markElements = wrapper.findAll('.px-slider-mark')
		expect(markElements.length).toBe(3)
	})

	it('clicking marks should update slider value', async () => {
		const updateFn = vi.fn()
		const marks = [{ value: 30 }, { value: 60 }]
		const markSelect = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 0,
				marks,
				'onUpdate:modelValue': updateFn,
				onMarkSelect: markSelect
			}
		})
		await new Promise((res) => setTimeout(res))
		const secondMark = wrapper.findAll('.px-slider-mark')[1]
		await secondMark.trigger('click')
		expect(updateFn).toHaveBeenCalledWith(60)
		expect(markSelect.mock.calls[0][0]).toBe(60)
	})

	it('should emit change event', async () => {
		const changeFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 0,
				onChange: changeFn
			},
			attachTo: 'body'
		})

		const thumb = wrapper.find('.px-slider-thumb')
		thumb.trigger('mousedown')
		wrapper.trigger('mousemove', { clientX: 100 })
		await new Promise((res) => setTimeout(res, 200))
		await wrapper.trigger('mouseup')

		expect(changeFn).toHaveBeenCalled()
	})

	it('should emit focus event', async () => {
		const focus = vi.fn()
		const blur = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 0,
				onFocus: focus,
				onBlur: blur
			},
			attrs: {
				onfocus: focus,
				onblur: blur
			},
			attachTo: 'body'
		})
		const thumb = wrapper.find('.px-slider-thumb')
		thumb.trigger('focusin')
		thumb.trigger('focusout')
		await new Promise((res) => setTimeout(res, 250))
		expect(focus).toBeCalledTimes(1)
		expect(blur).toBeCalledTimes(1)

		wrapper.trigger('focus')
		wrapper.trigger('blur')
		await new Promise((res) => setTimeout(res, 250))
		expect(focus).toBeCalledTimes(2)
		expect(blur).toBeCalledTimes(2)
	})

	it('value should not exceed max and min', async () => {
		const updateFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 50,
				min: 0,
				max: 100,
				'onUpdate:modelValue': updateFn
			},
			attachTo: 'body'
		})
		const sliderEl = wrapper.find('.px-slider').element
		const thumbEl = wrapper.find('.px-slider-thumb').element

		vi.spyOn(sliderEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 410,
			bottom: 30,
			width: 400,
			height: 20,
			x: 10,
			y: 10,
			toJSON: vi.fn()
		} as DOMRect)

		vi.spyOn(thumbEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10
		} as DOMRect)

		const thumb = wrapper.find('.px-slider-thumb')
		thumb.trigger('mousedown')
		wrapper.trigger('mousemove', { clientX: 1000 })
		await new Promise((res) => setTimeout(res, 200))
		await wrapper.trigger('mouseup')

		expect(updateFn).toHaveBeenCalledWith(100)

		await thumb.trigger('mousedown')
		await wrapper.trigger('mousemove', { clientX: -100 })
		await new Promise((res) => setTimeout(res, 200))
		wrapper.trigger('mouseup')

		expect(updateFn).toHaveBeenCalledWith(0)
	})

	it('should increment according to step', async () => {
		const updateFn = vi.fn()
		const wrapper = mount(Slider, {
			props: {
				modelValue: 0,
				step: 10,
				min: 0,
				max: 100,
				'onUpdate:modelValue': updateFn
			}
		})

		const sliderEl = wrapper.find('.px-slider').element
		const thumbEl = wrapper.find('.px-slider-thumb').element

		vi.spyOn(sliderEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 410,
			bottom: 30,
			width: 400,
			height: 20,
			x: 10,
			y: 10,
			toJSON: vi.fn()
		} as DOMRect)

		vi.spyOn(thumbEl, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10
		} as DOMRect)
		await wrapper.find('.px-slider').trigger('click', { clientX: 120 })
		expect(updateFn.mock.calls[0][0] % 10).toBe(0)
	})
})
