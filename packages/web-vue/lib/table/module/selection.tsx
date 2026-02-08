import {
	difference,
	intersection,
	isArray,
	isFunction,
	isNullish,
	isObject,
	union
} from 'parsnip-kit'
import { useControlledMode } from '../../share/hook/use-controlled-mode'
import type { LooseRequired } from '../../share/type'
import type { TableColumn, TableData, TableProps, TableSelection } from '../type'
import { computed, Fragment, mergeProps, watch, type Ref } from 'vue'

import Radio from '../../radio/index.vue'
import Checkbox from '../../checkbox/index.vue'
import {
	DEFAULT_ROW_KEY,
	DEFAULT_ADDITION_COL_WIDTH,
	TABLE_SELECTION_COL_SYMBOL
} from './share'

export const useSelection = (
	currentData: Ref<TableData[]>,
	paginatedData: Ref<TableData[]>,
	page: Ref<number>,
	pageSize: Ref<number>,
	props: LooseRequired<TableProps>,
	emits: ((
		evt: 'select',
		value: boolean,
		key: any,
		record: TableData,
		event: InputEvent
	) => void) &
		((evt: 'selectAll', value: boolean, event: InputEvent) => void) &
		((evt: 'update:selectedKeys', value: any[]) => void) &
		((evt: 'selectedChange', value: any[]) => void)
) => {
	const selectionConfig = computed<TableSelection>(() => {
		const selection = props.selection
		const objectType = isObject(selection)
		return {
			multiple: (objectType && selection.multiple) || false,
			showSelectAll: objectType ? (selection.showSelectAll !== false ? true : false) : true,
			label: objectType ? selection.label : undefined,
			width: objectType ? selection.width : undefined,
			minWidth: objectType ? selection.minWidth : undefined,
			fixed: objectType ? !!selection.fixed : false,
			onlyCurrent: objectType ? !!selection.onlyCurrent : false,
			selectAllMethod: objectType ? selection.selectAllMethod : undefined,
			universalSetSelectAllRef: objectType
				? selection.universalSetSelectAllRef || 'current'
				: 'all'
		}
	})
	const [selectedKeys, updateSelectedKeys] = useControlledMode('selectedKeys', props, emits, {
		defaultField: 'defaultSelectedKeys',
		transform: (arg: null | undefined | any[]) => {
			if (isNullish(arg)) {
				return []
			}
			if (selectionConfig.value.multiple) {
				return [...arg]
			} else {
				return arg.slice(0, 1)
			}
		}
	})
	const selectionType = computed(() => {
		return selectionConfig.value.multiple
	})
	watch(selectionType, (val, old) => {
		if (old === true && val !== true && props.selection) {
			updateSelectedKeys((selectedKeys.value || []).slice(0, 1))
		}
	})
	watch(
		paginatedData,
		() => {
			if (!selectionConfig.value.onlyCurrent) {
				return
			}
			const rowKeys = (paginatedData.value || []).map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
			let curSelectedKeys = [...(selectedKeys.value || [])]

			curSelectedKeys = intersection(curSelectedKeys, rowKeys)
			updateSelectedKeys(curSelectedKeys)
		},
		{
			deep: 2
		}
	)

	const checkboxSelectHandler = async (
		value: boolean,
		event: InputEvent,
		key: any,
		record: TableData
	) => {
		const curSelectedKeys = [...(selectedKeys.value || [])]
		if (value) {
			const idx = curSelectedKeys.findIndex((e) => e === key)
			if (idx === -1) {
				curSelectedKeys.push(key)
			}
		} else {
			const idx = curSelectedKeys.findIndex((e) => e === key)
			if (idx >= 0) {
				curSelectedKeys.splice(idx, 1)
			}
		}
		await updateSelectedKeys(curSelectedKeys)
		emits('select', value, key, record, event)
		emits('selectedChange', curSelectedKeys)
	}

	const radioSelectHandler = async (
		value: boolean,
		event: InputEvent,
		key: any,
		record: TableData
	) => {
		const curSelectedKeys = [key]
		await updateSelectedKeys(curSelectedKeys)
		emits('select', value, key, record, event)
		emits('selectedChange', curSelectedKeys)
	}

	const selectAllHandler = async (
		value: boolean,
		preState: { value: boolean; indeterminate: boolean },
		event: InputEvent
	) => {
		let curSelectedKeys: any[] = []
		if (isFunction(selectionConfig.value.selectAllMethod)) {
			curSelectedKeys = await selectionConfig.value.selectAllMethod(value, preState, {
				originData: props.data || [],
				currentData: currentData.value,
				paginatedData: paginatedData.value,
				selectedKeys: selectedKeys.value || [],
				page: page.value,
				pageSize: pageSize.value
			})
		} else {
			const rowKeys = (paginatedData.value || [])
				.filter((e) => !e.disabled)
				.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
			curSelectedKeys = [...(selectedKeys.value || [])]
			// ignore disabled rows
			if (!value) {
				curSelectedKeys = difference(curSelectedKeys, rowKeys)
			} else {
				curSelectedKeys = union(curSelectedKeys, rowKeys)
			}
		}
		await updateSelectedKeys(curSelectedKeys)
		emits('selectAll', value, event)
		emits('selectedChange', curSelectedKeys)
	}

	const genSelectionCol = (selection: TableSelection, columns: TableColumn[]) => {
		const hasLeftFixed = columns.some((e) => e.fixed === 'left')
		return {
			key: TABLE_SELECTION_COL_SYMBOL,
			width: selection.width || DEFAULT_ADDITION_COL_WIDTH,
			minWidth: selection.minWidth || undefined,
			fixed: hasLeftFixed ? 'left' : selection.fixed ? ('left' as const) : ('none' as const),
			contentProps: mergeProps(
				{
					class: 'px-table-addition'
				},
				selection.contentProps || {}
			),
			labelContentProps: mergeProps(
				{
					class: 'px-table-addition'
				},
				selection.labelContentProps || {}
			),
			cellProps: selection.cellProps,
			labelCellProps: selection.labelCellProps,
			render: ({ record }: { record: TableData }) => {
				const curSelectedKeys = selectedKeys.value || []
				const key = record[props.rowKey || DEFAULT_ROW_KEY]
				const selected = curSelectedKeys.includes(key)
				return selection.multiple ? (
					<Checkbox
						modelValue={selected}
						size="small"
						onInput={(value, event) => checkboxSelectHandler(value, event, key, record)}
						disabled={!!record.disabled}
						pollSizeChange={props.pollSizeChange}
					></Checkbox>
				) : (
					<Radio
						modelValue={selected}
						onInput={(value, event) => radioSelectHandler(value, event, key, record)}
						size="small"
						disabled={!!record.disabled}
						pollSizeChange={props.pollSizeChange}
					></Radio>
				)
			},
			labelRender: () => {
				const curSelectedKeys = selectedKeys.value || []
				const universalSet = (
					selectionConfig.value.universalSetSelectAllRef === 'all'
						? currentData.value
						: paginatedData.value || []
				)
					.filter((e) => !e.disabled)
					.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])

				const selectedAll = difference(universalSet, curSelectedKeys).length === 0
				const indeterminate =
					!selectedAll && intersection(universalSet, curSelectedKeys).length > 0
				return selection.multiple && selection.showSelectAll ? (
					<Fragment>
						{
							<Checkbox
								modelValue={selectedAll}
								indeterminate={indeterminate}
								size="small"
								onInput={(value, event) =>
									selectAllHandler(value, { value: selectedAll, indeterminate }, event)
								}
								style={{
									marginRight: selection.label ? `8px` : undefined
								}}
								pollSizeChange={props.pollSizeChange}
							></Checkbox>
						}
						{selection.label}
					</Fragment>
				) : (
					(selection.label ?? '')
				)
			}
		}
	}
	const select = async (key: any | any[], value: boolean) => {
		const rowKeys = paginatedData.value.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
		const paramKeys = isArray(key) ? key : [key]
		const validKeys = selectionConfig.value.onlyCurrent
			? intersection(paramKeys, rowKeys)
			: paramKeys
		let nextSelectedKeys = selectedKeys.value || []
		if (value) {
			nextSelectedKeys = union(nextSelectedKeys, validKeys)
		} else {
			nextSelectedKeys = difference(nextSelectedKeys, validKeys)
		}
		if (!selectionConfig.value.multiple && nextSelectedKeys.length > 1) {
			nextSelectedKeys.length = 1
		}

		await updateSelectedKeys(nextSelectedKeys)
	}
	const clearSelect = async () => {
		await updateSelectedKeys([])
	}
	const selectAll = async (
		value: boolean,
		crossPage: boolean = false,
		ignoreDisabled: boolean = true
	) => {
		if (!selectionConfig.value.multiple) {
			return
		}
		if (!value) {
			await updateSelectedKeys([])
			return
		}
		let rowKeys = (crossPage ? currentData.value : paginatedData.value) || []
		if (ignoreDisabled) {
			rowKeys = rowKeys.filter((e) => !e.disabled)
		}
		rowKeys = rowKeys.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
		await updateSelectedKeys(rowKeys)
	}
	const selectExpose = {
		select,
		clearSelect,
		selectAll
	}
	return [selectedKeys, genSelectionCol, selectionConfig, selectExpose] as const
}
