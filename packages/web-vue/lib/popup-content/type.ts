import type { CSSProperties, VNode } from 'vue'

export type PopupContentProps = {
	content?: string
	visible?: boolean | null
	defaultVisible?: boolean | null
	placement?:
		| 'top'
		| 'right'
		| 'bottom'
		| 'left'
		| 'top-start'
		| 'top-end'
		| 'right-start'
		| 'right-end'
		| 'bottom-start'
		| 'bottom-end'
		| 'left-start'
		| 'left-end'
	offset?: number
	variant?: 'dark' | 'light'
	arrow?: boolean
	zIndex?: number
	target?: HTMLElement | VNode | null
	root?: HTMLElement | string
	borderRadius?: number
	widthEqual?: boolean
	contentStyle?: CSSProperties
}

export type PopupContentEvents = {
	contentMouseenter: [e: MouseEvent]
	contentMouseleave: [e: MouseEvent]
}
