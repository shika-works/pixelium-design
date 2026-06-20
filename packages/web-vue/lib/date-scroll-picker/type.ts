export type DateScrollPickerProps = {
	mode: 'month' | 'year' | 'quarter' | 'time'
	current?: Date | null
	use12Hours?: boolean
}

export type DateScrollPickerEvents = {
	select: [value: Date, event: MouseEvent]
}
