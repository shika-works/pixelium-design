export type CountToProps = {
	/**
	 * @property {number} to
	 * @version 0.2.0
	 */
	to: number
	/**
	 * @property {number} [from]
	 * @version 0.2.0
	 */
	from?: number
	/**
	 * @property {number} [duration=1000]
	 * @version 0.2.0
	 */
	duration?: number
	/**
	 * @property {number} [precision=0]
	 * @version 0.2.0
	 */
	precision?: number
	/**
	 * @property {number} [startDelay=0]
	 * @version 0.2.0
	 */
	startDelay?: number
	/**
	 * @property {boolean} [autoplay=true]
	 * @version 0.2.0
	 */
	autoplay?: boolean
	/**
	 * @property {boolean} [separator=false]
	 * @version 0.2.0
	 */
	separator?: boolean
	/**
	 * @property {(value: number) => string} [formatter]
	 * @version 0.2.0
	 */
	formatter?: (value: number) => string
}

export type CountToEvents = {
	/**
	 * @event start
	 * @version 0.2.0
	 */
	start: []
	/**
	 * @event end
	 * @version 0.2.0
	 */
	end: []
}

export type CountToSlots = {
	/**
	 * @slot default
	 * @param {string} text
	 * @param {number} value
	 * @version 0.2.0
	 */
	default: {
		text: string
		value: number
	}
}

export type CountToExpose = {
	/**
	 * @property {() => void} start
	 * @version 0.2.0
	 */
	start: () => void
	/**
	 * @property {() => void} pause
	 * @version 0.2.0
	 */
	pause: () => void
	/**
	 * @property {() => void} resume
	 * @version 0.2.0
	 */
	resume: () => void
	/**
	 * @property {() => void} reset
	 * @version 0.2.0
	 */
	reset: () => void
}