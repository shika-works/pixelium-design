import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import Radio from '../index.vue'
import { nextTick, ref } from 'vue'
import { RADIO_GROUP_PROVIDE } from '../../share/const/provide-key'

const { pre, post } = createMocks()

describe('Radio component', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	it('renders canvas and input', async () => {
		const wrapper = mount(Radio, {
			props: { modelValue: false, value: 'v' }
		})
		expect(wrapper.find('canvas').exists()).toBe(true)
		expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
	})

	it('emits input and change when input is toggled', async () => {
		const wrapper = mount(Radio, {
			props: { modelValue: false, value: 'val' },
			attachTo: 'body'
		})

		const input = wrapper.find('input[type="radio"]')
		await input.trigger('click')
		await nextTick()

		expect(wrapper.emitted()).toHaveProperty('input')
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe(true)

		expect(wrapper.emitted()).toHaveProperty('change')
		expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
	})

	it('applies disabled and readonly classes when props set', async () => {
		const wrapperDisabled = mount(Radio, {
			props: { disabled: true }
		})
		expect(wrapperDisabled.classes()).toContain('px-radio__disabled')

		const wrapperReadonly = mount(Radio, {
			props: { readonly: true }
		})
		expect(wrapperReadonly.classes()).toContain('px-radio__readonly')
	})

	it('integrates with radio group provide: init', async () => {
		const groupModel = ref('foo')
		const updateSpy = vi.fn()
		const groupProvide = {
			modelValue: groupModel,
			updateValue: updateSpy
		}

		const wrapper = mount(Radio, {
			props: { value: 'foo' },
			global: {
				provide: {
					[RADIO_GROUP_PROVIDE]: groupProvide
				}
			},
			attachTo: 'body'
		})

		// initial group model includes 'foo', so radio should appear checked
		await nextTick()
		expect(wrapper.classes()).toContain('px-radio__checked')
	})
	it('integrates with radio group provide: update', async () => {
		const groupModel = ref(null)
		const updateSpy = vi.fn()
		const groupProvide = {
			modelValue: groupModel,
			updateValue: updateSpy
		}

		const wrapper = mount(Radio, {
			props: { value: 'foo' },
			global: {
				provide: {
					[RADIO_GROUP_PROVIDE]: groupProvide
				}
			},
			attachTo: 'body'
		})

		await nextTick()
		expect(wrapper.classes()).not.toContain('px-radio__checked')

		// toggling input should call group's updateValue
		const input = wrapper.find('input[type="radio"]')
		await input.trigger('click')
		await nextTick()
		expect(updateSpy).toHaveBeenCalledWith('foo')
	})

	it('renders in retro style', async () => {
		const wrapper = mount(Radio, {
			props: { variant: 'retro' }
		})
		expect(wrapper.find('.px-radio__retro').exists()).toBe(true)
	})
})
