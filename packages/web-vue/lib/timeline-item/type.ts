export type TimelineItemProps = {
	/**
	 * @property {string} [color]
	 * @version 0.2.0
	 */
	color?: string
	/**
	 * @property {string} [content]
	 * @version 0.2.0
	 */
	content?: string
	/**
	 * @property {string} [footer]
	 * @version 0.2.0
	 */
	footer?: string
	/**
	 * @property {'solid' | 'dashed'} [lineVariant='solid']
	 * @version 0.2.0
	 */
	lineVariant?: 'solid' | 'dashed'
	/**
	 * @property {string} [mark]
	 * @version 0.2.0
	 */
	mark?: string
	/**
	 * @property {string} [title]
	 * @version 0.2.0
	 */
	title?: string
	/**
	 * @property {'primary' | 'notice' | 'success' | 'info' | 'warning' | 'danger' | 'sakura'} [theme='primary']
	 * @version 0.2.0
	 */
	theme?: 'primary' | 'notice' | 'success' | 'info' | 'warning' | 'danger' | 'sakura'
}

export type TimelineItemSlots = {
	/**
	 * @slot default
	 * @version 0.2.0
	 */
	default: {}
	/**
	 * @slot icon
	 * @version 0.2.0
	 */
	icon: {}
	/**
	 * @slot mark
	 * @version 0.2.0
	 */
	mark: {}
	/**
	 * @slot footer
	 * @version 0.2.0
	 */
	footer: {}
	/**
	 * @slot header
	 * @version 0.2.0
	 */
	header: {}
}
