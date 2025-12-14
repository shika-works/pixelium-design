import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import RadioGroup from '../index.vue'
import Radio from '../../radio/index.vue'

const { pre, post } = createMocks()

describe('RadioGroup', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})
	it('renders options and labels', async () => {
		const options = ['a', { label: 'Label B', value: 'b', key: 'k' }]
		const wrapper = mount(RadioGroup, {
			props: { options }
		})
		expect(wrapper.text()).toContain('a')
		expect(wrapper.text()).toContain('Label B')
		const inputs = wrapper.findAll('input[type="radio"]')
		expect(inputs.length).toBe(2)
	})

	it('respects initial modelValue', async () => {
		const options = ['a', 'b']
		const wrapper = mount(RadioGroup, {
			props: { options, modelValue: 'a' }
		})
		await wrapper.vm.$nextTick()
		const inputs = wrapper.findAll('input[type="radio"]')
		expect((inputs[0].element as HTMLInputElement).checked).toBe(true)
		expect((inputs[1].element as HTMLInputElement).checked).toBe(false)
	})

	it('emits change when option toggled', async () => {
		const options = ['a', 'b']
		const wrapper = mount(RadioGroup, {
			props: { options },
			attachTo: 'body'
		})
		const inputs = wrapper.findAll('input[type="radio"]')
		await inputs[1].trigger('click')
		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		const payload = emitted![emitted!.length - 1][0]
		expect(payload).toEqual('b')
	})
	it('renders radios when provided via slot', async () => {
		const wrapper = mount(RadioGroup, {
			slots: {
				default: '<Radio value="a">A</Radio><Radio value="b">B</Radio>'
			},
			global: {
				components: { Radio }
			}
		})
		expect(wrapper.text()).toContain('A')
		expect(wrapper.text()).toContain('B')
		const inputs = wrapper.findAll('input[type="radio"]')
		expect(inputs.length).toBe(2)
	})

	it('slot radios respect initial modelValue', async () => {
		const wrapper = mount(RadioGroup, {
			props: { modelValue: 'a' },
			slots: {
				default: '<Radio value="a">A</Radio><Radio value="b">B</Radio>'
			},
			global: {
				components: { Radio }
			}
		})
		await wrapper.vm.$nextTick()
		const inputs = wrapper.findAll('input[type="radio"]')
		expect((inputs[0].element as HTMLInputElement).checked).toBe(true)
		expect((inputs[1].element as HTMLInputElement).checked).toBe(false)
	})

	it('slot radio toggle emits change', async () => {
		const wrapper = mount(RadioGroup, {
			slots: {
				default: '<Radio value="a">A</Radio><Radio value="b">B</Radio>'
			},
			global: {
				components: { Radio }
			},
			attachTo: 'body'
		})
		const inputs = wrapper.findAll('input[type="radio"]')
		await inputs[1].trigger('click')
		const emitted = wrapper.emitted('change')
		expect(emitted).toBeTruthy()
		const payload = emitted![emitted!.length - 1][0]
		expect(payload).toEqual('b')
	})

	it('renders options with retro style', async () => {
		const options = ['a', 'b']
		const wrapper = mount(RadioGroup, {
			props: { options, variant: 'retro' }
		})

		const flag = wrapper
			.findAll('.px-radio')
			.map((e) => e.classes())
			.every((e) => e.includes('px-radio__retro'))
		expect(flag).toBe(true)
	})
	it('renders sub-radio with retro style', async () => {
		const wrapper = mount(RadioGroup, {
			props: { variant: 'retro' },
			slots: {
				default: '<Radio value="a">A</Radio><Radio value="b">B</Radio>'
			},
			global: {
				components: { Radio }
			}
		})

		const flag = wrapper
			.findAll('.px-radio')
			.map((e) => e.classes())
			.every((e) => e.includes('px-radio__retro'))
		expect(flag).toBe(true)
	})
	it('passes size prop to option radios', async () => {
		const options = ['a', 'b']
		const wrapper = mount(RadioGroup, {
			props: { options, size: 'small' }
		})

		const flag = wrapper
			.findAll('.px-radio')
			.map((e) => e.classes())
			.every((cls) => cls.includes('px-radio__small'))
		expect(flag).toBe(true)
	})

	it('passes size prop to slot radios', async () => {
		const wrapper = mount(RadioGroup, {
			props: { size: 'small' },
			slots: {
				default: '<Radio value="a">A</Radio><Radio value="b">B</Radio>'
			},
			global: {
				components: { Radio }
			}
		})

		const flag = wrapper
			.findAll('.px-radio')
			.map((e) => e.classes())
			.every((cls) => cls.includes('px-radio__small'))
		expect(flag).toBe(true)
	})
})
