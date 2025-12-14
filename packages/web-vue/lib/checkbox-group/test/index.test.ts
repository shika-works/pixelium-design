import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import CheckboxGroup from '../index.vue'
import Checkbox from '../../checkbox/index.vue'
import { nextTick } from 'vue'

const { pre, post } = createMocks()

describe('CheckboxGroup', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	it('renders options and labels', async () => {
		const options = ['a', { label: 'Label B', value: 'b', key: 'k' }]
		const wrapper = mount(CheckboxGroup, {
			props: { options }
		})
		// Labels present
		expect(wrapper.text()).toContain('a')
		expect(wrapper.text()).toContain('Label B')
		// Two checkboxes rendered
		const inputs = wrapper.findAll('input[type="checkbox"]')
		expect(inputs.length).toBe(2)
	})

	it('respects initial modelValue', async () => {
		const options = ['a', 'b']
		const wrapper = mount(CheckboxGroup, {
			props: { options, modelValue: ['a'] }
		})
		await wrapper.vm.$nextTick()
		const inputs = wrapper.findAll('input[type="checkbox"]')
		expect((inputs[0].element as HTMLInputElement).checked).toBe(true)
		expect((inputs[1].element as HTMLInputElement).checked).toBe(false)
	})

	it('emits change when option toggled', async () => {
		const options = ['a', 'b']
		const wrapper = mount(CheckboxGroup, {
			props: { options },
			attachTo: 'body'
		})
		const inputs = wrapper.findAll('input[type="checkbox"]')
		// toggle second checkbox
		await inputs[1].trigger('click')
		// check that group emitted 'change' with new value array
		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		// the payload should be an array containing 'b'
		const payload = emitted![emitted!.length - 1][0]
		expect(payload).toEqual(['b'])
	})

	it('update model-value when option toggled', async () => {
		const options = ['a', 'b']
		const update = vi.fn()
		const wrapper = mount(CheckboxGroup, {
			props: { options, 'onUpdate:modelValue': update, modelValue: null },
			attachTo: 'body'
		})
		const inputs = wrapper.findAll('input[type="checkbox"]')

		await nextTick()

		// toggle second checkbox
		await inputs[1].trigger('click')
		await nextTick()

		expect(update).toBeCalledTimes(2)
		expect(update).toBeCalledWith([])
		expect(update).toBeCalledWith(['b'])
	})

	it('renders checkboxes when provided via slot', async () => {
		const wrapper = mount(CheckboxGroup, {
			slots: {
				default: '<Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox>'
			},
			global: {
				components: { Checkbox }
			}
		})
		expect(wrapper.text()).toContain('A')
		expect(wrapper.text()).toContain('B')
		const inputs = wrapper.findAll('input[type="checkbox"]')
		expect(inputs.length).toBe(2)
	})

	it('slot checkboxes respect initial modelValue', async () => {
		const wrapper = mount(CheckboxGroup, {
			props: { modelValue: ['a'] },
			slots: {
				default: '<Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox>'
			},
			global: {
				components: { Checkbox }
			}
		})
		await wrapper.vm.$nextTick()
		const inputs = wrapper.findAll('input[type="checkbox"]')
		expect((inputs[0].element as HTMLInputElement).checked).toBe(true)
		expect((inputs[1].element as HTMLInputElement).checked).toBe(false)
	})

	it('slot checkbox toggle emits change', async () => {
		const wrapper = mount(CheckboxGroup, {
			slots: {
				default: '<Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox>'
			},
			global: {
				components: { Checkbox }
			},
			attachTo: 'body'
		})
		const inputs = wrapper.findAll('input[type="checkbox"]')
		await inputs[1].trigger('click')
		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		const payload = emitted![emitted!.length - 1][0]
		expect(payload).toEqual(['b'])
	})

	it('passes size prop to option checkboxes', async () => {
		const options = ['a', 'b']
		const wrapper = mount(CheckboxGroup, {
			props: { options, size: 'small' }
		})

		const flag = wrapper
			.findAll('.px-checkbox')
			.map((e) => e.classes())
			.every((cls) => cls.includes('px-checkbox__small'))
		expect(flag).toBe(true)
	})

	it('passes size prop to slot checkboxes', async () => {
		const wrapper = mount(CheckboxGroup, {
			props: { size: 'small' },
			slots: {
				default: '<Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox>'
			},
			global: {
				components: { Checkbox }
			}
		})

		const flag = wrapper
			.findAll('.px-checkbox')
			.map((e) => e.classes())
			.every((cls) => cls.includes('px-checkbox__small'))
		expect(flag).toBe(true)
	})

	it('renders options with retro style', async () => {
		const options = ['a', 'b']
		const wrapper = mount(CheckboxGroup, {
			props: { options, variant: 'retro' }
		})

		const flag = wrapper
			.findAll('.px-radio')
			.map((e) => e.classes())
			.every((e) => e.includes('px-checkbox__retro'))
		expect(flag).toBe(true)
	})
	it('renders sub-radio with retro style', async () => {
		const wrapper = mount(CheckboxGroup, {
			props: { variant: 'retro' },
			slots: {
				default: '<Checkbox value="a">A</Checkbox><Checkbox value="b">B</Checkbox>'
			},
			global: {
				components: { Checkbox }
			}
		})

		const flag = wrapper
			.findAll('.px-radio')
			.map((e) => e.classes())
			.every((e) => e.includes('px-checkbox__retro'))
		expect(flag).toBe(true)
	})
})
