// FormItem.test.vue
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref, reactive, provide, nextTick, isRef, type ComputedRef, h } from 'vue'
import FormItem from '../index.vue'
import { FORM_PROVIDE } from '../../share/const/provide-key'
import type { FormProvide } from '../../form/type'
import { createMocks } from '../../share/util/test'
import Input from '../../input/index.vue'

// Mock form context
const createMockFormContext = (options: any = {}): FormProvide => ({
	model: ref(options.model || {}),
	rules: ref(options.rules || {}),
	disabled: ref(options.disabled || false),
	readonly: ref(options.readonly || false),
	showAsterisk: ref(options.showAsterisk ?? true),
	asteriskPlacement: ref(options.asteriskPlacement || 'right'),
	labelAlign: ref(options.labelAlign || 'right'),
	labelAutoWidth: ref(options.labelAutoWidth || false),
	size: ref(options.size || 'medium'),
	registerField: vi.fn(),
	unregisterField: vi.fn(),
	collectLabelWidth: vi.fn(),
	removeLabelWidth: vi.fn(),
	rowProps: ref(options.rowProps || {}),
	labelProps: ref(options.labelProps || {}),
	contentProps: ref(options.contentProps || {}),
	maxLabelWidth: ref(options.maxLabelWidth || -1) as ComputedRef<number>
})

