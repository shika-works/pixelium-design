import { describe, it, expect, vi } from 'vitest'
import { getGlobalThemeColor } from '../../share/util/color'
import { calcDefaultBackgroundColor } from '../../mask/draw'

describe('mask default background must not corrupt the theme cache', () => {
	it('keeps neutral-8 opaque after the mask computes its background', () => {
		vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			getPropertyValue: (n: string) =>
				String(n).includes('neutral-8') ? 'rgba(150, 150, 150, 1)' : ''
		} as unknown as CSSStyleDeclaration)

		const before = getGlobalThemeColor('neutral', 8)
		const bg = calcDefaultBackgroundColor()
		const after = getGlobalThemeColor('neutral', 8)

		expect(before?.a).toBe(255)
		expect(after?.a).toBe(255) // would be 127 before the fix
		expect(bg).toContain('0.498')
	})
})
