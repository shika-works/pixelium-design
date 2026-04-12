export type DatePickerBodyProps = {
	year: number
	month: number
	current?: Date | Date[] | null
	range?: boolean
	week?: boolean
}

export type DatePickerBodyEvents = {
	select: [value: Date | Date[], event: MouseEvent]
}
