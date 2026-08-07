export type CarouselProps = {
	/**
	 * @property {boolean} [autoFill=false]
	 * @version 0.2.0
	 */
	autoFill?: boolean
	/**
	 * @property {number} [speed=50]
	 * @version 0.2.0
	 */
	speed?: number
}

export type CarouselSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
}

export type CarouselExpose = {
	/**
	 * @property {() => void} resume
	 * @version 0.2.0
	 */
	resume: () => void
	/**
	 * @property {() => void} pause
	 * @version 0.2.0
	 */
	pause: () => void
	/**
	 * @property {() => void} reset
	 * @version 0.2.0
	 */
	reset: () => void
	/**
	 * @property {() => void} measure
	 * @version 0.2.0
	 */
	measure: () => void
}
