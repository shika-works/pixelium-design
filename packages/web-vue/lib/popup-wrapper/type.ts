export type PopupWrapperProps = {
	visible?: boolean | null
	defaultVisible?: boolean | null
	zIndex?: number
	root?: HTMLElement | string
	closeDelay?: number
	position?: 'absolute' | 'fixed'
	destroyOnHide?: boolean
}
