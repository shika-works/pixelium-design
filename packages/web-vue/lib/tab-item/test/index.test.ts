import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, h, nextTick, ref } from 'vue'
import { createMocks } from '../../share/util/test'

import TabItem from '../index.vue'
import { TAB_PROVIDE } from '../../share/const/provide-key'
import { type TabProvide } from '../../tab/type'
import { wait } from 'parsnip-kit'

const { pre, post } = createMocks()

function createMockTabProvide(overrides: Partial<TabProvide> = {}): TabProvide {
	const active = ref<number | string | symbol | null | undefined>(null)
	const variant = ref<'line' | 'card'>('line')
	const closeHandler = vi.fn()
	const selectHandler = vi.fn()
	const hasPrefix = ref(false)
	const hasSuffix = ref(false)
	const justify = ref<'start' | 'center' | 'end'>('start')
	const creatable = ref(false)
	const placement = ref<'top' | 'bottom' | 'left' | 'right'>('top')
	const tabMaxWidth = computed(() => 'none')
	const tabMinWidth = computed(() => 'none')
	const isHorizontal = ref(true)
	const pollSizeChange = ref(false)
	const lastTab = ref(false)

	return {
		active: active as any,
		variant,
		closeHandler,
		selectHandler,
		hasPrefix: hasPrefix as any,
		hasSuffix: hasSuffix as any,
		justify,
		creatable,
		placement,
		tabMaxWidth: tabMaxWidth as any,
		isHorizontal: isHorizontal as any,
		pollSizeChange,
		tabMinWidth: tabMinWidth as any,
		lastTab: lastTab as any,
		...overrides
	}
}

describe('TabItem', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	describe('Rendering', () => {
		it('renders title prop', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1, title: 'My Tab' },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.text()).toContain('My Tab')
		})

		it('renders title slot over title prop', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1, title: 'Prop Title' },
				slots: {
					title: () => 'Slot Title'
				},
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.text()).toContain('Slot Title')
			expect(wrapper.text()).not.toContain('Prop Title')
		})

		it('renders icon slot', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				slots: {
					icon: () => h('span', { class: 'my-icon' }, '★')
				},
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.find('.my-icon').exists()).toBe(true)
		})

		it('has role="tab"', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.attributes('role')).toBe('tab')
		})
	})

	describe('Active state', () => {
		it('applies active class when active matches index', () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-item__active')
		})

		it('does not apply active class when active does not match index', () => {
			const provide = createMockTabProvide()
			provide.active.value = 2

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).not.toContain('px-tab-item__active')
		})

		it('reactively updates active class', async () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabItem, {
				props: { index: 2 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).not.toContain('px-tab-item__active')

			provide.active.value = 2
			await nextTick()

			expect(wrapper.classes()).toContain('px-tab-item__active')
		})
	})

	describe('Disabled state', () => {
		it('applies disabled class when disabled prop is true', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1, disabled: true },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-item__disabled')
		})

		it('does not call selectHandler when disabled', async () => {
			const selectHandler = vi.fn()
			const wrapper = mount(TabItem, {
				props: { index: 1, disabled: true },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide({ selectHandler })
					}
				}
			})

			await wrapper.trigger('click')

			expect(selectHandler).not.toHaveBeenCalled()
		})

		it('does not call closeHandler when disabled', async () => {
			const closeHandler = vi.fn()
			const wrapper = mount(TabItem, {
				props: { index: 1, disabled: true, closable: true },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide({ closeHandler })
					}
				}
			})

			const closeIcon = wrapper.find('.px-tab-item-close-icon')
			await closeIcon.trigger('click')

			expect(closeHandler).not.toHaveBeenCalled()
		})
	})

	describe('Close button', () => {
		it('renders close icon when closable is true', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1, closable: true },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.find('.px-tab-item-close-icon').exists()).toBe(true)
		})

		it('does not render close icon when closable is false/undefined', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.find('.px-tab-item-close-icon').exists()).toBe(false)
		})

		it('calls closeHandler when close icon is clicked', async () => {
			const closeHandler = vi.fn()
			const wrapper = mount(TabItem, {
				props: { index: 1, closable: true },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide({ closeHandler })
					}
				}
			})

			const closeIcon = wrapper.find('.px-tab-item-close-icon')
			await closeIcon.trigger('click')
			await wait(0)

			expect(closeHandler).toHaveBeenCalledWith(1, expect.any(MouseEvent))
		})

		it('does not trigger selectHandler when close icon is clicked', async () => {
			const selectHandler = vi.fn()
			const closeHandler = vi.fn()
			const wrapper = mount(TabItem, {
				props: { index: 1, closable: true },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide({ selectHandler, closeHandler })
					}
				}
			})

			const closeIcon = wrapper.find('.px-tab-item-close-icon')
			await closeIcon.trigger('click')
			await wait(0)

			expect(selectHandler).not.toHaveBeenCalled()
			expect(closeHandler).toHaveBeenCalled()
		})
	})

	describe('Click handling', () => {
		it('calls selectHandler on click', async () => {
			const selectHandler = vi.fn()
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide({ selectHandler })
					}
				}
			})

			// The @click handler is on .px-tab-item-inner, not on the root element
			await wrapper.find('.px-tab-item-inner').trigger('click')

			expect(selectHandler).toHaveBeenCalledWith(1, expect.any(MouseEvent))
		})
	})

	describe('Variant class', () => {
		it('applies line variant class by default', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-item__line')
		})

		it('applies card variant class', () => {
			const provide = createMockTabProvide()
			provide.variant.value = 'card'

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-item__card')
		})
	})

	describe('Placement class', () => {
		it('applies placement class from provide', () => {
			const provide = createMockTabProvide()
			provide.placement.value = 'left'

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-item__left')
		})
	})

	describe('Justify class', () => {
		it('applies justify class from provide', () => {
			const provide = createMockTabProvide()
			provide.justify.value = 'center'

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-item__center')
		})
	})

	describe('Canvas', () => {
		it('renders canvas element for card variant', () => {
			const provide = createMockTabProvide()
			provide.variant.value = 'card'

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.find('canvas').exists()).toBe(true)
		})

		it('does not render canvas for line variant', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			expect(wrapper.find('canvas').exists()).toBe(false)
		})
	})

	describe('Max width', () => {
		it('applies maxWidth style from provide', () => {
			const tabMaxWidth = computed(() => '200px')
			const provide = createMockTabProvide({ tabMaxWidth: tabMaxWidth as any })

			const wrapper = mount(TabItem, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('style')).toContain('max-width: 200px')
		})
	})

	describe('Single icon mode', () => {
		it('renders single icon class when only icon slot is provided', () => {
			const wrapper = mount(TabItem, {
				props: { index: 1 },
				slots: {
					icon: () => h('span', '★')
				},
				global: {
					provide: {
						[TAB_PROVIDE]: createMockTabProvide()
					}
				}
			})

			const iconWrapper = wrapper.find('.px-tab-item-icon')
			expect(iconWrapper.classes()).toContain('px-tab-item-icon__single')
		})
	})
})
