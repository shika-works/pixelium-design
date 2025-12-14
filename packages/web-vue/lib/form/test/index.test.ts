import { describe, afterEach, beforeEach, it, vi, expect } from 'vitest'
import { createMocks } from '../../share/util/test'
import { mount } from '@vue/test-utils'
import Form from '../index.vue'
import FormItem from '../../form-item/index.vue'
import Input from '../../input/index.vue'
import Button from '../../button/index.vue'
import ButtonGroup from '../../button-group/index.vue'
import AutoComplete from '../../auto-complete/index.vue'
import InputTag from '../../input-tag/index.vue'
import InputNumber from '../../input-number/index.vue'
import Textarea from '../../textarea/index.vue'
import Select from '../../select/index.vue'
import InputGroup from '../../input-group/index.vue'
import { h, nextTick, ref } from 'vue'
import type { FieldType } from '../type'
import Switch from '../../switch/index.vue'
import Slider from '../../slider/index.vue'
import Checkbox from '../../checkbox/index.vue'
import CheckboxGroup from '../../checkbox-group/index.vue'
import Radio from '../../radio/index.vue'
import RadioGroup from '../../radio-group/index.vue'

describe('Form Component', () => {
	const { pre, post } = createMocks()
	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})
	describe('Control Rendering', () => {
		it('Button', async () => {
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

			wrapper.setProps({ readonly: true })
			await nextTick()
			const buttonAll1 = wrapper.findAll('button')
			expect(buttonAll1[0].attributes('disabled')).toBe('')
			expect(buttonAll1[1].attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const buttonAll2 = wrapper.findAll('button')
			expect(buttonAll2[0].attributes('disabled')).toBe('')
			expect(buttonAll2[1].attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const buttonAll3 = wrapper.findAll('button')
			expect(buttonAll3[0].attributes('class')).include('px-button__large')
			expect(buttonAll3[1].attributes('class')).include('px-button__large')
		})
		it('ButtonGroup', async () => {
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
							ButtonGroup,
							{},
							{
								default: () => [
									h(Button, {}, { default: 'Submit' }),
									h(Button, {}, { default: 'test' })
								]
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const buttonAll1 = wrapper.findAll('button')
			expect(buttonAll1[0].attributes('disabled')).toBe('')
			expect(buttonAll1[1].attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const buttonAll2 = wrapper.findAll('button')
			expect(buttonAll2[0].attributes('disabled')).toBe('')
			expect(buttonAll2[1].attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const buttonAll3 = wrapper.findAll('button')
			expect(buttonAll3[0].attributes('class')).include('px-button__large')
			expect(buttonAll3[1].attributes('class')).include('px-button__large')
		})
		it('Input', async () => {
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
									h(Input, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-input')
			expect(input3.attributes('class')).include('px-input__large')
		})
		it('AutoComponent', async () => {
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
									h(AutoComplete, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-auto-complete')
			expect(input3.attributes('class')).include('px-auto-complete__large')
		})
		it('InputTag', async () => {
			const form = ref({
				input: [] as string[]
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
									h(InputTag, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-input-tag')
			expect(input3.attributes('class')).include('px-input-tag__large')
		})
		it('InputNumber', async () => {
			const form = ref({
				input: 0
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
									h(InputNumber, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-input-number')
			expect(input3.attributes('class')).include('px-input-number__large')
		})
		it('Textarea', async () => {
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
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('textarea')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('textarea')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-textarea')
			expect(input3.attributes('class')).include('px-textarea__large')
		})
		it('Select', async () => {
			const form = ref({
				input: null
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
									h(Select, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-select')
			expect(input3.attributes('class')).include('px-select__large')
		})
		it('InputGroup', async () => {
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
									h(
										InputGroup,
										{},
										{
											default: () =>
												h(Input, {
													modelValue: form.value.input,
													'onUpdate:modelValue': (e) => (form.value.input = e)
												})
										}
									)
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-input')
			expect(input3.attributes('class')).include('px-input__large')
		})
		it('Switch', async () => {
			const form = ref({
				input: false
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
									h(Switch, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'small' })
			await nextTick()
			const input3 = wrapper.find('.px-switch')
			expect(input3.attributes('class')).include('px-switch__small')
		})
		it('Slider', async () => {
			const form = ref({
				input: 0
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
									h(Slider, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e as number)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('.px-slider')
			expect(input1.attributes('tabindex')).toBe('-1')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('.px-slider')
			expect(input2.attributes('tabindex')).toBe('-1')
		})
		it('Checkbox', async () => {
			const form = ref({
				input: false
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
									h(Checkbox, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-checkbox')
			expect(input3.attributes('class')).include('px-checkbox__large')
		})
		it('CheckboxGroup', async () => {
			const form = ref({
				input: [] as any[]
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
									h(
										CheckboxGroup,
										{
											modelValue: form.value.input,
											'onUpdate:modelValue': (e) => (form.value.input = e)
										},
										{
											default: () => h(Checkbox, {})
										}
									)
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-checkbox')
			expect(input3.attributes('class')).include('px-checkbox__large')
		})
		it('Radio', async () => {
			const form = ref({
				input: false
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
									h(Radio, {
										modelValue: form.value.input,
										'onUpdate:modelValue': (e) => (form.value.input = e)
									})
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-radio')
			expect(input3.attributes('class')).include('px-radio__large')
		})
		it('RadioGroup', async () => {
			const form = ref({
				input: null as any
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
									h(
										RadioGroup,
										{
											modelValue: form.value.input,
											'onUpdate:modelValue': (e) => (form.value.input = e)
										},
										{
											default: () => h(Radio, {})
										}
									)
							}
						)
					]
				}
			})

			wrapper.setProps({ readonly: true })
			await nextTick()
			const input1 = wrapper.find('input')
			expect(input1.attributes('disabled')).toBe('')

			wrapper.setProps({ readonly: false, disabled: true })
			await nextTick()
			const input2 = wrapper.find('input')
			expect(input2.attributes('disabled')).toBe('')

			wrapper.setProps({ size: 'large' })
			await nextTick()
			const input3 = wrapper.find('.px-radio')
			expect(input3.attributes('class')).include('px-radio__large')
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
