import { isArray } from 'parsnip-kit'
import type { TableSummary } from '../type'
import { TABLE_SUMMARY_ROW_SYMBOL } from './share'

export const useSummary = () => {
	const genSummaryRow = (summary: TableSummary) => {
		const data = summary.data ? (isArray(summary.data) ? summary.data : [summary.data]) : []
		data.forEach((e) => {
			e[TABLE_SUMMARY_ROW_SYMBOL] = true
		})
		return data
	}
	return genSummaryRow
}
