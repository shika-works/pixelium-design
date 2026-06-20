import { clone, isArray } from 'parsnip-kit'

export const processRangeNextValue = (
	type: 'start' | 'end',
	next: Date,
	current: Date | Date[] | undefined | null
) => {
	let nextValue: Date[]
	if (type === 'start') {
		if (isArray(current)) {
			const endDate = current[1]
			if (endDate && next.getTime() > endDate.getTime()) {
				nextValue = [clone(next), clone(next)]
			} else if (endDate) {
				nextValue = [clone(next), clone(endDate)]
			} else {
				nextValue = [clone(next), clone(next)]
			}
		} else {
			nextValue = [clone(next), clone(next)]
		}
	} else {
		if (isArray(current)) {
			const startDate = current[0]
			if (startDate && next.getTime() < startDate.getTime()) {
				nextValue = [clone(next), clone(next)]
			} else if (startDate) {
				nextValue = [clone(startDate), clone(next)]
			} else {
				nextValue = [clone(next), clone(next)]
			}
		} else {
			nextValue = [clone(next), clone(next)]
		}
	}
	return nextValue
}
