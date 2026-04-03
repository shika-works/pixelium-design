<script setup lang="ts">
import { computed } from 'vue'
import { isObject, isString } from 'parsnip-kit'
import type { ScrollPickerOption, ScrollPickerProps, ScrollPickerEvent } from './type'
import Scroll from '../scroll-bar/index.vue'

defineOptions({
	name: 'ScrollPicker'
})

const props = withDefaults(defineProps<ScrollPickerProps>(), {
	options: () => [],
	current: null
})

const emits = defineEmits<ScrollPickerEvent>()

const normalizedOptions = computed(() => {
	return props.options.map((option) => {
		if (isString(option)) {
			return {
				value: option,
				label: option,
				key: option
			} as ScrollPickerOption
		}
		return option
	})
})

const getOptionKey = (option: string | ScrollPickerOption) => {
	if (isString(option)) {
		return option
	}
	return option.key ?? option.value
}

const getOptionLabel = (option: string | ScrollPickerOption) => {
	return isString(option) ? option : option.label
}

const isDisabled = (option: string | ScrollPickerOption) => {
	return !isString(option) && option.disabled
}

const isActive = (option: string | ScrollPickerOption) => {
	if (isString(option)) {
		return option === props.current
	}
	return option.value === props.current
}

const selectHandler = (option: string | ScrollPickerOption, event: MouseEvent) => {
	if (isDisabled(option)) {
		return
	}

	const value = isString(option) ? option : option.value
	emits('select', value, option, event)
}
</script>

<template>
	<div class="pixelium px-scroll-picker">
		<Scroll class="px-scroll-picker-scroll">
			<ul class="px-scroll-picker-list">
				<li
					v-for="option in normalizedOptions"
					:key="getOptionKey(option)"
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
