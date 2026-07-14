import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import CollapseItem from '../index.vue'
import { COLLAPSE_PROVIDE } from '../../share/const/provide-key'
import type { CollapseProvide } from '../../collapse/type'
import { createMocks } from '../../share/util/test'

const stubs = {
	ChevronUp: true
}

function createMockCollapseProvide(overrides: Partial<CollapseProvide> = {}): CollapseProvide {
	const activeIndices = ref<(string | number | symbol)[] | undefined | null>([])
	return {
		activeIndices,
		accordion: ref(false),
		toggle: vi.fn((index: string | number | symbol) => {
			const current = activeIndices.value ?? []
			const i = current.indexOf(index)
			if (i > -1) {
				activeIndices.value = current.filter((n) => n !== index)
			} else {
				activeIndices.value = [...current, index]
			}
		}),
		animationDuration: ref(250),
		showExpandIcon: ref(true),
		expandIconPlacement: ref('left' as const),
		destroyOnHide: ref(false),
		disabled: ref(false),
		variant: ref('line' as const),
		pollSizeChange: ref(false),
		...overrides
	}
}

function mountCollapseItem(
	props: Record<string, any> = {},
	provideOverrides: Partial<CollapseProvide> = {},
	slots: Record<string, string> = {}
) {
	const mockProvide = createMockCollapseProvide(provideOverrides)
	return {
		wrapper: mount(CollapseItem, {
			props: { index: 0, ...props },
			global: {
				stubs,
				provide: {
					[COLLAPSE_PROVIDE]: mockProvide
				}
			},
			slots
		}),
		mockProvide
	}
}

