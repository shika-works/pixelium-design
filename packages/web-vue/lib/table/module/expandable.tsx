import { isNullish } from 'parsnip-kit'
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
		((evt: 'update:expandedKeys', value: any[]) => void)
) => {
	const [expandedKeys, updateExpandedKeys] = useControlledMode('expandedKeys', props, emits, {
		transform(arg: undefined | null | any[]) {
			return arg ? [...arg] : []
		},
		defaultField: 'defaultExpandedKeys'
	})

	if (props.expandable?.defaultExpandAllRows) {
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
			contentProps: {
				class: 'px-table-addition'
			},
			labelContentProps: {
				class: 'px-table-addition'
			},
			render: ({ record }: { record: TableData }) => {
				const key = record[props.rowKey || DEFAULT_ROW_KEY]
				const hasExpand = !isNullish(record.expand)
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
	return [expandedKeys, genExpandableCol] as const
}
