import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ColorPickerPanel from '../index.vue'
import { nextTick } from 'vue'

const mockElementRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
	vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
		left: rect.left ?? 0,
		top: rect.top ?? 0,
		width: rect.width ?? 0,
		height: rect.height ?? 0,
		right: rect.right ?? (rect.left ?? 0) + (rect.width ?? 0),
		bottom: rect.bottom ?? (rect.top ?? 0) + (rect.height ?? 0),
		x: rect.left ?? 0,
		y: rect.top ?? 0,
		toJSON: vi.fn()
	} as DOMRect)
}

describe('ColorPickerPanel component', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renders preset buttons and emits change when preset clicked', async () => {
		const wrapper = mount(ColorPickerPanel, {
			props: {
				presets: ['#ff0000'],
				formatted: 'rgb(255,0,0)',
				includeAlpha: true
			},
			attachTo: document.body
		})

		const presetButton = wrapper.find('.px-color-picker-panel-preset')
		expect(presetButton.exists()).toBe(true)

		await presetButton.trigger('click')

		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		expect(emitted?.[0]?.[0]).toMatchObject({ h: 0, s: 1, v: 1, a: 255 })

		wrapper.unmount()
	})

	it('emits change from color field drag using mocked getBoundingClientRect', async () => {
		const wrapper = mount(ColorPickerPanel, {
			props: {
				formatted: 'rgb(0,0,0)'
			},
			attachTo: document.body
		})

		const field = wrapper.find('.px-color-picker-panel-color-field')
		expect(field.exists()).toBe(true)
		const element = field.element as HTMLElement

		mockElementRect(element, { left: 0, top: 0, width: 100, height: 100 })
		Object.defineProperty(element, 'clientWidth', {
			value: 100,
			configurable: true
		})
		element.setPointerCapture = vi.fn()
		element.releasePointerCapture = vi.fn()

		const pointerdownEvent = new PointerEvent('pointerdown', {
			clientX: 50,
			clientY: 25,
			pointerId: 20
		})
		field.element.dispatchEvent(pointerdownEvent)
		await nextTick()

		const emitted = wrapper.emitted('change')
		expect(emitted?.[0]?.[0]).toEqual({ h: 0, s: 0.5, v: 0.75, a: 255 })

		wrapper.unmount()
	})

	it('emits change from hue slider drag using mocked size and position', async () => {
		const wrapper = mount(ColorPickerPanel, {
			props: {
				includeAlpha: true
			},
			attachTo: document.body
		})

		const containers = wrapper.findAll('.px-color-picker-panel-container')
		expect(containers.length).toBeGreaterThanOrEqual(1)
		const hueContainer = containers[0]
		const element = hueContainer.element as HTMLElement

		mockElementRect(element, { left: 0, top: 0, width: 200, height: 20 })
		Object.defineProperty(element, 'clientWidth', {
			value: 200,
			configurable: true
		})
		element.setPointerCapture = vi.fn()
		element.releasePointerCapture = vi.fn()

		const pointerdownEvent = new PointerEvent('pointerdown', {
			clientX: 100,
			clientY: 10,
			pointerId: 20
		})
		hueContainer.element.dispatchEvent(pointerdownEvent)
		await nextTick()

		const emitted = wrapper.emitted('change')
		expect(emitted?.[0]?.[0]).toEqual({ s: 0, v: 0, a: 255, h: 180 })

		wrapper.unmount()
	})

	it('emits change from alpha slider drag', async () => {
		const wrapper = mount(ColorPickerPanel, {
			props: {
				includeAlpha: true
			},
			attachTo: document.body
		})

		const containers = wrapper.findAll('.px-color-picker-panel-container')
		expect(containers.length).toBeGreaterThanOrEqual(2)
		const alphaContainer = containers[1]
		const element = alphaContainer.element as HTMLElement

		mockElementRect(element, { left: 0, top: 0, width: 200, height: 20 })
		Object.defineProperty(element, 'clientWidth', {
			value: 200,
			configurable: true
		})
		element.setPointerCapture = vi.fn()
		element.releasePointerCapture = vi.fn()

		const pointerdownEvent = new PointerEvent('pointerdown', {
			clientX: 150,
			clientY: 10,
			pointerId: 30
		})
		alphaContainer.element.dispatchEvent(pointerdownEvent)
		await nextTick()

		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		expect((emitted?.[0]?.[0] as any)?.a).toBe(191)

		wrapper.unmount()
	})

	it('emits change from input', async () => {
		const wrapper = mount(ColorPickerPanel, {
			props: {
				includeAlpha: true
			},
			attachTo: document.body
		})

		const input = wrapper.find('input')
		input.setValue('rgb(255,128,64)')
		input.trigger('change')
		await nextTick()

		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		expect(emitted?.[0]?.[0]).toEqual({
			a: 255,
			h: 20.104712041884817,
			s: 0.7490196078431373,
			v: 1
		})

		wrapper.unmount()
	})
})
