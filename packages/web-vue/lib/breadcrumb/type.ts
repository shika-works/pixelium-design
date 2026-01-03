import type { Ref } from 'vue'
import type { NavigationOption } from '../share/type'

export interface BreadcrumbOption extends NavigationOption {
	disabled?: boolean
	clickable?: boolean
	href?: string
	route?: string | object
	target?: string
}

export type BreadcrumbProps = {
	/**
	 * @property {(string | BreadcrumbOption)[]} [options]
	 * @version 0.1.0
	 */
	options?: (string | BreadcrumbOption)[]
	/**
	 * @property {string} [splitter='>']
	 * @version 0.1.0
	 */
	splitter?: string
	/**
	 * @property {boolean} [renderLastText=true]
	 * @version 0.1.0
	 */
	renderLastText?: boolean
}

export type BreadcrumbEvents = {
	/**
	 * @event select
	 * @version 0.1.0
	 * @param {string | number | symbol} index
	 * @param {MouseEvent} event
	 */
	select: [index: string | number | symbol, event: MouseEvent]
}

export type BreadcrumbSlots = {
	/**
	 * @slot default
	 * @version 0.1.0
	 */
	default: {}
	/**
	 * @slot splitter
	 * @version 0.1.0
	 */
	splitter: {}
}

export type BreadcrumbProvide = {
	select: (index: string | number | symbol, e: MouseEvent) => void
	renderLastText: Ref<boolean>
	id: string
}
