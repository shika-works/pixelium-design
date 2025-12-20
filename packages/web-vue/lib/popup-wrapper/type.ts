export type PopupWrapperProps = {
	visible?: boolean | null
	defaultVisible?: boolean | null
	zIndex?: number
	closeDelay?: number
	position?: 'absolute' | 'fixed'
	destroyOnHide?: boolean
}
