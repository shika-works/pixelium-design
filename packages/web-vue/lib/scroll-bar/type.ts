export type ScrollProps = {
	scrollOffset?: { left?: number; top?: number } | null
	defaultScrollOffset?: { left?: number; top?: number } | null
}

export type ScrollEvents = {
	'update:scrollOffset': [value: { left: number; top: number }]
	initialize: []
	update: []
	scroll: [event: Event]
}

export type ScrollExpose = {
	scrollTo: {
		(options?: ScrollToOptions): void
		(x: number, y: number): void
	}
	scrollBy: {
		(options?: ScrollToOptions): void
		(x: number, y: number): void
	}
}
