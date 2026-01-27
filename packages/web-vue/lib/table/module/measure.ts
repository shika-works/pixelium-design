import { nextTick, onMounted, ref, watch, type ComputedRef, type ShallowRef } from 'vue'
import type { HeaderCell, BodyCell } from './column'
import type { LooseRequired } from '../../share/type'
import type { TableProps } from '../type'
import { useResizeObserver } from '../../share/hook/use-resize-observer'

export const useMeasure = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	tableHeadRef: ShallowRef<HTMLTableSectionElement | null>,
	tableBodyRef: ShallowRef<HTMLTableSectionElement | null>,
	columnsInfo: ComputedRef<{
		maxDepth: number
		headerRows: HeaderCell[][]
		leafColumns: BodyCell[]
	}>,
	props: LooseRequired<TableProps>
) => {
	const headInset = ref<Record<string, { type: 'left' | 'right'; value: number } | undefined>>(
		{}
	)
	const bodyInset = ref<Record<number, { type: 'left' | 'right'; value: number } | undefined>>(
		{}
	)
	const summaryInset = ref<
		Record<number, { type: 'top' | 'bottom'; value: number } | undefined>
	>({})

	const measureXSticky = () => {
		headInset.value = {}
		nextTick(() => {
			if (!wrapperRef.value) {
				return
			}
			const thArr = Array.from(wrapperRef.value.querySelectorAll('.px-table-head > tr > th'))
			thArr.forEach((e) => {
				const trEl = e.parentElement
				if (trEl?.tagName.toLowerCase() !== 'tr') {
					return
				}
				const isLeft = e.className.includes('px-table-th__left-fixed')
				const isRight = e.className.includes('px-table-th__right-fixed')
				const isLeaf = e.className.includes('px-table-th__leaf')
				const dataHead = e.getAttribute('data-head')
				const dataLeaf = e.getAttribute('data-leaf')
				const thRect = e.getBoundingClientRect()
				const trRect = trEl.getBoundingClientRect()

				if (isLeft && dataHead) {
					headInset.value[dataHead] = { type: 'left', value: thRect.left - trRect.left }
					if (isLeaf && dataLeaf) {
						bodyInset.value[+dataLeaf] = { type: 'left', value: thRect.left - trRect.left }
					}
				}
				if (isRight && dataHead) {
					headInset.value[dataHead] = { type: 'right', value: thRect.right - trRect.right }
					if (isLeaf && dataLeaf) {
						bodyInset.value[+dataLeaf] = { type: 'right', value: thRect.right - trRect.right }
					}
				}
			})
		})
	}
	const measureSummarySticky = () => {
		summaryInset.value = {}
		nextTick(() => {
			if (!wrapperRef.value || !tableBodyRef.value || !tableHeadRef.value) {
				return
			}
			const tbodyEl = tableBodyRef.value
			const tableHeadHeight = tableHeadRef.value.clientHeight
			const tbodyRect = tbodyEl.getBoundingClientRect()
			const trArr = Array.from(
				wrapperRef.value.querySelectorAll(
					'.px-table-row__sticky-top,.px-table-row__sticky-bottom'
				)
			)
			trArr.forEach((e) => {
				const dataSummary = e.getAttribute('data-summary')
				if (dataSummary) {
					const isTop = e.className.includes('px-table-row__sticky-top')
					const isBottom = e.className.includes('px-table-row__sticky-bottom')
					const trRect = e.getBoundingClientRect()
					if (isTop) {
						summaryInset.value[+dataSummary] = {
							type: 'top',
							value: trRect.top - tbodyRect.top + (props.fixedHead ? tableHeadHeight : 0)
						}
					}
					if (isBottom) {
						summaryInset.value[+dataSummary] = {
							type: 'bottom',
							value: tbodyRect.bottom - trRect.bottom
						}
					}
				}
			})
		})
	}

	const measureFixed = () => {
		requestAnimationFrame(() => {
			measureXSticky()
			measureSummarySticky()
		})
	}
	const measureSummaryStickyRaf = () => {
		requestAnimationFrame(() => {
			measureSummarySticky()
		})
	}

	watch(
		() => columnsInfo.value.headerRows,
		() => {
			measureFixed()
		},
		{
			deep: 3
		}
	)
	watch(
		() => props.summary,
		() => {
			measureSummaryStickyRaf()
		},
		{
			deep: 3
		}
	)
	onMounted(() => {
		measureFixed()
	})
	useResizeObserver(wrapperRef, measureFixed)

	return [headInset, bodyInset, summaryInset] as const
}
