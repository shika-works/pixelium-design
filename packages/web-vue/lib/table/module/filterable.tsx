import { computed, ref, watch, type ComputedRef } from 'vue'
import { useControlledMode } from '../../share/hook/use-controlled-mode'
import type { LooseRequired } from '../../share/type'
import type {
	FilterValue,
	TableColumn,
	TableData,
	TableFilterable,
	TableFilterOptions,
	TableProps
} from '../type'
import type { HeaderCell, BodyCell } from './column'
import { isEmpty, isNullish, isString } from 'parsnip-kit'
import Popup from '../../popup/index.vue'
import Radio from '../../radio/index.vue'
import Checkbox from '../../checkbox/index.vue'
import Button from '../../button/index.vue'
import { useLocale } from '../../share/util/locale'
import { getEnumerableKeys } from '../../share/util/common'

import FilterIcon from '@hackernoon/pixel-icon-library/icons/SVG/regular/filter.svg'
const Filter = FilterIcon as any

const cloneFilterValue = (arg: FilterValue) => {
	const res = {} as FilterValue
	const keys = getEnumerableKeys(arg)
	keys.forEach((key) => {
		res[key] = isNullish(arg[key]) ? arg[key] : [...arg[key]]
	})
	return res
}

export const useFilterable = (
	columnsInfo: ComputedRef<{
		maxDepth: number
		headerRows: HeaderCell[][]
		leafColumns: BodyCell[]
	}>,
	props: LooseRequired<TableProps>,
	emits: ((evt: 'update:filterValue', value: FilterValue) => void) &
		((
			evt: 'filterSelect',
			value: any,
			key: string | number | symbol,
			option: TableFilterOptions | string,
			column: TableColumn,
			event: InputEvent
		) => void) &
		((evt: 'filterChange', value: FilterValue) => void) &
		((evt: 'filterReset', key: string | number | symbol, event: MouseEvent) => void) &
		((evt: 'filterConfirm', key: string | number | symbol, event: MouseEvent) => void)
) => {
	const [t] = useLocale()

	const filterableInfo = computed(() => {
		const res = {} as Record<
			string | symbol | number,
			undefined | { filterable: TableFilterable; field?: string }
		>
		columnsInfo.value.leafColumns.forEach((e) => {
			if (e.original.filterable) {
				res[e.original.key] = {
					filterable: e.original.filterable,
					field: e.original.field
				}
			}
		})
		return res
	})

	const [filterValue, updateFilterValue] = useControlledMode('filterValue', props, emits, {
		defaultField: 'defaultFilterValue',
		transform: (arg: undefined | null | FilterValue) => {
			if (!arg) {
				return {}
			}
			const res = cloneFilterValue(arg)
			const keys = getEnumerableKeys(res)
			let hasChange = false
			keys.forEach((key) => {
				if (!filterableInfo.value[key]) {
					return
				}
				if (!filterableInfo.value[key].filterable.multiple && res[key] && res[key].length > 1) {
					res[key] = res[key].slice(0, 1)
					hasChange = true
				}
			})
			if (hasChange) {
				emits('update:filterValue', cloneFilterValue(res))
			}
			return res
		},
		initial: (arg: undefined | null | FilterValue) => {
			arg = arg || {}
			const keys = getEnumerableKeys(filterableInfo.value)
			keys.forEach((key) => {
				if (!filterableInfo.value[key]) {
					return
				}
				if (filterableInfo.value[key].filterable.defaultFilterValue) {
					arg[key] = filterableInfo.value[key].filterable.defaultFilterValue
				}
			})
			return arg
		}
	})

	const innerFilterValue = ref<{
		[key: string | number | symbol]: any[] | null | undefined
	}>(cloneFilterValue(filterValue.value || {}))

	watch(filterableInfo, (val, old) => {
		const oldKeys = getEnumerableKeys(old)
		const currentFilterValue = cloneFilterValue(filterValue.value || {})
		let hasChange = false
		oldKeys.forEach((key) => {
			if (!old[key] || !val[key]) {
				return
			}
			if (old[key].filterable.multiple && !val[key].filterable.multiple) {
				if (currentFilterValue[key] && currentFilterValue[key].length > 1) {
					currentFilterValue[key] = currentFilterValue[key].slice(1)
					hasChange = true
				}
			}
		})
		if (hasChange) {
			updateFilterValue(currentFilterValue)
			innerFilterValue.value = cloneFilterValue(currentFilterValue)
		}
	})

	const popupVisible = ref(false)
	const checkboxSelectHandler = async (
		checked: boolean,
		option: string | TableFilterOptions,
		column: TableColumn,
		event: InputEvent
	) => {
		const key = column.key
		const currentFilterValue = innerFilterValue.value
		const valuesOfCol = currentFilterValue[key] || []
		const value = isString(option) ? option : option.value
		const idx = valuesOfCol?.findIndex((e) => e === value)
		if (checked) {
			if (idx === -1) {
				valuesOfCol.push(value)
			}
		} else {
			if (idx >= 0) {
				valuesOfCol.splice(idx, 1)
			}
		}
		innerFilterValue.value = currentFilterValue
		emits('filterSelect', valuesOfCol, key, option, column, event)
	}

	const radioSelectHandler = async (
		_: boolean,
		option: string | TableFilterOptions,
		column: TableColumn,
		event: InputEvent
	) => {
		const key = column.key
		const currentFilterValue = innerFilterValue.value
		const value = isString(option) ? option : option.value
		const valuesOfCol = [value]
		currentFilterValue[key] = valuesOfCol

		innerFilterValue.value = currentFilterValue
		emits('filterSelect', valuesOfCol, key, option, column, event)
	}

	const confirmClickHandler = async (column: TableColumn, event: MouseEvent) => {
		const currentFilterValue = cloneFilterValue(innerFilterValue.value)
		await updateFilterValue(currentFilterValue)
		const key = column.key
		emits('filterConfirm', key, event)
		emits('filterChange', currentFilterValue)
		popupVisible.value = false
	}

	const resetClickHandler = async (column: TableColumn, event: MouseEvent) => {
		innerFilterValue.value = {}
		const currentFilterValue = {}
		await updateFilterValue(currentFilterValue)
		const key = column.key
		emits('filterReset', key, event)
		emits('filterChange', currentFilterValue)
		popupVisible.value = false
	}

	const renderOption = (
		option: string | TableFilterOptions,
		multiple: boolean,
		column: TableColumn
	) => {
		const valueSelected = (innerFilterValue.value || {})[column.key]
		const active =
			!isEmpty(valueSelected) &&
			valueSelected?.includes(isString(option) ? option : option.value)
		if (isString(option)) {
			if (multiple) {
				return (
					<Checkbox
						size="small"
						key={option}
						modelValue={active}
						onInput={(value, event) => checkboxSelectHandler(value, option, column, event)}
					>
						{option}
					</Checkbox>
				)
			} else {
				return (
					<Radio
						size="small"
						key={option}
						modelValue={active}
						onInput={(value, event) => radioSelectHandler(value, option, column, event)}
					>
						{option}
					</Radio>
				)
			}
		} else {
			if (multiple) {
				return (
					<Checkbox
						modelValue={active}
						size="small"
						key={option.key ?? option.value}
						disabled={option.disabled}
						onInput={(value, event) => checkboxSelectHandler(value, option, column, event)}
					>
						{option.label ?? option.value}
					</Checkbox>
				)
			} else {
				return (
					<Radio
						modelValue={active}
						size="small"
						disabled={option.disabled}
						key={option.key ?? option.value}
						onInput={(value, event) => radioSelectHandler(value, option, column, event)}
					>
						{option.label ?? option.value}
					</Radio>
				)
			}
		}
	}

	const renderPopupContent = (filterable: TableFilterable, column: TableColumn) => {
		const values = filterable.filterOptions
		const multiple = !!filterable.multiple
		if (!values?.length) {
			return null
		}
		return [
			<div class="px-table-filter-wrapper">
				{values.map((option) => {
					return renderOption(option, multiple, column)
				})}
			</div>,
			<hr class="px-table-filter-divider" />,
			<div class="px-table-filter-footer">
				{
					// @ts-ignore
					<Button theme="info" onClick={(e) => resetClickHandler(column, e)} size="small">
						{t('table.filterReset')}
					</Button>
				}
				{
					// @ts-ignore
					<Button size="small" onClick={(e) => confirmClickHandler(column, e)}>
						{t('table.filterConfirm')}
					</Button>
				}
			</div>
		]
	}

	const genFilterableIcon = (filterable: TableFilterable, column: TableColumn) => {
		const values = filterable.filterOptions
		if (!values) {
			return null
		}
		const key = column.key
		const active = !isEmpty((filterValue.value || {})[key])
		return (
			<Popup
				placement="bottom"
				{...(filterable.popoverProps || {})}
				visible={popupVisible.value}
				onUpdate:visible={(val) => (popupVisible.value = val)}
			>
				{{
					content: () => renderPopupContent(filterable, column),
					default: () => (
						<div
							class={{
								'px-table-filter-icon-wrapper': true,
								'px-table-filter-icon-wrapper__active': active
							}}
							tabindex={0}
						>
							<Filter></Filter>
						</div>
					)
				}}
			</Popup>
		)
	}

	const filterData = (rows: TableData[]) => {
		const keys = getEnumerableKeys(filterableInfo.value)
		if (!keys.length) {
			return rows
		}
		return rows.filter((row) => {
			return keys.every((key) => {
				const filterableInfoOfKey = filterableInfo.value[key]
				if (!filterableInfoOfKey) {
					return true
				}
				const field = filterableInfoOfKey.field
				const filterMethod = filterableInfoOfKey.filterable.filterMethod
				const filterValueOfKey = (filterValue.value || {})[key] || []
				const res = filterMethod
					? filterMethod(filterValueOfKey, row)
					: !isNullish(field)
						? !filterValueOfKey.length
							? true
							: filterValueOfKey.includes(row[field])
						: false
				return res
			})
		})
	}
	return [filterValue, filterData, genFilterableIcon] as const
}
