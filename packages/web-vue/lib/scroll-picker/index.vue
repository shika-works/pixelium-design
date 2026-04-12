<script setup lang="ts">
import { ref } from 'vue'
import { isNullish, isNumber, isString } from 'parsnip-kit'
import type {
	ScrollPickerOption,
	ScrollPickerProps,
	ScrollPickerEvent,
	ScrollPickerExpose
} from './type'
import Scroll from '../scroll-bar/index.vue'
import { inVitest } from '../share/util/env'

defineOptions({
	name: 'ScrollPicker'
})

const props = withDefaults(defineProps<ScrollPickerProps>(), {
	options: () => [],
	current: null
})

const emits = defineEmits<ScrollPickerEvent>()

const listRef = ref<HTMLUListElement | null>(null)

const getOptionKey = (option: string | number | ScrollPickerOption) => {
	if (isString(option) || isNumber(option)) {
		return option
	}
	return option.key ?? option.value
}

const getActiveOptionKey = () => {
	const activeOption = props.options.find((option) => isActive(option))
	return activeOption ? String(getOptionKey(activeOption)) : null
}

const scrollToCurrent = (key?: string | number) => {
	if (inVitest()) {
		return
	}

	const currentKey = key ?? getActiveOptionKey()
	if (isNullish(currentKey)) {
		return
	}

	const item = Array.from(listRef.value?.children || []).find((child) => {
		return child instanceof HTMLElement && child.dataset.optionKey === `${currentKey}`
	}) as HTMLLIElement | undefined

	if (!item) {
		return
	}

	item.scrollIntoView({ block: 'center' })
}

const getOptionLabel = (option: string | number | ScrollPickerOption) => {
	return isString(option) || isNumber(option) ? option : option.label
}

const isDisabled = (option: string | number | ScrollPickerOption) => {
	return !isString(option) && !isNumber(option) && option.disabled
}

const isActive = (option: string | number | ScrollPickerOption) => {
	if (isString(option) || isNumber(option)) {
		return option === props.current
	}
	return option.value === props.current
}

const selectHandler = (option: string | number | ScrollPickerOption, event: MouseEvent) => {
	if (isDisabled(option)) {
		return
	}

	const value = isString(option) || isNumber(option) ? option : option.value
	emits('select', value, option, event)
}

defineExpose<ScrollPickerExpose>({
	scrollToCurrent
})
</script>

<template>
	<div class="pixelium px-scroll-picker">
		<Scroll class="px-scroll-picker-scroll" variant="simple" ghost>
			<ul ref="listRef" class="px-scroll-picker-list">
				<li
					v-for="option in props.options"
					:key="getOptionKey(option)"
					:data-option-key="String(getOptionKey(option))"
					class="px-scroll-picker-item"
					:class="{
						'px-scroll-picker-item__active': isActive(option),
						'px-scroll-picker-item__disabled': isDisabled(option)
					}"
					:tabindex="isDisabled(option) ? -1 : 0"
					@click="selectHandler(option, $event)"
				>
					{{ getOptionLabel(option) }}
				</li>
			</ul>
		</Scroll>
	</div>
</template>

<style lang="less" src="./index.less" />
<style src="../share/style/index.css" />
