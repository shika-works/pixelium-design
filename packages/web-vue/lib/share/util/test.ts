import { vi } from 'vitest'

const isFocusableElement = (element: HTMLElement) => {
	const tagName = element.tagName
	return (
		element.tabIndex >= 0 ||
		element.contentEditable === 'true' ||
		['A', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(tagName)
	)
}

export function createMocks() {
	let originalMatchMedia: any
	let originalResizeObserver: any
	let originalIntersectionObserver: any

	const pre = () => {
		originalMatchMedia = window.matchMedia
		originalResizeObserver = window.ResizeObserver
		originalIntersectionObserver = window.IntersectionObserver

		window.matchMedia = vi.fn().mockImplementation(() => ({
			matches: false,
			removeEventListener: vi.fn(),
			addEventListener: vi.fn()
		}))

		window.ResizeObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		}))

		window.IntersectionObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		}))
	}

	const post = () => {
		window.matchMedia = originalMatchMedia
		window.ResizeObserver = originalResizeObserver
		window.IntersectionObserver = originalIntersectionObserver
		vi.clearAllMocks()
	}

	return { pre, post }
}

export function createMocks4Focus() {
	let originalFocus: any
	let originalBlur: any
	let originalDispatchEvent: any

	const pre = () => {
		originalFocus = HTMLElement.prototype.focus
		originalBlur = HTMLElement.prototype.blur
		originalDispatchEvent = HTMLElement.prototype.dispatchEvent

		window.matchMedia = vi.fn().mockImplementation(() => ({
			matches: false,
			removeEventListener: vi.fn(),
			addEventListener: vi.fn()
		}))

		window.ResizeObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		}))

		window.IntersectionObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		}))

		let activeElementMock = null as Element | null

		Object.defineProperty(document, 'activeElement', {
			configurable: true,
			get() {
				return activeElementMock
			}
		})

		// In Vitest, after mounting with attachTo, native el.focus() and el.blur() trigger focusin/focusout events,
		// whereas el.dispatchEvent for focus/blur still does not.

		HTMLElement.prototype.focus = function () {
			if (isFocusableElement(this)) {
				const activeElement = activeElementMock as HTMLElement | null
				if (activeElement !== this) {
					activeElement?.blur()
					activeElementMock = this
				}
			}
			originalFocus.call(this)
		}
		HTMLElement.prototype.blur = function () {
			activeElementMock = null
			originalBlur.call(this)
		}
		HTMLElement.prototype.dispatchEvent = function (event: Event) {
			const result = originalDispatchEvent.call(this, event)
			if (event.type === 'focus') {
				if (isFocusableElement(this)) {
					const activeElement = activeElementMock as HTMLElement | null
					if (activeElement !== this) {
						activeElement?.blur()
						activeElementMock = this
					}
				}
				originalDispatchEvent.call(this, new FocusEvent('focusin', { bubbles: true }))
			}
			if (event.type === 'blur') {
				activeElementMock = null
				originalDispatchEvent.call(this, new FocusEvent('focusout', { bubbles: true }))
			}

			if (event.type === 'mousedown') {
				const activeElement = activeElementMock as HTMLElement | null
				if (activeElement !== this) {
					activeElement?.blur()
				}
			}
			return result
		}
	}

	const post = () => {
		try {
			HTMLElement.prototype.focus = originalFocus
			HTMLElement.prototype.blur = originalBlur
			HTMLElement.prototype.dispatchEvent = originalDispatchEvent
			// @ts-ignore
			delete document.activeElement
		} catch (error) {
			console.log(error);
		}
		vi.clearAllMocks()
	}

	return { pre, post }
}