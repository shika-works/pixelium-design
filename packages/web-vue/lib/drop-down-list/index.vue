<script setup lang="tsx">
import { isString, isObject } from 'parsnip-kit'
import type {
	DropDownListGroupOption,
	DropDownListEvent,
	DropDownListOption,
	DropDownListProps
} from './type'
import { GROUP_OPTION_TYPE } from '../share/const'
import { getCurrentInstance, useSlots, withScopeId } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
import { RouterLink } from 'vue-router'

defineOptions({
	name: 'DropDownList'
})

const props = withDefaults(defineProps<DropDownListProps>(), {
	options: () => [],
})

const emits = defineEmits<DropDownListEvent>()

const selectHandler = (value: any, e: MouseEvent) => {
	emits('select', value, value, e)
}

const selectObjectHandler = (option: DropDownListOption, e: MouseEvent) => {
	if (option.disabled) {
		return
	}
	emits('select', option.index, option, e)
}

const isOptionListOption = (item: any): item is DropDownListOption => {
	return isObject(item) && !('type' in item && item.type === GROUP_OPTION_TYPE)
}

const getKey = (option: string | DropDownListOption | DropDownListGroupOption) => {
	if (isString(option)) {
		return option
	} else {
		return option.index
	}
}

const slots = useSlots()

const renderItem = (
	item: string | DropDownListOption | DropDownListGroupOption,
	child = false
): JSX.Element | JSX.Element[] => {
	const key = getKey(item)
	if (isString(item)) {
		return (
			<li
				tabindex={0}
				key={key}
				class={{
					'px-drown-list-item': true,
					'px-drown-list-item__child': child
				}}
				onClick={(e: MouseEvent) => selectHandler(item, e)}
			>
				<span class="px-drown-list-item-link">
					{slots.option ? slots.option({ option: item }) : item}
				</span>
			</li>
		)
	} else if (isOptionListOption(item)) {
		const arr = [
			<li
				tabindex={item.disabled ? -1 : 0}
				key={key}
				class={{
					'px-drown-list-item': true,
					'px-drown-list-item__disabled': item.disabled,
					'px-drown-list-item__child': child
				}}
				onClick={(e: MouseEvent) => selectObjectHandler(item, e)}
			>
				{item.route ? (
					<RouterLink
						class="px-drown-list-item-link"
						to={item.route}
						// @ts-ignore
						target={item.target}
						onClick={(e: MouseEvent) => linkClickHandler(item, e)}
					>
						{slots.option ? slots.option({ option: item }) : item.label}
					</RouterLink>
				) : item.href ? (
					<a
						class="px-drown-list-item-link"
						href={item.href}
						target={item.target}
						onClick={(e) => linkClickHandler(item, e)}
					>
						{slots.option ? slots.option({ option: item }) : item.label}
					</a>
				) : (
					<span class="px-drown-list-item-link">
						{slots.option ? slots.option({ option: item }) : item.label}
					</span>
				)}
			</li>
		]
		if (item.divider) {
			arr.unshift(<hr class="px-drown-list-divider" />)
		}
		return arr
	} else {
		return [
			<li class="px-drown-list-item-group" key={key}>
				<span class="px-drown-list-item-group-label">
					{slots['group-label'] ? slots['group-label']({ option: item }) : item.label}
				</span>
			</li>,
			...item.children.map(
				(child: string | DropDownListOption) => renderItem(child, true) as JSX.Element
			)
		]
	}
}

const linkClickHandler = (item: DropDownListOption, e: MouseEvent) => {
	if (item.disabled) {
		e.preventDefault()
	}
}

const renderList = () => {
	const list: JSX.Element[] = []
	props.options
		.map((item) => renderItem(item))
		.forEach((rendered) => {
			if (Array.isArray(rendered)) {
				rendered.forEach((r) => list.push(r))
			} else {
				list.push(rendered)
			}
		})
	return <ul class="px-drown-list">{list}</ul>
}

const instance = getCurrentInstance()

defineRender(() => {
	const scopeId = instance?.vnode.scopeId
	return scopeId ? withScopeId(scopeId)(renderList)() : renderList()
})
</script>
<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
