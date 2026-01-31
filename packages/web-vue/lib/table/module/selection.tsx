import {
	difference,
	intersection,
	isNullish,
	isObject,
	symmetricDifference,
	union
} from 'parsnip-kit'
import { useControlledMode } from '../../share/hook/use-controlled-mode'
import type { LooseRequired } from '../../share/type'
import type { TableColumn, TableData, TableProps, TableSelection } from '../type'
import { computed, Fragment, watch } from 'vue'

import Radio from '../../radio/index.vue'
import Checkbox from '../../checkbox/index.vue'
import {
	DEFAULT_ROW_KEY,
	DEFAULT_ADDITION_COL_WIDTH,
	TABLE_SELECTION_COL_SYMBOL
} from './share'

export const useSelection = (
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
			onlyCurrent: objectType ? !!selection.onlyCurrent : false
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
		() => props.data,
		() => {
			if (!selectionConfig.value.onlyCurrent) {
				return
			}
			const rowKeys = (props.data || []).map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
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

	const selectAllHandler = async (value: boolean, event: InputEvent) => {
		const rowKeys = (props.data || [])
			.filter((e) => !e.disabled)
			.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
		let curSelectedKeys = [...(selectedKeys.value || [])]
		// ignore disabled rows
		if (!value) {
			curSelectedKeys = difference(curSelectedKeys, rowKeys)
		} else {
			curSelectedKeys = union(curSelectedKeys, rowKeys)
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
			contentProps: {
				class: 'px-table-addition'
			},
			labelContentProps: {
				class: 'px-table-addition'
			},
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
					></Checkbox>
				) : (
					<Radio
						modelValue={selected}
						onInput={(value, event) => radioSelectHandler(value, event, key, record)}
						size="small"
						disabled={!!record.disabled}
					></Radio>
				)
			},
			labelRender: () => {
				const curSelectedKeys = selectedKeys.value || []
				const rowKeys = (props.data || [])
					.filter((e) => !e.disabled)
					.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
				const selectedAll = symmetricDifference(curSelectedKeys, rowKeys).length === 0
				return selection.multiple && selection.showSelectAll ? (
					<Fragment>
						{
							<Checkbox
								modelValue={selectedAll}
								indeterminate={!selectedAll && !!curSelectedKeys.length}
								size="small"
								onInput={(value, event) => selectAllHandler(value, event)}
								style={{
									marginRight: selection.label ? `8px` : undefined
								}}
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
	return [selectedKeys, genSelectionCol, selectionConfig] as const
}
