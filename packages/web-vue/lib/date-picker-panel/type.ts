export type DatePickerPanelProps = {
	current?: Date | Date[] | null
	referredDate?: Date
	range?: boolean
	week?: boolean
}

export type DatePickerPanelEvents = {
	select: [value: Date | Date[], event: MouseEvent]
	monthPrev: [referredDate: Date, event: MouseEvent]
	monthNext: [referredDate: Date, event: MouseEvent]
	yearPrev: [referredDate: Date, event: MouseEvent]
	yearNext: [referredDate: Date, event: MouseEvent]
	referredDateSelect: [referredDate: Date, event: MouseEvent]
	referredDateChange: [referredDate: Date, event: MouseEvent]
}
