import { isNullish } from 'parsnip-kit'
import { ref } from 'vue'

// simulating CSS transition timing function cubic-bezier(0.25, 0.1, 0.25, 1.0)
function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
	const calcBezier = (t: number, a1: number, a2: number): number => {
		return 3 * a1 * t * (1 - t) ** 2 + 3 * a2 * t ** 2 * (1 - t) + t ** 3
	}

	const getTForX = (x: number): number => {
		let low = 0,
			high = 1
		let tMid = x

		for (let i = 0; i < 8; i++) {
			const xMid = calcBezier(tMid, x1, x2)
			if (Math.abs(x - xMid) < 1e-6) return tMid
			if (x < xMid) high = tMid
			else low = tMid
			tMid = (low + high) / 2
		}

		return tMid
	}

	const tPrime = getTForX(t)
	return calcBezier(tPrime, y1, y2)
}

const ease = (t: number) => cubicBezier(t, 0.25, 0.1, 0.25, 1.0)

export type TransitionDirection = 'forward' | 'backward'

export function useSmoothTransition(duration = 250, initialValue: number = 0) {
	const clampedInitial = Math.max(0, Math.min(1, initialValue))
	const value = ref(clampedInitial)
	const isPlaying = ref(false)

	let animationFrameId: number | null = null
	let startTime: number | null = null
	let startValue: number | null = null
	let targetValue: number | null = null

	const pause = () => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}
		isPlaying.value = false
	}

	const update = (timestamp: number) => {
		if (!startTime || isNullish(startValue) || isNullish(targetValue) || !duration) return

		const elapsed = timestamp - startTime
		const progress = Math.min(elapsed / duration, 1)
		const easedProgress = ease(progress)

		value.value = startValue + (targetValue - startValue) * easedProgress

		if (progress < 1) {
			animationFrameId = requestAnimationFrame(update)
		} else {
			pause()
			value.value = targetValue
		}
	}

	const play = (direction: TransitionDirection, newDuration: number = duration) => {
		if (newDuration <= 0) {
			return
		}

		if (isPlaying.value && animationFrameId) {
			cancelAnimationFrame(animationFrameId)
		}

		isPlaying.value = true
		startTime = performance.now()
		startValue = value.value
		targetValue = direction === 'forward' ? 1 : 0
		duration = newDuration

		animationFrameId = requestAnimationFrame(update)
	}

	return [value, play, pause, isPlaying] as const
}
