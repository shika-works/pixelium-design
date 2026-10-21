import { mount } from '@vue/test-utils'
import InputNumber from '../index.vue'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { createMocks } from '../../share/util/test'

const mountComponent = (props = {}) => {
	return mount(InputNumber, {
		props,
		attachTo: 'body'
	})
}

describe('InputNumber strict step', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	it('rounds the value to a multiple of step when strictStep is true', () => {
		const wrapper = mountComponent({ modelValue: 7, step: 5, strictStep: true })
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
	})

	it('still supports the deprecated strickStep property', () => {
		const wrapper = mountComponent({ modelValue: 7, step: 5, strickStep: true })
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
	})

	it('does not adjust the value when neither flag is enabled', () => {
		const wrapper = mountComponent({ modelValue: 7, step: 5, strictStep: false })
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})
})
