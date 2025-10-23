<script setup lang="tsx">
import { isString, isObject } from 'parsnip-kit'
import type {
	OptionListGroupOption,
	OptionListEvent,
	OptionListOption,
	OptionListProps
} from './type'
import { GROUP_OPTION_TYPE } from '../share/const'
import { getCurrentInstance, useSlots, withScopeId } from 'vue'
import { VirtualList } from '..'

defineOptions({
	name: 'OptionList'
})

const props = withDefaults(defineProps<OptionListProps>(), {
	options: () => [],
	activeValues: () => [],
	virtualScroll: false
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

const slots = useSlots()

const isOptionListOption = (item: any): item is OptionListOption => {
	return isObject(item) && !('type' in item && item.type === GROUP_OPTION_TYPE)
}

const renderItem = (item: string | OptionListOption | OptionListGroupOption) => {
	if (isString(item)) {
		return (
			<li
				key={getKey(item)}
				class={{
					'px-option-list-item': true,
					'px-option-list-item__active': checkActive(item)
				}}
				onClick={(e: MouseEvent) => selectHandler(item, e)}
			>
				{slots.option ? slots.option({ option: item }) : item}
			</li>
		)
	} else if (isOptionListOption(item)) {
		return (
			<li
				key={getKey(item)}
				class={{
					'px-option-list-item': true,
					'px-option-list-item__disabled': item.disabled,
					'px-option-list-item__active': checkActive(item)
				}}
				onClick={(e: MouseEvent) => selectObjectHandler(item, e)}
			>
				{slots.option ? slots.option({ option: item }) : item.label}
			</li>
		)
	} else {
		return (
			<li class="px-option-list-item-group" key={getKey(item)}>
				<div class="px-option-list-item-group-label">
					{slots['group-label'] ? slots['group-label']({ option: item }) : item.label}
				</div>
				{item.children.map((child) => renderItem(child))}
			</li>
		)
	}
}

const renderList = () => {
	return (
		<ul class="px-option-list">
			{props.virtualScroll ? (
				props.options.map((item) => renderItem(item))
			) : (
				<VirtualList
					list={props.options.map((item) => ({
						render: () => renderItem(item),
						key: getKey(item)
					}))}
					{...props.virtualListProps}
				></VirtualList>
			)}
		</ul>
	)
}

const instance = getCurrentInstance()

defineRender(() => {
	const scopeId = instance?.vnode.scopeId
	return scopeId ? withScopeId(scopeId)(renderList)() : renderList()
})
</script>
<style lang="less" src="./index.less"></style>
