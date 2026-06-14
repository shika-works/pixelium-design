import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { createMocks } from '../../share/util/test'

import TabPanel from '../index.vue'
import { TAB_PROVIDE } from '../../share/const/provide-key'
import type { TabProvide } from '../../tab/type'

const { pre, post } = createMocks()

function createMockTabProvide(overrides: Partial<TabProvide> = {}): TabProvide {
	const active = ref<number | string | symbol | null | undefined>(null)
	const variant = ref<'line' | 'card'>('line')
	const closeHandler = () => {}
	const selectHandler = () => Promise.resolve()
	const hasPrefix = ref(false)
	const hasSuffix = ref(false)
	const justify = ref<'start' | 'center' | 'end'>('start')
	const creatable = ref(false)
	const placement = ref<'top' | 'bottom' | 'left' | 'right'>('top')
	const tabMaxWidth = ref('none')
	const isHorizontal = ref(true)
	const pollSizeChange = ref(false)
	const tabMinWidth = ref('none')
	const lastTab = ref('none')

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

describe('TabPanel', () => {
	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	describe('Rendering', () => {
		it('renders slot content when active', () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				slots: {
					default: () => 'Panel Content'
				},
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.text()).toBe('Panel Content')
		})

		it('has role="tabpanel"', () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('role')).toBe('tabpanel')
		})

		it('applies placement class from provide', () => {
			const provide = createMockTabProvide()
			provide.active.value = 1
			provide.placement.value = 'left'

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.classes()).toContain('px-tab-panel__left')
		})
	})

	describe('Visibility', () => {
		it('is visible when active matches index', () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('style')).toBeFalsy()
		})

		it('is hidden when active does not match index', () => {
			const provide = createMockTabProvide()
			provide.active.value = 2

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('style')).toBe('display: none;')
		})

		it('reactively shows/hides when active changes', async () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				slots: {
					default: () => 'Content'
				},
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('style')).toBeFalsy()
			expect(wrapper.text()).toBe('Content')

			provide.active.value = 2
			await nextTick()

			expect(wrapper.attributes('style')).toBe('display: none;')
		})

		it('reactively shows when switching back to its index', async () => {
			const provide = createMockTabProvide()
			provide.active.value = 2

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('style')).toBe('display: none;')

			provide.active.value = 1
			await nextTick()

			expect(wrapper.attributes('style')).toBeFalsy()
		})
	})

	describe('Aria', () => {
		it('sets aria-hidden to true when not active', () => {
			const provide = createMockTabProvide()
			provide.active.value = 2

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('aria-hidden')).toBe('true')
		})

		it('sets aria-hidden to false when active', () => {
			const provide = createMockTabProvide()
			provide.active.value = 1

			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				global: {
					provide: {
						[TAB_PROVIDE]: provide
					}
				}
			})

			expect(wrapper.attributes('aria-hidden')).toBe('false')
		})
	})

	describe('Without Provide', () => {
		it('is hidden when no tab provide is available', () => {
			const wrapper = mount(TabPanel, {
				props: { index: 1 },
				slots: {
					default: () => 'Content'
				}
			})

			expect(wrapper.attributes('style')).toBe('display: none;')
		})
	})
})
