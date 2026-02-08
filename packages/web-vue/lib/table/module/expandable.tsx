import {
	difference,
	isArray,
	isFunction,
	isNullish,
	isObject,
	isString,
	union
} from 'parsnip-kit'
import { useControlledMode } from '../../share/hook/use-controlled-mode'
import type { LooseRequired } from '../../share/type'
import type { TableColumn, TableData, TableExpandable, TableProps } from '../type'
import {
	DEFAULT_ADDITION_COL_WIDTH,
	DEFAULT_ROW_KEY,
	TABLE_EXPANDABLE_COL_SYMBOL
} from './share'

import MinusIcon from '@hackernoon/pixel-icon-library/icons/SVG/regular/minus.svg'
import PlusIcon from '@hackernoon/pixel-icon-library/icons/SVG/regular/plus.svg'
import { computed, mergeProps } from 'vue'

const Minus = MinusIcon as any
const Plus = PlusIcon as any

export const useExpandable = (
	props: LooseRequired<TableProps>,
	emits: ((
		evt: 'expand',
		value: boolean,
		key: any,
		record: TableData,
		event: MouseEvent
	) => void) &
		((evt: 'expandedChange', value: any[]) => void) &
		((evt: 'update:expandedKeys', value: any[]) => void),
	slots: Record<string, Function | undefined>
) => {
	const expandableConfig = computed<TableExpandable>(() => {
		const expandable = props.expandable
		const objectType = isObject(expandable)
		return {
			defaultExpandAllRows: (objectType && expandable.defaultExpandAllRows) || false,
			label: objectType ? expandable.label : undefined,
			width: objectType ? expandable.width : undefined,
			minWidth: objectType ? expandable.minWidth : undefined,
			fixed: objectType ? !!expandable.fixed : false
		}
	})
	const [expandedKeys, updateExpandedKeys] = useControlledMode('expandedKeys', props, emits, {
		transform(arg: undefined | null | any[]) {
			return arg ? [...arg] : []
		},
		defaultField: 'defaultExpandedKeys'
	})

	if (expandableConfig.value.defaultExpandAllRows) {
		updateExpandedKeys(
			(props.data || [])
				.filter((e) => !isNullish(e.expand))
				.map((e) => e[props.rowKey || DEFAULT_ROW_KEY])
		)
	}

	const expandHandler = async (key: any, record: TableData, e: MouseEvent) => {
		const currentValue = [...(expandedKeys.value || [])]
		const idx = currentValue.findIndex((e) => e === key)
		if (idx < 0) {
			currentValue.push(key)
		}
		await updateExpandedKeys(currentValue)
		emits('expand', true, key, record, e)
		emits('expandedChange', [...(expandedKeys.value || [])])
	}

	const foldHandler = async (key: any, record: TableData, e: MouseEvent) => {
		const currentValue = [...(expandedKeys.value || [])]
		const idx = currentValue.findIndex((e) => e === key)
		if (idx >= 0) {
			currentValue.splice(idx, 1)
		}
		await updateExpandedKeys(currentValue)
		emits('expand', false, key, record, e)
		emits('expandedChange', [...(expandedKeys.value || [])])
	}

	const genExpandableCol = (expandable: TableExpandable, columns: TableColumn[]) => {
		const hasLeftFixed = columns.some((e) => e.fixed === 'left')
		return {
			key: TABLE_EXPANDABLE_COL_SYMBOL,
			width: expandable.width || DEFAULT_ADDITION_COL_WIDTH,
			minWidth: expandable.minWidth || undefined,
			fixed: hasLeftFixed ? 'left' : expandable.fixed ? ('left' as const) : ('none' as const),
			contentProps: mergeProps(
				{
					class: 'px-table-addition'
				},
				expandable.contentProps || {}
			),
			labelContentProps: mergeProps(
				{
					class: 'px-table-addition'
				},
				expandable.labelContentProps || {}
			),
			cellProps: expandable.cellProps,
			labelCellProps: expandable.labelCellProps,
			render: ({ record }: { record: TableData }) => {
				const key = record[props.rowKey || DEFAULT_ROW_KEY]
				const hasExpand =
					isString(record.expand) ||
					isFunction(record.expand) ||
					(slots.expand && record.expand !== false)
				const included = expandedKeys.value?.includes(key)
				return hasExpand ? (
					<div
						class="px-table-icon-button"
						tabindex="0"
						onClick={(e: MouseEvent) =>
							included ? foldHandler(key, record, e) : expandHandler(key, record, e)
						}
					>
						{!included ? (
							<Plus class="px-table-icon"></Plus>
						) : (
							<Minus class="px-table-icon"></Minus>
						)}
					</div>
				) : null
			},
			label: expandable.label ?? ''
		}
	}
	const expand = async (key: any | any[], value: boolean) => {
		const paramKeys = isArray(key) ? key : [key]

		let nextSelectedKeys = expandedKeys.value || []
		if (value) {
			nextSelectedKeys = union(nextSelectedKeys, paramKeys)
		} else {
			nextSelectedKeys = difference(nextSelectedKeys, paramKeys)
		}
		await updateExpandedKeys(nextSelectedKeys)
	}
	const clearExpand = async () => {
		await updateExpandedKeys([])
	}
	const expandExpose = {
		expand,
		clearExpand
	}
	return [expandedKeys, genExpandableCol, expandableConfig, expandExpose] as const
}
