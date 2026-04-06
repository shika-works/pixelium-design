export type DatePickerBodyProps = {
	year: number
	month: number
	current?: Date | Date[] | null
	multiple?: boolean
}

export type DatePickerBodyEvents = {
	select: [value: Date | Date[], event: MouseEvent]
}
