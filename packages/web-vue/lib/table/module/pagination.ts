import { computed } from 'vue'
import type { LooseRequired } from '../../share/type'
import type { TableProps } from '../type'
import { isObject } from 'parsnip-kit'
import { useControlledMode } from '../../share/hook/use-controlled-mode'

export const usePagination = (
	props: LooseRequired<TableProps>,
	emits: ((evt: 'update:page', value: number) => void) &
		((evt: 'update:pageSize', value: number) => void)
) => {
	const paginationConfig = computed(() => {
		return {
			paginateMethod: isObject(props.pagination)
				? props.pagination.paginateMethod || 'auto'
				: props.pagination !== false
					? 'auto'
					: 'none'
		}
	})

	const [pageSize, updatePageSize] = useControlledMode('pageSize', props, emits, {
		defaultField: 'defaultPageSize',
		transform(arg: number | undefined | null) {
			return Math.max(arg || 10, 1)
		}
	})

	const [page, updatePage] = useControlledMode('page', props, emits, {
		defaultField: 'defaultPage',
		transform(arg: number | undefined | null) {
			return Math.max(arg || 1, 1)
		}
	})

	const onUpdatePage = (value: number) => {
		updatePage(value)
	}
	const onUpdatePageSize = (value: number) => {
		updatePageSize(value)
	}

	return [paginationConfig, page, onUpdatePage, pageSize, onUpdatePageSize] as const
}
