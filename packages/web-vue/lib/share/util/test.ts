import { vi } from 'vitest'

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
