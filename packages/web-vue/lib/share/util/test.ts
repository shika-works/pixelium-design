import { vi } from 'vitest'

export function createMocks() {
	let originalMatchMedia: any
	let originalResizeObserver: any

	const pre = () => {
		originalMatchMedia = window.matchMedia
		originalResizeObserver = window.ResizeObserver

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
	}

	const post = () => {
		window.matchMedia = originalMatchMedia
		window.ResizeObserver = originalResizeObserver
		vi.clearAllMocks()
	}

	return { pre, post }
}