describe('CollapseItem', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
		vi.useFakeTimers({ shouldAdvanceTime: true })
	})

	afterEach(() => {
		vi.useRealTimers()
		post()
	})

	describe('basic rendering', () => {
		it('renders the collapse item wrapper with px-collapse-item class', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item').exists()).toBe(true)
		})

		it('renders the header element', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-header').exists()).toBe(true)
		})

		it('renders the content section', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-content').exists()).toBe(true)
		})

		it('renders the content wrapper element', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(true)
		})

		it('renders the content box element', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-content-box').exists()).toBe(true)
		})

		it('renders title text when title prop is provided', () => {
			const { wrapper } = mountCollapseItem({ title: 'My Panel' })
			const titleEl = wrapper.find('.px-collapse-item-title')
			expect(titleEl.exists()).toBe(true)
			expect(titleEl.text()).toContain('My Panel')
		})

		it('renders with variant class from collapse provide', () => {
			const { wrapper } = mountCollapseItem({}, { variant: ref('card' as const) })
			expect(wrapper.find('.px-collapse-item__card').exists()).toBe(true)
		})
	})

	describe('active state', () => {
		it('applies active class when index is in activeIndices', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = [0]
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			expect(wrapper.find('.px-collapse-item').classes()).toContain('px-collapse-item__active')
			expect(wrapper.find('.px-collapse-item-header').classes()).toContain(
				'px-collapse-item-header__active'
			)
		})

		it('does not apply active class when index is not in activeIndices', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = [1, 2]
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			expect(wrapper.find('.px-collapse-item').classes()).not.toContain(
				'px-collapse-item__active'
			)
			expect(wrapper.find('.px-collapse-item-header').classes()).not.toContain(
				'px-collapse-item-header__active'
			)
		})

		it('reacts to activeIndices changes', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			expect(wrapper.find('.px-collapse-item').classes()).not.toContain(
				'px-collapse-item__active'
			)

			mockProvide.activeIndices.value = [0]
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			expect(wrapper.find('.px-collapse-item').classes()).toContain('px-collapse-item__active')
		})
	})

	describe('header click interactions', () => {
		it('calls toggle on the collapse provide when header is clicked', async () => {
			const toggle = vi.fn()
			const { wrapper } = mountCollapseItem({}, { toggle })
			await nextTick()

			const header = wrapper.find('.px-collapse-item-header')
			await header.trigger('click')

			expect(toggle).toHaveBeenCalledTimes(1)
			expect(toggle).toHaveBeenCalledWith(0)
		})

		it('does not call toggle when disabled', async () => {
			const toggle = vi.fn()
			const { wrapper } = mountCollapseItem({ disabled: true }, { toggle })
			await nextTick()

			const header = wrapper.find('.px-collapse-item-header')
			await header.trigger('click')

			expect(toggle).not.toHaveBeenCalled()
		})

		it('does not call toggle when collapse is disabled', async () => {
			const toggle = vi.fn()
			const { wrapper } = mountCollapseItem({}, { toggle, disabled: ref(true) })
			await nextTick()

			const header = wrapper.find('.px-collapse-item-header')
			await header.trigger('click')

			expect(toggle).not.toHaveBeenCalled()
		})
	})

	describe('disabled state', () => {
		it('applies disabled class to the item wrapper', () => {
			const { wrapper } = mountCollapseItem({ disabled: true })
			expect(wrapper.find('.px-collapse-item').classes()).toContain(
				'px-collapse-item__disabled'
			)
		})

		it('applies disabled class to the header', () => {
			const { wrapper } = mountCollapseItem({ disabled: true })
			expect(wrapper.find('.px-collapse-item-header').classes()).toContain(
				'px-collapse-item-header__disabled'
			)
		})

		it('does not apply disabled class when not disabled', () => {
			const { wrapper } = mountCollapseItem({ disabled: false })
			expect(wrapper.find('.px-collapse-item').classes()).not.toContain(
				'px-collapse-item__disabled'
			)
			expect(wrapper.find('.px-collapse-item-header').classes()).not.toContain(
				'px-collapse-item-header__disabled'
			)
		})

		it('applies disabled class when collapse is disabled', () => {
			const { wrapper } = mountCollapseItem({}, { disabled: ref(true) })
			expect(wrapper.find('.px-collapse-item').classes()).toContain(
				'px-collapse-item__disabled'
			)
			expect(wrapper.find('.px-collapse-item-header').classes()).toContain(
				'px-collapse-item-header__disabled'
			)
		})

		it('applies disabled class when both collapse and item are disabled', () => {
			const { wrapper } = mountCollapseItem({ disabled: true }, { disabled: ref(true) })
			expect(wrapper.find('.px-collapse-item').classes()).toContain(
				'px-collapse-item__disabled'
			)
			expect(wrapper.find('.px-collapse-item-header').classes()).toContain(
				'px-collapse-item-header__disabled'
			)
		})
	})

	describe('slots', () => {
		it('renders default slot content', () => {
			const { wrapper } = mountCollapseItem(
				{},
				{},
				{
					default: '<span class="my-content">Custom Content</span>'
				}
			)
			const content = wrapper.find('.my-content')
			expect(content.exists()).toBe(true)
			expect(content.text()).toBe('Custom Content')
		})

		it('renders title slot content overriding title prop', () => {
			const { wrapper } = mountCollapseItem(
				{ title: 'Prop Title' },
				{},
				{
					title: '<span class="custom-title">Slot Title</span>'
				}
			)
			const title = wrapper.find('.custom-title')
			expect(title.exists()).toBe(true)
			expect(title.text()).toBe('Slot Title')
			// The prop title should not appear
			expect(wrapper.find('.px-collapse-item-title').text()).not.toContain('Prop Title')
		})

		it('renders prefix slot', () => {
			const { wrapper } = mountCollapseItem(
				{},
				{},
				{
					prefix: '<span class="prefix-icon">🔔</span>'
				}
			)
			expect(wrapper.find('.prefix-icon').exists()).toBe(true)
			expect(wrapper.find('.px-collapse-item-extra').exists()).toBe(true)
		})

		it('renders suffix slot', () => {
			const { wrapper } = mountCollapseItem(
				{},
				{},
				{
					suffix: '<span class="suffix-icon">⚙️</span>'
				}
			)
			expect(wrapper.find('.suffix-icon').exists()).toBe(true)
			expect(wrapper.findAll('.px-collapse-item-extra')).toHaveLength(1)
		})

		it('renders both prefix and suffix slots', () => {
			const { wrapper } = mountCollapseItem(
				{},
				{},
				{
					prefix: '<span class="pre">P</span>',
					suffix: '<span class="suf">S</span>'
				}
			)
			expect(wrapper.find('.pre').exists()).toBe(true)
			expect(wrapper.find('.suf').exists()).toBe(true)
			expect(wrapper.findAll('.px-collapse-item-extra')).toHaveLength(2)
		})

		it('does not render prefix slot when not provided', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-extra').exists()).toBe(false)
		})
	})

	describe('expand icon (arrow)', () => {
		it('renders expand arrow by default', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-arrow').exists()).toBe(true)
		})

		it('renders arrow on the left by default', () => {
			const { wrapper } = mountCollapseItem()
			expect(wrapper.find('.px-collapse-item-arrow__left').exists()).toBe(true)
			expect(wrapper.find('.px-collapse-item-arrow__right').exists()).toBe(false)
		})

		it('renders arrow on the right when expandIconPlacement is right', () => {
			const { wrapper } = mountCollapseItem({}, { expandIconPlacement: ref('right' as const) })
			expect(wrapper.find('.px-collapse-item-arrow__right').exists()).toBe(true)
			expect(wrapper.find('.px-collapse-item-arrow__left').exists()).toBe(false)
		})

		it('does not render arrow when showExpandIcon is false', () => {
			const { wrapper } = mountCollapseItem({}, { showExpandIcon: ref(false) })
			expect(wrapper.find('.px-collapse-item-arrow').exists()).toBe(false)
		})

		it('applies active class to arrow when item is active', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = [0]
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			expect(wrapper.find('.px-collapse-item-arrow').classes()).toContain(
				'px-collapse-item-arrow__active'
			)
		})
	})

	describe('destroyOnHide', () => {
		it('removes content from DOM when collapsed and destroyOnHide is true (via provide)', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.destroyOnHide = ref(true)
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			// v-if="!(true && !displayContent)" -> v-if="false" -> element removed from DOM
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(false)
		})

		it('removes content from DOM when collapsed and destroyOnHide is true (via item prop)', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.destroyOnHide = ref(false)
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0, destroyOnHide: true },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			// computed: false || true = true -> v-if="false" -> element removed from DOM
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(false)
		})

		it('keeps content in DOM when collapsed and destroyOnHide is false', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.destroyOnHide = ref(false)
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			const contentWrapper = wrapper.find('.px-collapse-item-content-wrapper')
			// v-if="!(false && !displayContent)" -> v-if="true" -> element stays in DOM
			expect(contentWrapper.exists()).toBe(true)
			// v-show="false" -> hidden
			expect(contentWrapper.attributes('style')).toContain('display: none')
		})

		it('shows content when destroyOnHide is false and item becomes active', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.destroyOnHide = ref(false)
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(true)
			expect(wrapper.find('.px-collapse-item-content-wrapper').attributes('style')).toContain(
				'display: none'
			)

			mockProvide.activeIndices.value = [0]
			await nextTick()
			vi.advanceTimersByTime(200)
			await nextTick()

			const contentWrapper = wrapper.find('.px-collapse-item-content-wrapper')

			expect(contentWrapper.exists()).toBe(true)
			expect(contentWrapper.attributes('style')).not.toContain('display: none')
		})

		it('removes content from DOM after animation when destroyOnHide is true and item becomes inactive', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.destroyOnHide = ref(true)
			mockProvide.activeIndices.value = [0]
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()

			// Item starts active -> content is in DOM
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(true)

			// Deactivate
			mockProvide.activeIndices.value = []
			await nextTick()

			// After debounce (50ms), height is set to 0, but displayContent is still true
			vi.advanceTimersByTime(60)
			await nextTick()
			// displayContent still true at this point (waiting for animationDuration timeout)
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(true)

			// After animationDuration (250ms), displayContent becomes false
			vi.advanceTimersByTime(250)
			await nextTick()
			// Now v-if removes it from DOM
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(false)
		})

		it('item-level destroyOnHide=true adds to collapse-level false', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.destroyOnHide = ref(false)
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0, destroyOnHide: true },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			// computed: false || true = true -> v-if="false" -> element removed from DOM
			expect(wrapper.find('.px-collapse-item-content-wrapper').exists()).toBe(false)
		})
	})

	describe('header hover', () => {
		it('calls mouseenterHandler on header mouseenter', async () => {
			const { wrapper } = mountCollapseItem()
			await nextTick()
			const header = wrapper.find('.px-collapse-item-header')
			await header.trigger('mouseenter')
			// Should not throw, hover state is managed internally
		})

		it('calls mouseleaveHandler on header mouseleave', async () => {
			const { wrapper } = mountCollapseItem()
			await nextTick()
			const header = wrapper.find('.px-collapse-item-header')
			await header.trigger('mouseenter')
			await header.trigger('mouseleave')
		})
	})

	describe('content height animation', () => {
		it('sets content height when item becomes active', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = []
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()

			mockProvide.activeIndices.value = [0]
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			// The content height should be set on the .px-collapse-item-content element
			const content = wrapper.find('.px-collapse-item-content')
			expect(content.attributes('style')).toContain('height:')
		})

		it('resets content height to 0 when item becomes inactive', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = [0]
			const wrapper = mount(CollapseItem, {
				props: { index: 0, destroyOnHide: false },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			mockProvide.activeIndices.value = []
			await nextTick()
			vi.advanceTimersByTime(100)
			await nextTick()

			const content = wrapper.find('.px-collapse-item-content')
			expect(content.attributes('style')).toContain('height: 0px')
		})
	})

	describe('edge cases', () => {
		it('handles undefined collapseProvide gracefully', () => {
			const wrapper = mount(CollapseItem, {
				props: { index: 0 },
				global: { stubs }
			})
			expect(wrapper.find('.px-collapse-item').exists()).toBe(true)
			expect(wrapper.find('.px-collapse-item-header').exists()).toBe(true)
			// Without provide, clicking header should not throw
			const header = wrapper.find('.px-collapse-item-header')
			expect(() => header.trigger('click')).not.toThrow()
		})

		it('handles string index matching', async () => {
			const mockProvide = createMockCollapseProvide()
			mockProvide.activeIndices.value = ['panel-a']
			const wrapper = mount(CollapseItem, {
				props: { index: 'panel-a' },
				global: {
					stubs,
					provide: {
						[COLLAPSE_PROVIDE]: mockProvide
					}
				}
			})
			await nextTick()
			expect(wrapper.find('.px-collapse-item').classes()).toContain('px-collapse-item__active')
		})

		it('handles header slot without title prop', () => {
			const { wrapper } = mountCollapseItem(
				{},
				{},
				{
					title: '<span class="custom-title">Custom Header</span>'
				}
			)
			expect(wrapper.find('.custom-title').exists()).toBe(true)
			expect(wrapper.find('.custom-title').text()).toBe('Custom Header')
		})
	})
})
