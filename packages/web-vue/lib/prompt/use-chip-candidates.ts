import { computed, nextTick, ref, watch, type ComputedRef, type ShallowRef } from 'vue'
import { isString } from 'parsnip-kit'
import type { OptionListGroupOption, OptionListOption } from '../option-list/type'
import type Popup from '../popup/index.vue'
import type {
	PromptChip,
	PromptChipConfig,
	PromptGroupOption,
	PromptOption,
	PromptTriggerPayload
} from './type'
import { defaultFilter } from '../share/util/common'

type UseChipCandidatesOptions = {
	chipConfig: ComputedRef<PromptChipConfig | undefined>
	wrapperRef: ShallowRef<HTMLElement | null>
	popupRef: ShallowRef<InstanceType<typeof Popup> | null>
	insertChip: (chip: PromptChip) => void
	onSelect: (option: string | PromptOption, e: MouseEvent | KeyboardEvent) => void
	onTrigger: (payload: PromptTriggerPayload) => void
}

export const useChipCandidates = (options: UseChipCandidatesOptions) => {
	const triggerState = ref<PromptTriggerPayload>({ char: '', query: '', active: false })
	const activeIndex = ref(0)

	const rawOptions = computed(() => options.chipConfig?.value?.options ?? [])
	const optionFilter = computed(() => options.chipConfig?.value?.filter)

	const searchedOptions = computed<(string | PromptOption | PromptGroupOption)[]>(() => {
		if (optionFilter.value) {
			return optionFilter.value(triggerState.value.query, rawOptions.value)
		}
		return rawOptions.value
	})

	const optionSources = new WeakMap<OptionListOption, PromptOption>()

	const toOptionListItem = (option: PromptOption): OptionListOption => {
		const item: OptionListOption = { ...option, value: option.key ?? option.label }
		optionSources.set(item, option)
		return item
	}

	const toOptionListGroup = (option: PromptGroupOption): OptionListGroupOption => ({
		...option,
		children: option.children.map((child) =>
			isString(child) ? child : toOptionListItem(child)
		)
	})

	const optionListOptions = computed<(string | OptionListOption | OptionListGroupOption)[]>(
		() => {
			const list: (string | OptionListOption | OptionListGroupOption)[] =
				searchedOptions.value.map((item) => {
					if (isString(item)) {
						return item
					}
					return 'children' in item ? toOptionListGroup(item) : toOptionListItem(item)
				})
			if (optionFilter.value || !triggerState.value.query.trim()) {
				return list
			}
			return defaultFilter(triggerState.value.query, list)
		}
	)

	const flatOptions = computed(() => {
		const result: (string | OptionListOption)[] = []
		optionListOptions.value.forEach((item) => {
			if (isString(item)) {
				result.push(item)
				return
			}
			if ('children' in item) {
				item.children.forEach((child) => {
					if (isString(child)) {
						result.push(child)
						return
					}
					if (!child.disabled) {
						result.push(child)
					}
				})
				return
			}
			if (!item.disabled) {
				result.push(item)
			}
		})
		return result
	})

	const optionItemValue = (option: string | OptionListOption) =>
		isString(option) ? option : option.value

	const originalOption = (option: string | OptionListOption): string | PromptOption => {
		if (isString(option)) {
			return option
		}
		return optionSources.get(option) ?? (option as OptionListOption & PromptOption)
	}

	const activeValues = computed(() => {
		const option = flatOptions.value[activeIndex.value]
		return option ? [optionItemValue(option)] : []
	})

	const dropdownVisible = computed(
		() => triggerState.value.active && flatOptions.value.length > 0
	)

	const triggerHandler = (payload: PromptTriggerPayload) => {
		triggerState.value = payload
		if (payload.active) {
			activeIndex.value = 0
		}
		options.onTrigger(payload)
	}

	const closeDropdown = () => {
		triggerState.value = { ...triggerState.value, active: false }
	}

	const popupVisibleUpdateHandler = (value: boolean) => {
		if (!value) {
			closeDropdown()
		}
	}

	const resolveChipType = (option: PromptOption) =>
		typeof option.chipType === 'function' ? option.chipType(option) : option.chipType

	const optionToChip = (option: string | PromptOption): PromptChip => {
		if (isString(option)) {
			return { id: option, label: option }
		}
		return {
			id: option.key ?? option.label,
			label: option.label,
			type: resolveChipType(option)
		}
	}

	const selectHandler = (
		_value: any,
		option: string | OptionListOption,
		e: MouseEvent | KeyboardEvent
	) => {
		const source = originalOption(option)
		options.insertChip(optionToChip(source))
		closeDropdown()
		options.onSelect(source, e)
	}

	const panelKeydownHandler = (e: KeyboardEvent) => {
		if (!dropdownVisible.value) {
			return false
		}
		const total = flatOptions.value.length
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault()
			activeIndex.value = (activeIndex.value + (e.key === 'ArrowDown' ? 1 : -1) + total) % total
			return true
		}
		if (e.key === 'Enter') {
			e.preventDefault()
			const option = flatOptions.value[activeIndex.value]
			if (option) {
				selectHandler(optionItemValue(option), option, e)
			}
			return true
		}
		return false
	}

	watch(optionListOptions, () => {
		activeIndex.value = 0
	})

	const anchorStyle = computed(() => {
		const rect = triggerState.value.rect
		const root = options.wrapperRef.value?.getBoundingClientRect()
		if (!rect || !root) {
			return { display: 'none' }
		}
		return {
			left: `${rect.left - root.left}px`,
			top: `${rect.bottom - root.top}px`
		}
	})

	watch([anchorStyle, dropdownVisible], () => {
		if (dropdownVisible.value) {
			nextTick(() => options.popupRef.value?.updateRenderState())
		}
	})

	return {
		dropdownVisible,
		anchorStyle,
		optionListOptions,
		activeValues,
		triggerHandler,
		popupVisibleUpdateHandler,
		selectHandler,
		panelKeydownHandler
	}
}
