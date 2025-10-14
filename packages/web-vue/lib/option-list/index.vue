<template>
	<ul class="px-option-list">
		<template v-for="item in props.options" :key="getKey(item)">
			<li
				v-if="isString(item)"
				class="px-option-list-item"
				@click="(e: MouseEvent) => selectHandler(item, e)"
				:class="{
					'px-option-list-item__active': checkActive(item)
				}"
			>
				<slot name="option" :option="item">
					{{ item }}
				</slot>
			</li>
			<li
				v-else-if="isObject(item) && !('type' in item && item.type === GROUP_OPTION_TYPE)"
				class="px-option-list-item"
				:class="{
					'px-option-list-item__disabled': (item as OptionListOption).disabled,
					'px-option-list-item__active': checkActive(item as OptionListOption)
				}"
				@click="(e: MouseEvent) => selectObjectHandler(item as OptionListOption, e)"
			>
				<slot name="option" :option="item">
					{{ item.label }}
				</slot>
			</li>
			<li v-else class="px-option-list-item-group">
				<div class="px-option-list-item-group-label">
					<slot name="group-label" :option="item">{{ item.label }}</slot>
				</div>
				<template
					v-for="child in (item as OptionListGroupOption).children"
					:key="getKey(child)"
				>
					<li
						v-if="isString(child)"
						class="px-option-list-item"
						@click="(e: MouseEvent) => selectHandler(child, e)"
						:class="{
							'px-option-list-item__active': checkActive(child)
						}"
					>
						<slot name="option" :option="child">
							{{ child }}
						</slot>
					</li>
					<li
						v-else
						class="px-option-list-item"
						:class="{
							'px-option-list-item__disabled': (child as OptionListOption).disabled,
							'px-option-list-item__active': checkActive(child)
						}"
						@click="(e: MouseEvent) => selectObjectHandler(child as OptionListOption, e)"
					>
						<slot name="option" :option="child">
							{{ child.label }}
						</slot>
					</li>
				</template>
			</li>
		</template>
	</ul>
</template>
<script setup lang="ts">
import { isString, isObject } from 'parsnip-kit'
import type {
	OptionListGroupOption,
	OptionListEvent,
	OptionListOption,
	OptionListProps
} from './type'
import { GROUP_OPTION_TYPE } from '../share/const'

defineOptions({
	name: 'OptionList'
})

const props = withDefaults(defineProps<OptionListProps>(), {
	options: () => [],
	activeValues: () => []
})

const emits = defineEmits<OptionListEvent>()

const selectHandler = (value: any, e: MouseEvent) => {
	emits('select', value, value, e)
}

const selectObjectHandler = (option: OptionListOption, e: MouseEvent) => {
	if (option.disabled) {
		return
	}
	emits('select', option.value, option, e)
}

const getKey = (option: string | OptionListOption | OptionListGroupOption) => {
	if (isString(option)) {
		return option
	} else if ('type' in option && option.type === GROUP_OPTION_TYPE) {
		return option.key
	} else {
		return option.label
	}
}

const checkActive = (option: string | OptionListOption) => {
	if (!props.activeValues.length) {
		return false
	}
	if (isString(option)) {
		return props.activeValues.includes(option)
	}
	return props.activeValues.includes(option.value)
}
</script>
<style lang="less" src="./index.less"></style>
