import { mergeSkipNullish } from 'parsnip-kit'
import { createError } from './console'

export function checkIntersection(target: HTMLElement, root?: HTMLElement) {
	const targetComputedStyle = window.getComputedStyle(target)
	if (targetComputedStyle.display === 'none') {
		return { hasIntersection: false, x: Infinity, y: Infinity }
	}

	let isViewport = false

	if (!root) {
		isViewport = true
	}

	const rootRect = isViewport
		? {
				left: 0,
				top: 0,
				right: window.innerWidth,
				bottom: window.innerHeight
			}
		: root!.getBoundingClientRect()

	const targetRect = target.getBoundingClientRect()

	const hasXIntersection =
		targetRect.left <= rootRect.right && targetRect.right >= rootRect.left
	const hasYIntersection =
		targetRect.top <= rootRect.bottom && targetRect.bottom >= rootRect.top
	const hasIntersection = hasXIntersection && hasYIntersection

	let xDistance: number
	if (hasXIntersection) {
		xDistance = 0
	} else if (targetRect.right < rootRect.left) {
		xDistance = rootRect.left - targetRect.right
	} else {
		xDistance = targetRect.left - rootRect.right
	}

	let yDistance: number
	if (hasYIntersection) {
		yDistance = 0
	} else if (targetRect.bottom < rootRect.top) {
		yDistance = rootRect.top - targetRect.bottom
	} else {
		yDistance = targetRect.top - rootRect.bottom
	}

	xDistance = Math.max(0, xDistance)
	yDistance = Math.max(0, yDistance)

	return { hasIntersection, x: xDistance, y: yDistance }
}

interface ZoomOptions {
	maxWidth?: number
	maxHeight?: number
	margin?: number
}

export function calculateZoomedSize(originalImg: HTMLImageElement, options?: ZoomOptions) {
	const currentOptions = mergeSkipNullish(options, {
		margin: 32,
		maxWidth: Infinity,
		maxHeight: Infinity
	})

	const viewportWidth = window.innerWidth
	const viewportHeight = window.innerHeight
	const finalViewportWidth = Math.min(
		viewportWidth - currentOptions.margin * 2,
		currentOptions.maxWidth
	)
	const finalViewportHeight = Math.min(
		viewportHeight - currentOptions.margin * 2,
		currentOptions.maxHeight
	)

	if (!originalImg.complete) {
		return {
			width: 0,
			height: 0,
			left: finalViewportWidth / 2,
			top: finalViewportHeight / 2
		}
	}

	const naturalWidth = originalImg.naturalWidth || finalViewportWidth
	const naturalHeight = originalImg.naturalHeight || finalViewportHeight

	const originalWidth = originalImg.naturalWidth
	const originalHeight = originalImg.naturalHeight
	const aspectRatio = originalWidth / originalHeight
	const scaleX = Math.min(naturalWidth, finalViewportWidth) / naturalWidth
	const scaleY = Math.min(naturalHeight, finalViewportHeight) / naturalHeight

	const scale = Math.min(scaleX, scaleY)
	const finalHeight = scale * naturalHeight
	const finalWidth = finalHeight * aspectRatio

	const left = finalViewportWidth / 2 - finalWidth / 2 + currentOptions.margin
	const top = finalViewportHeight / 2 - finalHeight / 2 + currentOptions.margin

	return { width: finalWidth, height: finalHeight, left, top }
}

export const checkMouseInsideElementFromEvent = (
	el: HTMLElement | SVGElement,
	e: MouseEvent | TouchEvent
) => {
	const rect = el.getBoundingClientRect()
	let clientX: number, clientY: number
	if (e instanceof MouseEvent) {
		clientX = (e as MouseEvent).clientX
		clientY = (e as MouseEvent).clientY
	} else {
		clientX = (e as TouchEvent).touches[0].clientX
		clientY = (e as TouchEvent).touches[0].clientY
	}
	return (
		clientX >= rect.left &&
		clientX <= rect.right &&
		clientY >= rect.top &&
		clientY <= rect.bottom
	)
}

export function imageDataToDataURL(imageData: ImageData): string {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	if (!ctx) {
		throw createError('Cannot get Canvas context')
	}

	canvas.width = imageData.width
	canvas.height = imageData.height
	ctx.putImageData(imageData, 0, 0)

	return canvas.toDataURL('image/png')
}
