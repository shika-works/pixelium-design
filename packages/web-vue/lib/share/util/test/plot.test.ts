import { describe, expect, it } from 'vitest'
import type { ShallowRef } from 'vue'
import { canvasPreprocess } from '../plot'

describe('canvasPreprocess', () => {
	const createRefs = (
		rectWidth: number,
		rectHeight: number,
		layoutWidth: number,
		layoutHeight: number
	) => {
		const ctx = { imageSmoothingEnabled: false, clearRect: () => {} }
		const canvas = { width: 0, height: 0, getContext: () => ctx }
		const wrapper = {
			getBoundingClientRect: () => ({ width: rectWidth, height: rectHeight }),
			offsetWidth: layoutWidth,
			offsetHeight: layoutHeight
		}
		return {
			canvasRef: { value: canvas } as unknown as ShallowRef<HTMLCanvasElement | null>,
			wrapperRef: { value: wrapper } as unknown as ShallowRef<HTMLElement | null>
		}
	}

	it('sizes the canvas from the layout box when an ancestor transform is present', () => {
		// a dialog animating in with transform: scale(0.2)
		const refs = createRefs(19.2, 12.8, 96, 64)
		const data = canvasPreprocess(refs.wrapperRef, refs.canvasRef)
		expect(data?.width).toBe(96)
		expect(data?.height).toBe(64)
	})

	it('keeps using the fractional rect when nothing is transformed', () => {
		// offsetWidth is rounded, but the difference stays within the tolerance
		const refs = createRefs(96.6, 64.6, 97, 65)
		const data = canvasPreprocess(refs.wrapperRef, refs.canvasRef)
		expect(data?.width).toBe(96)
		expect(data?.height).toBe(64)
	})
})
