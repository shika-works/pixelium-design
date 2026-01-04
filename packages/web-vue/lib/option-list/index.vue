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
import VirtualList from '../virtual-list/index.vue'
import type { JSX } from 'vue/jsx-runtime'
import Scroll from '../scroll/index.vue'

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

const isOptionListOption = (item: any): item is OptionListOption => {
	return isObject(item) && !('type' in item && item.type === GROUP_OPTION_TYPE)
}

const getKey = (option: string | OptionListOption | OptionListGroupOption) => {
	if (isString(option)) {
		return option
	} else if (isOptionListOption(option)) {
		return option.key ?? option.value
	} else {
		return option.key
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

const renderItem = (item: string | OptionListOption | OptionListGroupOption, child = false) => {
	const key = getKey(item)
	if (isString(item)) {
		return {
			el: (
				<li
					tabindex={0}
					key={key}
					class={{
						'px-option-list-item': true,
						'px-option-list-item__active': checkActive(item),
						'px-option-list-item__child': child
					}}
					onClick={(e: MouseEvent) => selectHandler(item, e)}
				>
					{slots.option ? slots.option({ option: item }) : item}
				</li>
			),
			key
		}
	} else if (isOptionListOption(item)) {
		return {
			el: (
				<li
					tabindex={item.disabled ? -1 : 0}
					key={key}
					class={{
						'px-option-list-item': true,
						'px-option-list-item__disabled': item.disabled,
						'px-option-list-item__active': checkActive(item),
						'px-option-list-item__child': child
					}}
					onClick={(e: MouseEvent) => selectObjectHandler(item, e)}
				>
					{slots.option ? slots.option({ option: item }) : item.label}
				</li>
			),
			key
		}
	} else {
		return [
			{
				el: (
					<li class="px-option-list-item-group" key={key}>
						<div class="px-option-list-item-group-label">
							{slots['group-label'] ? slots['group-label']({ option: item }) : item.label}
						</div>
					</li>
				),
				key
			},
			...item.children.map(
				(child): { el: JSX.Element; key: number | symbol | string } =>
					renderItem(child, true) as { el: JSX.Element; key: number | symbol | string }
			)
		]
	}
}

const renderList = () => {
	const list: {
		el: JSX.Element
		key: any
	}[] = []
	props.options
		.map((item) => renderItem(item))
		.forEach((rendered) => {
			if (Array.isArray(rendered)) {
				rendered.forEach((r) => list.push(r))
			} else {
				list.push(rendered)
			}
		})
	return (
		<ul class="px-option-list">
			<Scroll class="px-option-list-scroll">
				{!props.virtualScroll ? (
					list.map((item) => item.el)
				) : (
					<VirtualList
						class={'px-option-list-virtual-list'}
						list={list.map((item) => ({ render: () => item.el, key: item.key }))}
						{...props.virtualListProps}
					>
						{{
							'scroll-container': ({
								children,
								onScroll
							}: {
								children: JSX.Element
								onScroll: (event: Event) => void
							}) => (
								<Scroll class={'px-option-list-scroll'} onScroll={onScroll}>
									{children}
								</Scroll>
							)
						}}
					</VirtualList>
				)}
			</Scroll>
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
<style src="../share/style/index.css" />
