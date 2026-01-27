import { computed, watch, type ComputedRef } from 'vue'
import type { LooseRequired } from '../../share/type'
import type { SortOrder, TableColumn, TableData, TableProps, TableSortable } from '../type'
import type { BodyCell, HeaderCell } from './column'
import { useControlledMode } from '../../share/hook/use-controlled-mode'
import { isFunction } from 'parsnip-kit'
import { getEnumerableKeys } from '../../share/util/common'

import ChevronDownIcon from '@hackernoon/pixel-icon-library/icons/SVG/solid/chevron-down-solid.svg'
import ChevronUpIcon from '@hackernoon/pixel-icon-library/icons/SVG/solid/chevron-up-solid.svg'

const ChevronDown = ChevronDownIcon as any
const ChevronUp = ChevronUpIcon as any

export const useSortable = (
	columnsInfo: ComputedRef<{
		maxDepth: number
		headerRows: HeaderCell[][]
		leafColumns: BodyCell[]
	}>,
	props: LooseRequired<TableProps>,
	emits: ((evt: 'update:sortOrder', value: SortOrder) => void) &
		((
			evt: 'sortSelect',
			value: 'asc' | 'desc' | 'none',
			key: string | number | symbol,
			column: TableColumn,
			event: MouseEvent
		) => void) &
		((evt: 'sortOrderChange', value: SortOrder) => void)
) => {
	const sortableInfo = computed(() => {
		const res = {} as Record<
			string | symbol | number,
			undefined | { sortable: TableSortable; field: string | undefined }
		>
		columnsInfo.value.leafColumns.forEach((e) => {
			if (e.original.sortable) {
				res[e.original.key] = {
					sortable: e.original.sortable,
					field: e.original.field
				}
			}
		})
		return res
	})

	const formatSortOrder = (arg: SortOrder) => {
		let res = { ...arg }
		const keys = Reflect.ownKeys(res)
		let hasChange = false
		keys.forEach((key) => {
			if (!sortableInfo.value[key]) {
				return
			}
			if (sortableInfo.value[key].sortable.orders?.length) {
				if (arg[key] === 'asc' && !sortableInfo.value[key].sortable.orders.includes('asc')) {
					arg[key] = 'none'
					hasChange = true
				} else if (
					arg[key] === 'desc' &&
					!sortableInfo.value[key].sortable.orders.includes('desc')
				) {
					arg[key] = 'none'
					hasChange = true
				}
			} else if (arg[key] && arg[key] !== 'none') {
				arg[key] = 'none'
				hasChange = true
			}
		})

		const firstSingleSortKey = keys.find(
			(key) => !sortableInfo.value[key]?.sortable.multiple && (!res[key] || res[key] !== 'none')
		)
		if (firstSingleSortKey && keys.length > 1) {
			res = { firstSingleSortKey: res[firstSingleSortKey] }
			hasChange = true
		}
		return [res, hasChange] as const
	}

	const [sortOrder, updateSortOrder] = useControlledMode('sortOrder', props, emits, {
		defaultField: 'defaultSortOrder',
		transform: (arg: undefined | null | SortOrder) => {
			if (!arg) {
				return {}
			}

			const [formatValue, hasChange] = formatSortOrder(arg)

			if (hasChange) {
				emits('update:sortOrder', { ...formatValue })
			}

			return formatValue
		},
		initial: (arg: undefined | null | SortOrder) => {
			arg = arg || {}
			const keys = Reflect.ownKeys(sortableInfo.value)
			keys.forEach((key) => {
				if (!sortableInfo.value[key]) {
					return
				}
				if (sortableInfo.value[key].sortable.defaultSortOrder) {
					arg[key] = sortableInfo.value[key].sortable.defaultSortOrder
				}
			})
			return arg
		}
	})
	watch(sortableInfo, () => {
		if (!sortOrder.value) {
			return
		}
		const curSortOrder = { ...sortOrder.value }
		const [formatValue, hasChange] = formatSortOrder(curSortOrder)
		if (hasChange) {
			updateSortOrder(formatValue)
		}
	})

	const onSortSelect = async (
		preValue: 'asc' | 'desc' | 'none' | undefined | null,
		hasAsc: boolean,
		hasDesc: boolean,
		column: TableColumn,
		e: MouseEvent
	) => {
		const key = column.key
		const sortableOfKey = sortableInfo.value[key]?.sortable
		if (!sortableOfKey) {
			return
		}
		let nextValue: 'asc' | 'desc' | 'none'
		if (preValue === 'asc') {
			if (hasDesc) {
				nextValue = 'desc'
			} else {
				nextValue = 'none'
			}
		} else if (preValue === 'desc') {
			nextValue = 'none'
		} else {
			if (hasAsc) {
				nextValue = 'asc'
			} else {
				nextValue = 'desc'
			}
		}
		let nextSortOrder: SortOrder
		if (!sortableOfKey.multiple) {
			nextSortOrder = { [key]: nextValue }
		} else {
			nextSortOrder = { ...sortOrder.value }
			const keys = getEnumerableKeys(nextSortOrder)
			keys.forEach((key) => {
				if (!sortableInfo.value[key]?.sortable.multiple) {
					delete nextSortOrder[key]
				}
			})
		}
		await updateSortOrder(nextSortOrder)
		emits('sortSelect', nextValue, key, column, e)
		emits('sortOrderChange', nextSortOrder)
	}

	const genSortableIcon = (sortable: TableSortable, column: TableColumn) => {
		const orders = sortable.orders
		if (!orders?.length) {
			return null
		}
		const hasAsc = orders.includes('asc')
		const hasDesc = orders.includes('desc')
		if (!hasAsc && !hasDesc) {
			return null
		}
		const key = column.key
		const curSortValue = sortOrder.value || {}
		const ascActive = curSortValue[key] === 'asc'
		const descActive = curSortValue[key] === 'desc'
		return (
			<div
				class={{
					'px-table-sort-icon-wrapper': true,
					'px-table-sort-icon-wrapper__single': +hasDesc + +hasAsc === 1
				}}
				tabindex={0}
				onClick={(e) => onSortSelect(curSortValue[key], hasAsc, hasDesc, column, e)}
			>
				{hasAsc && (
					<ChevronUp
						class={{
							'px-table-sort-icon-asc': true,
							'px-table-sort-icon-asc__active': ascActive
						}}
					></ChevronUp>
				)}
				{hasDesc && (
					<ChevronDown
						class={{
							'px-table-sort-icon-desc': true,
							'px-table-sort-icon-desc__active': descActive
						}}
					></ChevronDown>
				)}
			</div>
		)
	}

	const sortData = (rows: TableData[]) => {
		const keys = getEnumerableKeys(sortableInfo.value)
		if (!keys.length) {
			return rows
		}
		const sortOrderValue = sortOrder.value || {}
		const validKeys = keys
			.filter((key) => sortOrderValue[key] && sortOrderValue[key] !== 'none')
			.sort((a, b) => {
				return (
					((sortableInfo.value[b] && sortableInfo.value[b].sortable.priority) || 0) -
					((sortableInfo.value[a] && sortableInfo.value[a].sortable.priority) || 0)
				)
			})
		if (validKeys.length) {
			rows.sort((a, b) => {
				for (const key of validKeys) {
					if (!sortableInfo.value[key]) {
						continue
					}
					const sortMethod =
						sortableInfo.value[key].sortable.sortMethod &&
						isFunction(sortableInfo.value[key].sortable.sortMethod)
							? sortableInfo.value[key].sortable.sortMethod
							: defaultComparator
					const order = sortOrderValue[key] as 'asc' | 'desc'
					const res = sortMethod(a, b, order, sortableInfo.value[key].field)
					if (res !== 0) {
						return res
					}
				}
				return 0
			})
		}
		return rows
	}

	return [sortOrder, sortData, genSortableIcon] as const
}

export const defaultComparator = (
	a: TableData,
	b: TableData,
	order: 'asc' | 'desc',
	field?: string
) => {
	if (!field) {
		return 0
	}
	const result = a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0
	return order === 'desc' ? -result : result
}
