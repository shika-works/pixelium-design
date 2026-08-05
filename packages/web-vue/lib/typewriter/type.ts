export type TypewriterText =
	| {
			type: 'type'
			text: string
	  }
	| {
			type: 'backspace'
			count: number
	  }
	| {
			type: 'delay'
			ms: number
	  }
	| {
			type: 'clear'
	  }
	| {
			type: 'setTypeColor'
			color: string
	  }
	| {
			type: 'setTypeClass'
			class: string
	  }

export type TypewriterProps = {
	/**
	 * @property {TypewriterText[]} [text=[]]
	 * @version 0.2.0
	 */
	text?: TypewriterText[]
	/**
	 * @property {number} [typeSpeed=80]
	 * @version 0.2.0
	 */
	typeSpeed?: number
	/**
	 * @property {number} [deleteSpeed=40]
	 * @version 0.2.0
	 */
	deleteSpeed?: number
	/**
	 * @property {number} [startDelay=0]
	 * @version 0.2.0
	 */
	startDelay?: number
	/**
	 * @property {boolean} [loop=false]
	 * @version 0.2.0
	 */
	loop?: boolean
	/**
	 * @property {boolean} [start=true]
	 * @version 0.2.0
	 */
	start?: boolean
	/**
	 * @property {boolean} [pause=false]
	 * @version 0.2.0
	 */
	pause?: boolean
	/**
	 * @property {boolean} [caret=true]
	 * @version 0.2.0
	 */
	caret?: boolean
	/**
	 * @property {string} [caretText='|']
	 * @version 0.2.0
	 */
	caretText?: string
	/**
	 * @property {number} [blinkSpeed=500]
	 * @version 0.2.0
	 */
	blinkSpeed?: number
}

export type TypewriterEvents = {
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
	/**
	 * @event textChange
	 * @param {string} text
	 * @version 0.2.0
	 */
	textChange: [text: string]
	/**
	 * @event indexChange
	 * @param {number} index
	 * @version 0.2.0
	 */
	indexChange: [index: number]
}

export type TypewriterSlots = {
	/**
	 * @slot default
	 * @param {string} text
	 * @version 0.2.0
	 */
	default: {
		text: string
	}
	/**
	 * @slot caret
	 * @param {boolean} visible
	 * @version 0.2.0
	 */
	caret: {
		visible: boolean
	}
}

export type TypewriterExpose = {
	/**
	 * @property {() => void} start
	 * @version 0.2.0
	 */
	start: () => void
	/**
	 * @property {() => void} stop
	 * @version 0.2.0
	 */
	stop: () => void
	/**
	 * @property {() => void} reset
	 * @version 0.2.0
	 */
	reset: () => void
}
