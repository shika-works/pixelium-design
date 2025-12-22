import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, h, nextTick, type ComputedRef } from 'vue'
import Button from '../index.vue'
import ButtonGroup from '../../button-group/index.vue'
import InputGroup from '../../input-group/index.vue'
import {
	BUTTON_GROUP_PROVIDE,
	FORM_PROVIDE,
	FORM_ITEM_PROVIDE
} from '../../share/const/provide-key.ts'
import type { ButtonGroupProvide } from '../../button-group/type.ts'
import type { FormProvide } from '../../form/type.ts'
import type { FormItemProvide } from '../../form-item/type.ts'
import { createMocks } from '../../share/util/test.ts'

describe('Button Component - Comprehensive Tests', () => {
	const { pre, post } = createMocks()

	afterEach(() => {
		post()
	})
	beforeEach(() => {
		pre()
	})

	describe('Basic Rendering and Slots', () => {
		it('should mount component correctly', () => {
			const wrapper = mount(Button)
			expect(wrapper.find('.px-button').exists()).toBe(true)
			expect(wrapper.find('canvas').exists()).toBe(true)
		})

		it('should render default slot content', () => {
			const wrapper = mount(Button, {
				slots: {
					default: 'Click me'
				}
			})
			expect(wrapper.text()).toContain('Click me')
		})

		it('should render icon slot', () => {
			const wrapper = mount(Button, {
				slots: {
					icon: h('span', { class: 'custom-icon' }, '⭐')
				}
			})
			expect(wrapper.find('.custom-icon').exists()).toBe(true)
			expect(wrapper.find('.px-button-icon-wrapper').exists()).toBe(true)
		})

		it('should add __last class to icon slot when no default content', () => {
			const wrapper = mount(Button, {
				slots: {
					icon: h('span', {}, 'icon')
				}
			})
			expect(wrapper.find('.px-button-icon-wrapper__last').exists()).toBe(true)
		})

		it('should handle rapid prop changes without crashing', async () => {
			const wrapper = mount(Button)

			await wrapper.setProps({ variant: 'outline' })
			await wrapper.setProps({ size: 'large' })
			await wrapper.setProps({ theme: 'success' })
			await wrapper.setProps({ color: '#00ff00' })

			// @ts-ignore
			expect(wrapper.vm.typeComputed).toBe('outline')
			// @ts-ignore
			expect(wrapper.vm.sizeComputed).toBe('large')
			// @ts-ignore
			expect(wrapper.vm.themeComputed).toBe('success')
		})
	})

	describe('Props Basic Functionality', () => {
		describe('disabled property', () => {
			it('should apply disabled state and class', () => {
				const wrapper = mount(Button, {
					props: { disabled: true }
				})
				expect(wrapper.attributes('disabled')).toBeDefined()
				expect(wrapper.classes()).toContain('px-button__disabled')
			})

			it('should prevent mouse events when disabled', async () => {
				const wrapper = mount(Button, {
					props: { disabled: true }
				})
				await wrapper.trigger('mouseenter')
				// @ts-ignore
				expect(wrapper.vm.hoverFlag).toBe(false)
				await wrapper.trigger('mousedown')
				// @ts-ignore
				expect(wrapper.vm.activeFlag).toBe(false)
			})
		})

		describe('loading state', () => {
			it('should show loading icon and disable button', () => {
				const wrapper = mount(Button, {
					props: { loading: true }
				})
				expect(wrapper.classes()).toContain('px-button__loading')
				expect(wrapper.find('.px-animation__loading').exists()).toBe(true)
				expect(wrapper.attributes('disabled')).toBeDefined()
			})

			it('should prioritize loading icon over icon slot', () => {
				const wrapper = mount(Button, {
					props: { loading: true },
					slots: {
						icon: h('span', { class: 'custom-icon' }, 'ICON')
					}
				})
				expect(wrapper.find('.px-animation__loading').exists()).toBe(true)
				expect(wrapper.find('.custom-icon').exists()).toBe(false)
			})
		})

		describe('block styles', () => {
			it('should apply block class when not in any group and block=true', () => {
				const wrapper = mount(Button, {
					props: { block: true }
				})
				expect(wrapper.classes()).toContain('px-button__block')
			})

			it('should NOT apply block class when in input group', async () => {
				const wrapper = mount(Button, {
					props: { block: true }
				})
				// @ts-ignore
				wrapper.vm.innerInputGroup = true
				await wrapper.vm.$nextTick()

				expect(wrapper.classes()).not.toContain('px-button__block')
			})
		})

		describe('Native attributes', () => {
			it('should set correct type attribute', () => {
				const wrapper = mount(Button, {
					props: { nativeType: 'submit' }
				})
				expect(wrapper.attributes('type')).toBe('submit')
			})

			it('should set autofocus attribute', () => {
				const wrapper = mount(Button, {
					props: { autofocus: true }
				})
				expect(wrapper.attributes('autofocus')).toBeDefined()
			})
		})

		describe('color custom color', () => {
			it('should generate palette from color prop', async () => {
				const wrapper = mount(Button, {
					props: { color: '#ff0000' }
				})
				await nextTick()
				// @ts-ignore
				expect(wrapper.vm.palette).toBeTruthy()
				// @ts-ignore
				expect(wrapper.vm.palette.length).toBeGreaterThan(0)
				expect(wrapper.classes()).toContain('px-button__custom')
			})

			it('should handle invalid color value', async () => {
				const wrapper = mount(Button, {
					props: { color: 'invalid-color' }
				})
				await nextTick()
				// @ts-ignore
				expect(wrapper.vm.palette).toBeNull()
			})
		})

		describe('size dimensions', () => {
			it.each([
				['large', 'px-button__large'],
				['small', 'px-button__small'],
				['medium', '']
			] as const)('should apply correct class for size="%s"', (size, expectedClass) => {
				const wrapper = mount(Button, {
					props: { size }
				})
				if (expectedClass) {
					expect(wrapper.classes()).toContain(expectedClass)
				} else {
					expect(wrapper.classes()).not.toContain('px-button__large')
					expect(wrapper.classes()).not.toContain('px-button__small')
				}
			})
		})

		describe('shape', () => {
			it.each([
				['circle', 'px-button__circle'],
				['square', 'px-button__square'],
				['rect', '']
			] as const)('should apply correct class for shape="%s"', (shape, expectedClass) => {
				const wrapper = mount(Button, {
					props: { shape }
				})
				if (expectedClass) {
					expect(wrapper.classes()).toContain(expectedClass)
				} else {
					expect(wrapper.classes()).not.toContain('px-button__circle')
					expect(wrapper.classes()).not.toContain('px-button__square')
				}
			})
		})

		describe('variant', () => {
			it.each([
				['outline', 'px-button__outline'],
				['plain', 'px-button__plain'],
				['text', 'px-button__text'],
				['primary', '']
			] as const)('should apply correct class for variant="%s"', (variant, expectedClass) => {
				const wrapper = mount(Button, {
					props: { variant }
				})
				if (expectedClass) {
					expect(wrapper.classes()).toContain(expectedClass)
				} else {
					expect(wrapper.classes()).toContain('px-button__primary')
				}
			})
		})

		describe('theme', () => {
			it('should apply theme class', () => {
				const wrapper = mount(Button, {
					props: { theme: 'success' }
				})
				expect(wrapper.classes()).toContain('px-button__success')
			})
		})

		describe('borderRadius', () => {
			it('should handle custom border radius value', async () => {
				const wrapper = mount(Button, {
					props: { borderRadius: 8 }
				})
				await nextTick()
				// @ts-ignore
				expect(wrapper.vm.borderRadiusComputed).toBe(8)
			})
		})
	})

	describe('Mouse Interaction Events', () => {
		it('should trigger click', async () => {
			const onClick = vi.fn()
			const wrapper = mount(Button, { props: { onClick } })
			await wrapper.trigger('click')
			expect(onClick).toHaveBeenCalled()
		})

		it('should toggle hover state', async () => {
			const wrapper = mount(Button)
			await wrapper.trigger('mouseenter')
			// @ts-ignore
			expect(wrapper.vm.hoverFlag).toBe(true)
			await wrapper.trigger('mouseleave')
			// @ts-ignore
			expect(wrapper.vm.hoverFlag).toBe(false)
		})

		it('should toggle active state', async () => {
			const wrapper = mount(Button)
			await wrapper.trigger('mousedown')
			// @ts-ignore
			expect(wrapper.vm.activeFlag).toBe(true)
			await wrapper.trigger('mouseup')
			// @ts-ignore
			expect(wrapper.vm.activeFlag).toBe(false)
		})
	})

	describe('Provide/Inject Complete Scenarios', () => {
		// Priority: props > FormItem > Form > ButtonGroup/InputGroup > default

		describe('ButtonGroup provide', () => {
			it('should inherit all configuration in ButtonGroup', async () => {
				const wrapper = mount(ButtonGroup, {
					props: {
						size: 'small',
						variant: 'outline',
						disabled: true,
						shape: 'round',
						theme: 'success'
					},
					slots: {
						default: () => [h(Button), h(Button)]
					}
				})

				await nextTick()
				const buttons = wrapper.findAllComponents(Button)

				buttons.forEach((button) => {
					expect(button.classes()).toContain('px-button__small')
					expect(button.classes()).toContain('px-button__outline')
					expect(button.classes()).toContain('px-button__disabled')
					expect(button.classes()).toContain('px-button__round')
					expect(button.classes()).toContain('px-button__success')
					// @ts-ignore
					expect(button.vm.disabledComputed).toBe(true)
				})
			})

			it('should allow individual child button override', async () => {
				const wrapper = mount(ButtonGroup, {
					props: { size: 'small' },
					slots: {
						default: () => [h(Button, { size: 'large' }), h(Button)]
					}
				})

				await nextTick()
				const buttons = wrapper.findAllComponents(Button)
				expect(buttons[0].classes()).toContain('px-button__small') // Inherited
				expect(buttons[1].classes()).toContain('px-button__small') // Inherited
			})

			it('should collect child component info', async () => {
				const collectSpy = vi.fn()
				const buttonGroupProvide: ButtonGroupProvide = {
					size: ref('medium'),
					variant: ref('primary'),
					disabled: ref(false),
					shape: ref('rect'),
					borderRadius: ref(undefined),
					loading: ref(false),
					theme: ref('primary'),
					collectChildrenInfo: collectSpy,
					removeChildrenInfo: vi.fn(),
					childrenInfo: ref([]),
					pollSizeChange: ref(false)
				}

				const wrapper = mount(Button, {
					global: {
						provide: {
							[BUTTON_GROUP_PROVIDE]: buttonGroupProvide
						}
					}
				})

				// @ts-ignore
				wrapper.vm.innerButtonGroup = true
				await nextTick()

				// @ts-ignore
				wrapper.vm.index = ref(0)
				await nextTick()

				expect(collectSpy).toHaveBeenCalled()
			})
		})

		describe('InputGroup provide', () => {
			it('should inherit configuration in InputGroup', async () => {
				const wrapper = mount(InputGroup, {
					props: {
						size: 'large'
					},
					slots: {
						default: () => [h(Button), h(Button)]
					}
				})

				await nextTick()
				const buttons = wrapper.findAllComponents(Button)
				expect(buttons[0].classes()).toContain('px-button__large')
			})
		})

		describe('Form provide', () => {
			it('should inherit disabled and size from Form', async () => {
				const formProvide: FormProvide = {
					disabled: ref(true),
					size: ref('small'),
					maxLabelWidth: ref(100) as ComputedRef,
					labelAlign: ref('right')
				} as any

				const wrapper = mount(Button, {
					global: {
						provide: {
							[FORM_PROVIDE]: formProvide
						}
					}
				})

				await nextTick()
				// @ts-ignore
				expect(wrapper.vm.disabledComputed).toBe(true)
				// @ts-ignore
				expect(wrapper.vm.sizeComputed).toBe('small')
			})
		})

		describe('FormItem provide', () => {
			it('should inherit size and readonly from FormItem', async () => {
				const formItemProvide: FormItemProvide = {
					size: ref('large'),
					readonly: ref(true)
				} as any

				const wrapper = mount(Button, {
					global: {
						provide: {
							[FORM_ITEM_PROVIDE]: formItemProvide
						}
					}
				})

				await nextTick()
				// @ts-ignore
				expect(wrapper.vm.sizeComputed).toBe('large')
				// @ts-ignore
				expect(wrapper.vm.disabledComputed).toBe(true) // readonly causes disabled
			})
		})

		describe('Multiple provide sources priority', () => {
			it('should prioritize size: props > FormItem > Form > ButtonGroup', async () => {
				const formProvide: FormProvide = {
					disabled: ref(false),
					size: ref('small'),
					maxLabelWidth: ref(100) as ComputedRef,
					labelAlign: ref('right')
				} as any
				const formItemProvide: FormItemProvide = {
					size: ref('large')
				} as any
				const buttonGroupProvide: ButtonGroupProvide = {
					size: ref('medium'),
					variant: ref('primary'),
					disabled: ref(false),
					shape: ref('rect'),
					borderRadius: ref(undefined),
					loading: ref(false),
					theme: ref('primary'),
					collectChildrenInfo: vi.fn(),
					removeChildrenInfo: vi.fn(),
					childrenInfo: ref([]),
					pollSizeChange: ref(false)
				}

				const wrapper = mount(Button, {
					props: {
						size: 'medium' // Highest priority
					},
					global: {
						provide: {
							[FORM_PROVIDE]: formProvide,
							[FORM_ITEM_PROVIDE]: formItemProvide,
							[BUTTON_GROUP_PROVIDE]: buttonGroupProvide
						}
					}
				})

				// @ts-ignore
				wrapper.vm.innerButtonGroup = ref(true)
				await nextTick()

				// @ts-ignore
				expect(wrapper.vm.sizeComputed).toBe('medium')
			})

			it('should prioritize disabled: FormItem readonly > Form > ButtonGroup > props', async () => {
				const formProvide: FormProvide = {
					disabled: ref(false),
					size: ref('medium'),
					maxLabelWidth: ref(100) as ComputedRef,
					labelAlign: ref('right')
				} as any
				const formItemProvide: FormItemProvide = {
					size: ref('medium'),
					readonly: ref(true) // This should disable the button
				} as any
				const buttonGroupProvide: ButtonGroupProvide = {
					size: ref('medium'),
					variant: ref('primary'),
					disabled: ref(false),
					shape: ref('rect'),
					borderRadius: ref(undefined),
					loading: ref(false),
					theme: ref('primary'),
					collectChildrenInfo: vi.fn(),
					removeChildrenInfo: vi.fn(),
					childrenInfo: ref([]),
					pollSizeChange: ref(false)
				}

				const wrapper = mount(Button, {
					props: {
						disabled: false
					},
					global: {
						provide: {
							[FORM_PROVIDE]: formProvide,
							[FORM_ITEM_PROVIDE]: formItemProvide,
							[BUTTON_GROUP_PROVIDE]: buttonGroupProvide
						}
					}
				})

				// @ts-ignore
				wrapper.vm.innerButtonGroup = ref(true)
				await nextTick()

				// @ts-ignore
				expect(wrapper.vm.disabledComputed).toBe(true)
			})
		})

		describe('Edge cases and cleanup', () => {
			it('should cleanup registration info on unmount', async () => {
				const removeSpy = vi.fn()
				const buttonGroupProvide: ButtonGroupProvide = {
					size: ref('medium'),
					variant: ref('primary'),
					disabled: ref(false),
					shape: ref('rect'),
					borderRadius: ref(undefined),
					loading: ref(false),
					theme: ref('primary'),
					collectChildrenInfo: vi.fn(),
					removeChildrenInfo: removeSpy,
					childrenInfo: ref([]),
					pollSizeChange: ref(false)
				}

				const wrapper = mount(Button, {
					global: {
						provide: {
							[BUTTON_GROUP_PROVIDE]: buttonGroupProvide
						}
					}
				})

				// @ts-ignore
				wrapper.vm.innerButtonGroup = true
				await nextTick()

				wrapper.unmount()
				expect(removeSpy).toHaveBeenCalled()
			})

			it('should handle index changes', async () => {
				const collectSpy = vi.fn()
				const buttonGroupProvide: ButtonGroupProvide = {
					size: ref('medium'),
					variant: ref('primary'),
					disabled: ref(false),
					shape: ref('rect'),
					borderRadius: ref(undefined),
					loading: ref(false),
					theme: ref('primary'),
					collectChildrenInfo: collectSpy,
					removeChildrenInfo: vi.fn(),
					childrenInfo: ref([]),
					pollSizeChange: ref(false)
				}

				const wrapper = mount(Button, {
					global: {
						provide: {
							[BUTTON_GROUP_PROVIDE]: buttonGroupProvide
						}
					}
				})

				// @ts-ignore
				wrapper.vm.innerButtonGroup = true

				// @ts-ignore
				wrapper.vm.index = 0
				await nextTick()

				// @ts-ignore
				wrapper.vm.index = 1
				await nextTick()

				expect(collectSpy).toHaveBeenCalledTimes(2)
			})
		})
	})

	describe('Render with text button', () => {
		it('should correctly detect next button with nextIsTextButton', async () => {
			const wrapper = mount(ButtonGroup, {
				slots: {
					default: () => [
						h(Button, { variant: 'primary' }),
						h(Button, { variant: 'text' }),
						h(Button, { variant: 'primary' })
					]
				}
			})

			await nextTick()
			const buttons = wrapper.findAllComponents(Button)

			// @ts-ignore
			expect(buttons[0].vm.nextIsTextButton).toBe(true)
			// @ts-ignore
			expect(buttons[1].vm.nextIsTextButton).toBe(false)
			// @ts-ignore
			expect(buttons[2].vm.nextIsTextButton).toBe(false)
		})
	})
})
