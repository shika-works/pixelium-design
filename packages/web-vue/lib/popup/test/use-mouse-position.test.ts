import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useMousePosition } from '../use-mouse-position'

const Consumer = defineComponent({
	setup() {
		const [x, y] = useMousePosition()
		return { x, y }
	},
	template: '<div />'
})

describe('useMousePosition (shared)', () => {
	it('registers only one global listener for multiple consumers', async () => {
		const addSpy = vi.spyOn(window, 'addEventListener')
		const removeSpy = vi.spyOn(window, 'removeEventListener')

		const a = mount(Consumer)
		expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))

		const b = mount(Consumer)
		expect(addSpy).toHaveBeenCalledTimes(1)

		b.unmount()
		expect(removeSpy).not.toHaveBeenCalled()

		a.unmount()
		expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))

		addSpy.mockRestore()
		removeSpy.mockRestore()
	})
})
