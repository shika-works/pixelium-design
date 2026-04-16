import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollPicker from '../index.vue'

describe('ScrollPicker component', () => {
	it('renders options and emits select when clicking', async () => {
		const options = [
			'Apple',
			{ key: 'banana', value: 'banana', label: 'Banana' },
			{ key: 'cherry', value: 'cherry', label: 'Cherry', disabled: true }
		]

		const wrapper = mount(ScrollPicker, {
			props: {
				options,
				current: 'banana'
			},
			attachTo: 'body'
		})

		const items = wrapper.findAll('.px-scroll-picker-item')
		expect(items.length).toBe(3)
		expect(items[1].classes()).toContain('px-scroll-picker-item__active')

		await items[0].trigger('click')
		expect(wrapper.emitted('select')?.[0][0]).toBe('Apple')
		expect(wrapper.emitted('select')?.[0][1]).toBe('Apple')

		await items[2].trigger('click')
		expect(wrapper.emitted('select')?.length).toBe(1)
	})
})
