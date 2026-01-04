import type { ValidContent } from '../share/type'

export type VirtualListProps = {
	/**
	 * @property {{ render: ValidContent; key?: string | number | symbol }[]} [list]
	 * @version 0.0.3
	 */
	list?: { render: ValidContent; key?: string | number | symbol }[]
	/**
	 * @property {boolean} [fixedHeight=false]
	 * @version 0.0.3
	 */
	fixedHeight?: boolean
	/**
	 * @property {number} [estimatedHeight=28]
	 * @version 0.0.3
	 */
	estimatedHeight?: number
	/**
	 * @property {number} [buffer=10]
	 * @version 0.0.3
	 */
	buffer?: number
}

export type VirtualListSlots = {
	/**
	 * @slot scroll-container
	 * @param {JSX.Element} children
	 * @param {(event: Event) => void} onScroll
	 * @version 0.1.0
	 */
	'scroll-container': {}
}
