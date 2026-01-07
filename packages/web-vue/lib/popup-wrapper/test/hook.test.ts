import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {
	usePopupWrapperManager,
	cleanState,
	popupWrapperManager
} from '../use-popup-wrapper-manager.ts'
import { toRaw } from 'vue'

const TestComponent = {
	props: {
		info: Object
	},
	setup(props: any) {
		const [activate, hide] = usePopupWrapperManager(props.info)
		activate()
		return { activate, hide }
	},
	template: '<div>Test Component</div>'
}

describe('usePopupWrapperManager', () => {
	beforeEach(() => {
		cleanState()
	})

	it('should add popup info to activeWrapper when activated', () => {
		const mockInfo = {
			id: 'test-id',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => false,
			getZIndex: () => 1000
		}

		const wrapper = mount(TestComponent, {
			props: { info: mockInfo }
		})

		expect(toRaw(popupWrapperManager.sortedPopups[0])).toBe(mockInfo)
		wrapper.unmount()
	})

	it('should prevent document scroll when needed', () => {
		const mockInfo = {
			id: 'test-id',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => true,
			getZIndex: () => 1000
		}

		const wrapper = mount(TestComponent, {
			props: { info: mockInfo }
		})

		expect(document.documentElement.style.overflow).toBe('hidden')
		wrapper.unmount()
	})

	it('should maintain correct z-index order', () => {
		const info1 = {
			id: 'id1',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => false,
			getZIndex: () => 1000
		}
		const info2 = {
			id: 'id2',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => false,
			getZIndex: () => 2000
		}
		const info3 = {
			id: 'id3',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => false,
			getZIndex: () => 1500
		}

		const wrapper1 = mount(TestComponent, { props: { info: info1 } })
		const wrapper2 = mount(TestComponent, { props: { info: info2 } })
		const wrapper3 = mount(TestComponent, { props: { info: info3 } })

		expect(toRaw(popupWrapperManager.sortedPopups[0])).toBe(info1)
		expect(toRaw(popupWrapperManager.sortedPopups[1])).toBe(info3)
		expect(toRaw(popupWrapperManager.sortedPopups[2])).toBe(info2)

		wrapper1.unmount()
		wrapper2.unmount()
		wrapper3.unmount()
	})

	it('should remove popup from activeWrapper on unmount', () => {
		const mockInfo = {
			id: 'test-id',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => false,
			getZIndex: () => 1000
		}

		const wrapper = mount(TestComponent, {
			props: { info: mockInfo }
		})

		expect(toRaw(popupWrapperManager.sortedPopups[0])).toBe(mockInfo)
		wrapper.unmount()
		expect(popupWrapperManager.sortedPopups.length).toBe(0)
	})

	it('should restore document scroll when last popup is hidden', () => {
		const mockInfo = {
			id: 'test-id',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => true,
			getZIndex: () => 1000
		}

		const wrapper = mount(TestComponent, {
			props: { info: mockInfo }
		})

		expect(document.documentElement.style.overflow).toBe('hidden')
		wrapper.unmount()
		expect(document.documentElement.style.overflow).toBe('auto')
	})

	it('should keep scroll locked if other popups still need prevention', () => {
		const info1 = {
			id: 'id1',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => true,
			getZIndex: () => 1000
		}
		const info2 = {
			id: 'id2',
			escKeydownHandler: () => {},
			needPreventDocumentScroll: () => true,
			getZIndex: () => 2000
		}

		const wrapper1 = mount(TestComponent, { props: { info: info1 } })
		const wrapper2 = mount(TestComponent, { props: { info: info2 } })

		expect(document.documentElement.style.overflow).toBe('hidden')

		wrapper1.unmount()
		expect(document.documentElement.style.overflow).toBe('hidden')

		wrapper2.unmount()
		expect(document.documentElement.style.overflow).toBe('auto')
	})

	it('should call escKeydownHandler of topmost popup on ESC press', () => {
		const handler1 = vi.fn()
		const handler2 = vi.fn()

		const info1 = {
			id: 'id1',
			escKeydownHandler: handler1,
			needPreventDocumentScroll: () => false,
			getZIndex: () => 1000
		}
		const info2 = {
			id: 'id2',
			escKeydownHandler: handler2,
			needPreventDocumentScroll: () => false,
			getZIndex: () => 2000
		}

		const wrapper1 = mount(TestComponent, { props: { info: info1 } })
		const wrapper2 = mount(TestComponent, { props: { info: info2 } })

		const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
		window.dispatchEvent(escapeEvent)

		expect(handler2).toHaveBeenCalledWith(escapeEvent)
		expect(handler1).not.toHaveBeenCalled()

		wrapper1.unmount()
		wrapper2.unmount()
	})
})