describe('FormItem Component Tests', () => {
	let wrapper: VueWrapper<any>
	let mockFormContext: any

	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})
	afterEach(() => {
		post()
	})

	describe('Basic Rendering', () => {
		it('should render label and content area correctly', () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: {
							template: '<div class="mock-row"><slot /></div>'
						},
						Col: {
							template: '<div class="mock-col"><slot /></div>'
						}
					}
				},
				slots: {
					default: '<input />'
				}
			})

			expect(wrapper.find('.px-form-item-label').text()).toContain('Username')
			expect(wrapper.find('.px-form-item-content input').exists()).toBe(true)
		})

		it('should only render content area when no label provided', () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					default: '<input />'
				}
			})

			expect(wrapper.find('.px-form-item-label-wrapper').exists()).toBe(false)
			expect(wrapper.find('input').exists()).toBe(true)
		})

		it('should support label slot', async () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					label: '<span class="custom-label">Custom Label</span>',
					default: '<input />'
				}
			})

			await nextTick()
			expect(wrapper.find('.custom-label').exists()).toBe(true)
			expect(wrapper.find('.custom-label').text()).toBe('Custom Label')
		})

		it('should adjust layout based on labelAlign property', async () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					label: 'Test',
					labelAlign: 'top'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				}
			})

			await nextTick()
			const labelCol = wrapper.find('.px-form-item-label-wrapper')
			const contentCol = wrapper.find('.px-form-item-content-wrapper')

			expect(labelCol.attributes('class')).toContain('px-col__span-24')
			expect(contentCol.attributes('class')).toContain('px-col__span-24')
		})
	})

	describe('Asterisk Display', () => {
		it('should display asterisk for required field', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true, message: 'Please enter username' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				}
			})

			await nextTick()
			expect(wrapper.find('.px-form-item-asterisk').exists()).toBe(true)
		})

		it('should support asterisk placement configuration', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username',
					asteriskPlacement: 'left'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				}
			})

			await nextTick()
			const asterisk = wrapper.find('.px-form-item-asterisk')
			expect(asterisk.html()).toContain('*&nbsp;')
		})

		it('should hide asterisk when showAsterisk is false', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true }]
				},
				showAsterisk: false
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			expect(wrapper.find('.px-form-item-asterisk').exists()).toBe(false)
		})
	})

	describe('Form Context Integration', () => {
		it('should throw error when not used inside Form', () => {
			expect(() => {
				mount(FormItem, {
					props: { label: 'Test' }
				})
			}).toThrow('FormItem must be used inside Form')
		})

		it('should register field to form context', async () => {
			mockFormContext = createMockFormContext({
				model: { username: 'test' }
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			expect(mockFormContext.registerField).toHaveBeenCalledTimes(1)
			expect(mockFormContext.registerField).toHaveBeenCalledWith(
				expect.objectContaining({
					field: 'username',
					validate: expect.any(Function),
					reset: expect.any(Function),
					clearValidation: expect.any(Function)
				})
			)
		})

		it('should unregister field on unmount', async () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			wrapper.unmount()
			expect(mockFormContext.unregisterField).toHaveBeenCalledWith('username')
		})

		it('should inherit properties from form context', async () => {
			mockFormContext = createMockFormContext({
				disabled: true,
				readonly: true,
				size: 'small'
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Test'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			expect(wrapper.vm.mergedProps.disabled).toBe(true)
			expect(wrapper.vm.mergedProps.readonly).toBe(true)
			expect(wrapper.vm.mergedProps.size).toBe('small')
		})
	})

	describe('Validation Logic', () => {
		it('should execute required validation', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true, message: 'Please enter username' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('Please enter username')
			expect(result.level).toBe('error')
		})

		it('should execute type validation', async () => {
			mockFormContext = createMockFormContext({
				model: { age: 'abc' },
				rules: {
					age: [{ type: 'number', message: 'Age must be a number' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Age',
					field: 'age'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('Age must be a number')
		})

		it('should execute custom validator', async () => {
			const customValidator = vi.fn((value) => {
				if (value !== 'admin') return 'Must be admin'
			})

			mockFormContext = createMockFormContext({
				model: { username: 'user' },
				rules: {
					username: [{ validator: customValidator }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('Must be admin')
			expect(customValidator).toHaveBeenCalledWith('user', mockFormContext.model)
		})

		it('should support multiple type validation', async () => {
			mockFormContext = createMockFormContext({
				model: { value: 123 },
				rules: {
					value: [{ type: ['string', 'number'], message: 'Type mismatch' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Value',
					field: 'value'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('') // Should pass because 123 is number
		})

		it('should filter rules by trigger', async () => {
			const blurValidator = vi.fn(() => 'blur error')
			const changeValidator = vi.fn(() => 'change error')

			mockFormContext = createMockFormContext({
				model: { field: '' },
				rules: {
					field: [
						{ validator: blurValidator, trigger: 'blur' },
						{ validator: changeValidator, trigger: 'change' }
					]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Field',
					field: 'field'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const blurResult = await wrapper.vm.validate('blur')
			expect(blurValidator).toHaveBeenCalled()
			expect(changeValidator).not.toHaveBeenCalled()
			expect(blurResult.message).toBe('blur error')

			const changeResult = await wrapper.vm.validate('change')
			expect(changeValidator).toHaveBeenCalled()
			expect(changeResult.message).toBe('change error')
		})
	})

	describe('Event Handling', () => {
		it('should handle input event and trigger validation', async () => {
			const validator = vi.fn(() => 'input error')

			mockFormContext = createMockFormContext({
				model: { field: '' },
				rules: {
					field: [{ validator, trigger: 'input' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Field',
					field: 'field'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					default: () => {
						return h(Input, { modelValue: mockFormContext.model.value.field })
					}
				},
				attachTo: 'body'
			})

			await nextTick()
			const inputWrapper = wrapper.find('.px-input input')
			inputWrapper.trigger('input')
			await nextTick()

			expect(validator).toHaveBeenCalled()
		})

		it('should handle blur event', async () => {
			mockFormContext = createMockFormContext({
				model: { field: '' },
				rules: {
					field: [{ required: true }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Field',
					field: 'field'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					default: () => {
						return h(Input, { modelValue: mockFormContext.model.value.field })
					}
				},
				attachTo: 'body'
			})

			await nextTick()
			const inputWrapper = wrapper.find('.px-input input')
			inputWrapper.trigger('focusout')
			await nextTick()

			expect(wrapper.vm.tipMessage).toEqual({
				message: 'field is required',
				level: 'error'
			})
		})

		it('should handle change event', async () => {
			mockFormContext = createMockFormContext({
				model: { field: '' },
				rules: {
					field: [{ required: true }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Field',
					field: 'field'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					default: () => {
						return h(Input, { modelValue: mockFormContext.model.value.field })
					}
				},
				attachTo: 'body'
			})

			await nextTick()

			const inputWrapper = wrapper.find('.px-input input')
			inputWrapper.trigger('change')

			await nextTick()

			expect(wrapper.vm.tipMessage).toEqual({
				message: 'field is required',
				level: 'error'
			})
		})
	})

	describe('Message Tips', () => {
		it('should display validation error messages', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true, message: 'Username is required' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				}
			})

			await nextTick()
			await wrapper.vm.validate()
			await nextTick()

			expect(wrapper.find('.px-form-item-tip').exists()).toBe(true)
			expect(wrapper.find('.px-form-item-tip').text()).toBe('Username is required')
			expect(wrapper.find('.px-form-item-tip').classes()).toContain('px-form-item-tip__error')
		})

		it('should support tip slot', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					tip: '<span class="custom-tip">Custom tip message</span>'
				}
			})

			await nextTick()
			expect(wrapper.find('.custom-tip').text()).toBe('Custom tip message')
		})

		it('should display extra content', () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					label: 'Test'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				},
				slots: {
					extra: '<span class="extra-content">Extra information</span>'
				}
			})

			expect(wrapper.find('.extra-content').text()).toBe('Extra information')
		})
	})

	describe('Reset and Clear Validation', () => {
		it('should reset field to initial value', async () => {
			const model = ref({ username: 'initial' })
			mockFormContext = createMockFormContext({
				model: model.value
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			// Modify value
			model.value.username = 'changed'
			expect(model.value.username).toBe('changed')

			// Execute reset
			await wrapper.vm.reset()
			expect(model.value.username).toBe('initial')
		})

		it('should clear validation messages', async () => {
			mockFormContext = createMockFormContext({
				model: { username: '' },
				rules: {
					username: [{ required: true, message: 'Required' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Username',
					field: 'username'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			await wrapper.vm.validate()
			expect(wrapper.vm.tipMessage.message).toBe('Required')

			wrapper.vm.clearValidation()
			expect(wrapper.vm.tipMessage.message).toBe('')
			expect(wrapper.vm.tipMessage.level).toBe('normal')
		})
	})

	describe('Edge Cases', () => {
		it('should handle missing field property', async () => {
			mockFormContext = createMockFormContext()

			wrapper = mount(FormItem, {
				props: {
					label: 'Test'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('')
			expect(mockFormContext.registerField).not.toHaveBeenCalled()
		})

		it('should handle empty rules', async () => {
			mockFormContext = createMockFormContext({
				model: { field: 'value' },
				rules: {}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Test',
					field: 'field'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('')
		})

		it('should handle array length validation', async () => {
			mockFormContext = createMockFormContext({
				model: { tags: ['a', 'b'] },
				rules: {
					tags: [{ minLength: 3, message: 'At least 3 items' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Tags',
					field: 'tags'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('At least 3 items')
		})

		it('should handle email validation', async () => {
			mockFormContext = createMockFormContext({
				model: { email: 'invalid-email' },
				rules: {
					email: [{ email: true, message: 'Invalid email format' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Email',
					field: 'email'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('Invalid email format')
		})

		it('should handle URL validation', async () => {
			mockFormContext = createMockFormContext({
				model: { website: 'not-a-url' },
				rules: {
					website: [{ url: true, message: 'Invalid URL format' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Website',
					field: 'website'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()
			const result = await wrapper.vm.validate()
			expect(result.message).toBe('Invalid URL format')
		})

		it('should handle numberString validation', async () => {
			mockFormContext = createMockFormContext({
				model: { phone: 'abc123' },
				rules: {
					phone: [{ numberString: true, message: 'Must be numeric string' }]
				}
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Phone',
					field: 'phone'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					},
					stubs: {
						Row: true,
						Col: true
					}
				}
			})

			await nextTick()

			const result = await wrapper.vm.validate()

			expect(result.message).toBe('Must be numeric string')
		})
	})

	describe('Label Width Calculation', () => {
		it('should calculate width when labelAutoWidth is enabled', async () => {
			mockFormContext = createMockFormContext({
				labelAutoWidth: true,
				maxLabelWidth: ref(0)
			})

			wrapper = mount(FormItem, {
				props: {
					label: 'Test Label',
					field: 'test'
				},
				global: {
					provide: {
						[FORM_PROVIDE]: mockFormContext
					}
				}
			})

			await nextTick()

			expect(mockFormContext.collectLabelWidth).toHaveBeenCalled()
		})
	})
})
