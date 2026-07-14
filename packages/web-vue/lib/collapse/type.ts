import type { Ref } from 'vue'

export type CollapseProps = {
	/**
	 * @property {(string | number | symbol)[]} [active]
	 * @version 0.2.0
	 */
	active?: (string | number | symbol)[]
	/**
	 * @property {(string | number | symbol)[]} [defaultActive]
	 * @version 0.2.0
	 */
	defaultActive?: (string | number | symbol)[]
	/**
	 * @property {'none' | 'card' | 'line'} [variant='card']
	 * @version 0.2.0
	 */
	variant?: 'none' | 'card' | 'line'
	/**
	 * @property {boolean} [accordion=false]
	 * @version 0.2.0
	 */
	accordion?: boolean
	/**
	 * @property {boolean} [showExpandIcon=true]
	 * @version 0.2.0
	 */
	showExpandIcon?: boolean
	/**
	 * @property {'left' | 'right'} [expandIconPlacement='left']
	 * @version 0.2.0
	 */
	expandIconPlacement?: 'left' | 'right'
	/**
	 * @property {number} [animationDuration=250]
	 * @version 0.2.0
	 */
	animationDuration?: number
	/**
	 * @property {boolean} [destroyOnHide=false]
	 * @version 0.2.0
	 */
	destroyOnHide?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.0
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
}

export type CollapseEvents = {
	/**
	 * @event update:active
	 * @version 0.2.0
	 * @param {(string | number | symbol)[]} activeIndices
	 */
	'update:active': [activeIndices: (string | number | symbol)[]]
	/**
	 * @event change
	 * @version 0.2.0
	 * @param {(string | number | symbol)[]} activeIndices
	 */
	change: [activeIndices: (string | number | symbol)[]]
}

export type CollapseSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
}

export type CollapseProvide = {
	activeIndices: Ref<undefined | null | (string | number | symbol)[]>
	accordion: Ref<boolean>
	toggle: (index: string | number | symbol) => void
	animationDuration: Ref<number>
	showExpandIcon: Ref<boolean>
	expandIconPlacement: Ref<CollapseProps['expandIconPlacement']>
	pollSizeChange: Ref<boolean>
	destroyOnHide: Ref<boolean>
	disabled: Ref<boolean>
	variant: Ref<CollapseProps['variant']>
}
