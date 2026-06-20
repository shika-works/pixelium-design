import { describe, afterEach, beforeEach, it, expect } from 'vitest'
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

	describe('Button Components', () => {
		const buttonControlCases = [
			{
				name: 'Button',
				render: () => [
					h(Button, { nativeType: 'submit' }, { default: 'Submit' }),
					h(Button, { nativeType: 'reset', theme: 'info' }, { default: 'Reset' })
				]
			},
			{
				name: 'ButtonGroup',
				render: () =>
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
			}
		]
		buttonControlCases.forEach((controlCase) => {
			it(controlCase.name, async () => {
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
						default: () =>
							Array.isArray(controlCase.render())
								? controlCase.render()
								: [controlCase.render()]
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
		})
	})
	describe('Control Rendering', () => {
		const commonControlCases = [
			{
				name: 'Input',
				initial: '',
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Input, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: string) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-input',
				sizeClass: 'px-input__large'
			},
			{
				name: 'AutoComplete',
				initial: '',
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(AutoComplete, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: string) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-auto-complete',
				sizeClass: 'px-auto-complete__large'
			},
			{
				name: 'InputTag',
				initial: [] as string[],
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(InputTag, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: string[]) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-input-tag',
				sizeClass: 'px-input-tag__large'
			},
			{
				name: 'InputNumber',
				initial: 0,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(InputNumber, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: number) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-input-number',
				sizeClass: 'px-input-number__large'
			},
			{
				name: 'Textarea',
				initial: '',
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Textarea, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: string) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'textarea',
				sizeTarget: '.px-textarea',
				sizeClass: 'px-textarea__large'
			},
			{
				name: 'Select',
				initial: null,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Select, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: any) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-select',
				sizeClass: 'px-select__large'
			},
			{
				name: 'InputGroup',
				initial: '',
				render: (form: any) =>
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
												'onUpdate:modelValue': (e: string) => (form.value.input = e)
											})
									}
								)
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-input',
				sizeClass: 'px-input__large'
			},
			{
				name: 'Switch',
				initial: false,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Switch, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: boolean) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-switch',
				sizeClass: 'px-switch__large'
			},
			{
				name: 'Checkbox',
				initial: false,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Checkbox, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: boolean) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-checkbox',
				sizeClass: 'px-checkbox__large'
			},
			{
				name: 'CheckboxGroup',
				initial: [] as unknown[],
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(
									CheckboxGroup,
									{
										modelValue: form.value.input,
										'onUpdate:modelValue': (e: any[]) => (form.value.input = e)
									},
									{ default: () => h(Checkbox, {}) }
								)
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-checkbox',
				sizeClass: 'px-checkbox__large'
			},
			{
				name: 'Radio',
				initial: false,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Radio, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: boolean) => (form.value.input = e)
								})
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-radio',
				sizeClass: 'px-radio__large'
			},
			{
				name: 'RadioGroup',
				initial: null,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(
									RadioGroup,
									{
										modelValue: form.value.input,
										'onUpdate:modelValue': (e: any) => (form.value.input = e)
									},
									{ default: () => h(Radio, {}) }
								)
						}
					),
				disabledTarget: 'input',
				sizeTarget: '.px-radio',
				sizeClass: 'px-radio__large'
			},
			{
				name: 'Slider',
				initial: 0,
				render: (form: any) =>
					h(
						FormItem,
						{ field: 'input', label: 'Input' },
						{
							default: () =>
								h(Slider, {
									modelValue: form.value.input,
									'onUpdate:modelValue': (e: number | number[]) => (form.value.input = e)
								})
						}
					),
				disabledTarget: '.px-slider',
				disabledAttr: 'tabindex',
				disabledValue: '-1'
			}
		]

		commonControlCases.forEach((controlCase) => {
			it(controlCase.name, async () => {
				const form = ref({ input: controlCase.initial })
				const rules = { input: { required: true } }
				const wrapper = mount(Form, {
					props: { model: form.value, rules },
					slots: { default: () => [controlCase.render(form)] }
				})

				wrapper.setProps({ readonly: true })
				await nextTick()
				const disabledObserved = wrapper.find(controlCase.disabledTarget)
				if (controlCase.disabledAttr === 'tabindex') {
					expect(disabledObserved.attributes('tabindex')).toBe(controlCase.disabledValue)
				} else {
					expect(disabledObserved.attributes('disabled')).toBe('')
				}

				wrapper.setProps({ readonly: false, disabled: true })
				await nextTick()
				const disabledObserved2 = wrapper.find(controlCase.disabledTarget)
				if (controlCase.disabledAttr === 'tabindex') {
					expect(disabledObserved2.attributes('tabindex')).toBe(controlCase.disabledValue)
				} else {
					expect(disabledObserved2.attributes('disabled')).toBe('')
				}

				if (controlCase.sizeTarget) {
					wrapper.setProps({ size: 'large' })
					await nextTick()
					const sizeObserved = wrapper.find(controlCase.sizeTarget)
					expect(sizeObserved.attributes('class')).include(controlCase.sizeClass)
				}
			})
		})
	})
})
