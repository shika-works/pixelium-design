import { describe, afterEach, beforeEach, it, vi, expect } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import Form from '../index.vue'
import FormItem from '../../form-item/index.vue'
import Input from '../../input/index.vue'
import Button from '../../button/index.vue'
import Textarea from '../../textarea/index.vue'
import { h, nextTick, ref } from 'vue'
import type { FieldType } from '../type'
import userEvent from '@testing-library/user-event'

describe('Form Component', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})
	describe('Basic Action', () => {
		it('Submit and reset button work', async () => {
			const form = ref({
				input: ''
			})
			const rules = {
				input: { required: true }
			}
			const onReset = vi.fn()
			const onSubmit = vi.fn()
			const wrapper = mount(Form, {
				props: {
					model: form.value,
					rules: rules,
					onReset,
					onSubmit
				},
				slots: {
					default: () => [
						h(
							FormItem,
							{ field: 'input', label: 'Input' },
							{
								default: () =>
									h(Input, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						),
						h(Button, { nativeType: 'submit' }, { default: 'Submit' }),
						h(Button, { nativeType: 'reset', theme: 'info' }, { default: 'Reset' })
					]
				},
				attachTo: 'body'
			})

			const button = wrapper.find('button')
			await button.trigger('click')
			expect(onSubmit).toBeCalledTimes(1)

			form.value.input = 'test'
			wrapper.setProps({ model: form.value })
			await nextTick()
			const input = wrapper.find('input.px-input-inner')
			expect(input.attributes('value')).toBe('test')

			const reset = wrapper.findAll('button')[1]
			await reset.trigger('click')
			expect(onReset).toBeCalledTimes(1)
			expect(form.value.input).toBe('')
		})
	})
	describe('Enter Cases', () => {
		it('Enter cannot submits the form', async () => {
			const form = ref({
				input: ''
			})
			const rules = {
				input: { required: true }
			}
			const onSubmit = vi.fn()
			const wrapper = mount(Form, {
				props: {
					model: form.value,
					rules: rules,
					onSubmit
				},
				slots: {
					default: () => [
						h(
							FormItem,
							{ field: 'input', label: 'Input' },
							{
								default: () =>
									h(Input, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						),
						h(Button, { nativeType: 'submit' }, { default: 'Submit' })
					]
				},
				attachTo: 'body'
			})

			const button = wrapper.find('button')
			await button.trigger('click')
			expect(onSubmit).toBeCalledTimes(1)

			const formEl = wrapper.find('form')
			await formEl.trigger('keydown.enter')
			expect(onSubmit).toBeCalledTimes(1)
		})
		it('Textarea can wrap normally', async () => {
			const form = ref({
				input: ''
			})
			const rules = {
				input: { required: true }
			}
			const wrapper = mount(Form, {
				props: {
					model: form.value,
					rules: rules
				},
				slots: {
					default: () => [
						h(
							FormItem,
							{ field: 'input', label: 'Input' },
							{
								default: () =>
									h(Textarea, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				},
				attachTo: 'body'
			})

			const user = userEvent.setup()
			const textarea = wrapper.find('textarea')
			await user.type(textarea.element, '{Enter}')
			expect(textarea.element.value).toBe('\n')
		})
	})
	describe('Validate', () => {
		it('Required & Base validating', async () => {
			const form = ref({
				input1: '',
				input2: ''
			})
			const rules = {
				input1: { required: true },
				input2: { required: true }
			}
			const wrapper = mount(Form, {
				props: {
					model: form.value,
					rules: rules
				},
				slots: {
					default: () => [
						h(
							FormItem,
							{ field: 'input1', label: 'Input' },
							{
								default: () =>
									h(Input, {
										modelValue: form.value.input1,
										'onUpdate:modelValue': (e) => (form.value.input1 = e)
									})
							}
						),
						h(
							FormItem,
							{ field: 'input2', label: 'Input' },
							{
								default: () =>
									h(Input, {
										modelValue: form.value.input2,
										'onUpdate:modelValue': (e) => (form.value.input2 = e)
									})
							}
						)
					]
				}
			})

			await nextTick()
			expect(wrapper.vm.validate).toBeTypeOf('function')
			const validateRes1 = await wrapper.vm.validate('input1')
			await nextTick()
			expect(validateRes1).toEqual({
				isValid: false,
				results: {
					input1: {
						status: 'fulfilled',
						value: {
							level: 'error',
							message: 'input1 is required'
						}
					}
				}
			})
			const tip1 = wrapper.findAll('.px-form-item-tip')
			expect(tip1.length).toBe(1)
			expect(tip1[0].text()).toBe('input1 is required')

			const validateRes2 = await wrapper.vm.validate()
			await nextTick()
			expect(validateRes2).toEqual({
				isValid: false,
				results: {
					input1: {
						status: 'fulfilled',
						value: {
							level: 'error',
							message: 'input1 is required'
						}
					},
					input2: {
						status: 'fulfilled',
						value: {
							level: 'error',
							message: 'input2 is required'
						}
					}
				}
			})
			const tip2 = wrapper.findAll('.px-form-item-tip')
			expect(tip2.length).toBe(2)
			expect(tip2[0].text()).toBe('input1 is required')
			expect(tip2[1].text()).toBe('input2 is required')

			expect(wrapper.vm.clearValidation).toBeTypeOf('function')
			wrapper.vm.clearValidation('input1')
			await nextTick()
			const tip3 = wrapper.findAll('.px-form-item-tip')
			expect(tip3.length).toBe(1)
			expect(tip3[0].text()).toBe('input2 is required')

			wrapper.vm.clearValidation()
			await nextTick()
			const tip4 = wrapper.findAll('.px-form-item-tip')
			expect(tip4.length).toBe(0)

			form.value.input1 = 'input1'
			form.value.input2 = 'input2'
			wrapper.setProps({ model: form.value })
			await nextTick()
			const validateRes3 = await wrapper.vm.validate()
			expect(validateRes3).toEqual({
				isValid: true,
				results: {
					input1: {
						status: 'fulfilled',
						value: {
							level: 'normal',
							message: ''
						}
					},
					input2: {
						status: 'fulfilled',
						value: {
							level: 'normal',
							message: ''
						}
					}
				}
			})

			form.value.input2 = ''
			form.value.input1 = ''
			wrapper.setProps({ model: form.value })
			await nextTick()
			const validateRes4 = await wrapper.vm.validate()
			expect(validateRes4).toEqual({
				isValid: false,
				results: {
					input1: {
						status: 'fulfilled',
						value: {
							level: 'error',
							message: 'input1 is required'
						}
					},
					input2: {
						status: 'fulfilled',
						value: {
							level: 'error',
							message: 'input2 is required'
						}
					}
				}
			})
			const tip5 = wrapper.findAll('.px-form-item-tip')
			expect(tip5.length).toBe(2)

			expect(wrapper.vm.reset).toBeTypeOf('function')
			wrapper.vm.reset('input2')
			await nextTick()
			expect(form.value.input2).toBe('')
			const tip6 = wrapper.findAll('.px-form-item-tip')
			expect(tip6.length).toBe(1)

			wrapper.vm.reset()
			await nextTick()
			expect(form.value.input1).toBe('')
			const tip7 = wrapper.findAll('.px-form-item-tip')
			expect(tip7.length).toBe(0)
		})
		it('Type', async () => {
			const form = ref({
				input: ''
			})
			const rules = ref({
				input: { type: 'string' as FieldType }
			})
			const wrapper = mount(Form, {
				props: {
					model: form.value,
					rules: rules.value
				},
				slots: {
					default: () => [
						h(
							FormItem,
							{ field: 'input', label: 'Input' },
							{
								default: () =>
									h(Input, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			await nextTick()
			expect(wrapper.vm.validate).toBeTypeOf('function')
			const validateRes = await wrapper.vm.validate()
			await nextTick()

			expect(validateRes).toEqual({
				isValid: true,
				results: {
					input: {
						status: 'fulfilled',
						value: {
							level: 'normal',
							message: ''
						}
					}
				}
			})
			const tip = wrapper.findAll('.px-form-item-tip')
			expect(tip.length).toBe(0)

			const types = ['number', 'boolean', 'array', 'dict', 'function', 'date'] as FieldType[]
			for (const curType of types) {
				wrapper.vm.clearValidation()
				rules.value.input.type = curType
				wrapper.setProps({ rules: rules.value })
				const validateRes = await wrapper.vm.validate()
				await nextTick()
				expect(validateRes).toEqual({
					isValid: false,
					results: {
						input: {
							status: 'fulfilled',
							value: {
								level: 'error',
								message: 'input type mismatch'
							}
						}
					}
				})
				const tip = wrapper.findAll('.px-form-item-tip')
				expect(tip.length).toBe(1)
				expect(tip[0].text()).toBe('input type mismatch')
			}
		})
	})
})
