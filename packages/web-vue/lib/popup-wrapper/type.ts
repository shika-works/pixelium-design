export type PopupWrapperProps = {
	visible?: boolean | null
	zIndex?: number
	closeDelay?: number
	position?: 'absolute' | 'fixed'
	destroyOnHide?: boolean
	preventDocumentScroll?: boolean
	escToClose?: boolean
}

export type PopupWrapperEvents = {
	escKeydown: [event: KeyboardEvent]
}
