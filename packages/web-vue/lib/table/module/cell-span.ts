import { isNullish } from 'parsnip-kit'

type SpanRange = {
	startRow: number
	startCol: number
	endRow: number
	endCol: number
	colspan: number
	rowspan: number
}

export class SpanCollector {
	private spans: SpanRange[] = []

	private cellToSpanIndex: (number | null)[][] = []

	constructor(totalRows: number, totalCols: number) {
		this.cellToSpanIndex = Array.from({ length: totalRows }, () => Array(totalCols).fill(null))
	}

	addSpan(startRow: number, startCol: number, colspan: number, rowspan: number): void {
		const spanIndex = this.spans.length
		const span: SpanRange = {
			startRow,
			startCol,
			endRow: startRow + rowspan - 1,
			endCol: startCol + colspan - 1,
			colspan,
			rowspan
		}

		this.spans.push(span)

		for (let r = startRow; r <= span.endRow; r++) {
			for (let c = startCol; c <= span.endCol; c++) {
				this.cellToSpanIndex[r][c] = spanIndex
			}
		}
	}

	isInSpan(row: number, col: number): boolean {
		return !isNullish(this.cellToSpanIndex[row]?.[col])
	}
}
