import type { ComputedRef, Ref } from 'vue'

export type TabProps = {
	/**
	 * @property {number | string | symbol | null} [active]
	 * @version 0.2.0
	 */
	active?: number | string | symbol | null
	/**
	 * @property {number | string | symbol | null} [defaultActive]
	 * @version 0.2.0
	 */
	defaultActive?: number | string | symbol | null
	/**
	 * @property {'line' | 'card'} [variant='line']
	 * @version 0.2.0
	 */
	variant?: 'line' | 'card'
	/**
	 * @property {boolean} [creatable=false]
	 * @version 0.2.0
	 */
	creatable?: boolean
	/**
	 * @property {'top' | 'bottom' | 'left' | 'right'} [placement='top']
	 * @version 0.2.0
	 */
	placement?: 'top' | 'bottom' | 'left' | 'right'
	/**
	 * @property {'start' | 'center' | 'end'} [justify='start']
	 * @version 0.2.0
	 */
	justify?: 'start' | 'center' | 'end'
	/**
	 * @ignore
	 * @version 0.2.0
	 */
	onCreate?: (e: MouseEvent) => any
	/**
	 * @property {number | string} [tabMinWidth=60]
	 * @version 0.2.0
	 */
	tabMinWidth?: number | string
	/**
	 * @property {number | string} [tabMaxWidth=160]
	 * @version 0.2.0
	 */
	tabMaxWidth?: number | string
	/**
	 * @property {boolean} [pollSizeChange=false]
	 * @version 0.2.0
	 */
	pollSizeChange?: boolean
}

export type TabEvents = {
	/**
	 * @event update:active
	 * @param {number | string | symbol} value
	 * @version 0.2.0
	 */
	'update:active': [value: number | string | symbol]
	/**
	 * @event select
	 * @param {number | string | symbol} index
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	select: [index: number | string | symbol, event: MouseEvent]
	/**
	 * @event close
	 * @param {number | string | symbol} index
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	close: [index: number | string | symbol, event: MouseEvent]
	/**
	 * @event create
	 * @param {MouseEvent} event
	 * @version 0.2.0
	 */
	create: [event: MouseEvent]
}

export type TabSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
	/**
	 * @slot prefix
	 * @version 0.2.0
	 */
	prefix: {}
	/**
	 * @slot suffix
	 * @version 0.2.0
	 */
	suffix: {}
}

export type TabProvide = {
	active: Ref<number | string | symbol | null | undefined>
	variant: Ref<TabProps['variant']>
	closeHandler: (index: string | number | symbol, event: MouseEvent) => void
	selectHandler: (key: string | number | symbol, event: MouseEvent) => Promise<void>
	hasPrefix: ComputedRef<boolean>
	hasSuffix: ComputedRef<boolean>
	justify: Ref<TabProps['justify']>
	creatable: Ref<TabProps['creatable']>
	placement: Ref<TabProps['placement']>
	tabMaxWidth: ComputedRef<string>
	tabMinWidth: ComputedRef<string>
	isHorizontal: ComputedRef<boolean>
	pollSizeChange: Ref<TabProps['pollSizeChange']>
	lastTab: Ref<boolean>
}
