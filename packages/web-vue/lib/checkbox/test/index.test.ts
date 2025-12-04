import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import Checkbox from '../index.vue'
import { nextTick, ref } from 'vue'
import { CHECKBOX_GROUP_PROVIDE } from '../../share/const/provide-key'

const { pre, post } = createMocks()

describe('Checkbox component', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	it('renders canvas and input', async () => {
		const wrapper = mount(Checkbox, {
			props: { modelValue: false, value: 'v' }
		})
		expect(wrapper.find('canvas').exists()).toBe(true)
		expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
	})

	it('emits input and change when input is toggled', async () => {
		const wrapper = mount(Checkbox, {
			props: { modelValue: false, value: 'val' },
			attachTo: 'body'
		})

		const input = wrapper.find('input[type="checkbox"]')
		await input.trigger('click')
		await nextTick()

		expect(wrapper.emitted()).toHaveProperty('input')
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe(true)

		expect(wrapper.emitted()).toHaveProperty('change')
		expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
	})

	it('applies disabled and readonly classes when props set', async () => {
		const wrapperDisabled = mount(Checkbox, {
			props: { disabled: true }
		})
		expect(wrapperDisabled.classes()).toContain('px-checkbox__disabled')

		const wrapperReadonly = mount(Checkbox, {
			props: { readonly: true }
		})
		expect(wrapperReadonly.classes()).toContain('px-checkbox__readonly')
	})

	it('integrates with checkbox group provide: reflects group modelValue and calls updateValue on change', async () => {
		const groupModel = ref(['foo'])
		const updateSpy = vi.fn()
		const groupProvide = {
			modelValue: groupModel,
			updateValue: updateSpy
		}

		const wrapper = mount(Checkbox, {
			props: { value: 'foo' },
			global: {
				provide: {
					[CHECKBOX_GROUP_PROVIDE]: groupProvide
				}
			},
			attachTo: 'body'
		})

		// initial group model includes 'foo', so checkbox should appear checked
		await nextTick()
		expect(wrapper.classes()).toContain('px-checkbox__checked')

		// toggling input should call group's updateValue
		const input = wrapper.find('input[type="checkbox"]')
		await input.trigger('click')
		await nextTick()
		expect(updateSpy).toHaveBeenCalledWith('foo', false)
	})

	it('shows checked class when indeterminate', async () => {
		const wrapper = mount(Checkbox, {
			props: { indeterminate: true },
			attachTo: 'body'
		})
		// indeterminate should mark component as checked visually
		expect(wrapper.classes()).toContain('px-checkbox__checked')
	})
})
