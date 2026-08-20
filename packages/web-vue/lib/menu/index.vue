<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	mergeProps,
	nextTick,
	onMounted,
	provide,
	ref,
	shallowRef,
	toRef,
	useAttrs,
	useSlots,
	watch,
	withScopeId,
	type VNode,
	Comment
} from 'vue'
import type {
	MenuEvents,
	MenuGroupOption,
	MenuOption,
	MenuProps,
	MenuProvide,
	SubmenuOption
} from './type'
import { MENU_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { debounce, isArray, isNullish, isObject, isString } from 'parsnip-kit'
import { flattenVNodes } from '../share/util/render'
import MeasureLayer from './measure-layer.vue'
import Submenu from '../submenu/index.vue'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useDarkMode } from '../share/hook/use-dark-mode'
import MenuItem from '../menu-item/index.vue'
import MenuGroup from '../menu-group/index.vue'
import { GROUP_OPTION_TYPE } from '../share/const'

defineOptions({
	name: 'Menu',
	inheritAttrs: false
})

const props = withDefaults(defineProps<MenuProps>(), {
	direction: 'vertical',
	collapsed: false,
	menuGroupTrigger: 'hover',
	menuGroupMode: 'inline',
	indent: 16,
	ellipsis: true,
	dark: false
})

const emits = defineEmits<MenuEvents>()

const attrs = useAttrs()

const [active, updateActive] = useControlledMode('active', props, emits, {
	defaultField: 'defaultActive'
})
const [expanded, updateExpanded] = useControlledMode('expanded', props, emits, {
	defaultField: 'defaultExpanded',
	transform: (key: any) => {
		return isArray(key) ? key : isNullish(key) ? [] : [key]
	}
})

async function selectMenu(key: number | string | symbol, event: MouseEvent) {
	await updateActive(key)
	emits('select', key, event)
}
async function toggleOpenMenu(key: number | string | symbol, event: MouseEvent) {
	const newExpanded = expanded.value ? [...expanded.value] : []
	const index = newExpanded.indexOf(key)
	if (index > -1) {
		newExpanded.splice(index, 1)
	} else {
		newExpanded.push(key)
	}
	await updateExpanded(newExpanded)

	emits('expandChange', newExpanded, event)
	if (index > -1) {
		emits('fold', key, event)
	} else {
		emits('expand', key, event)
	}
}

const updateRender = () => {
	if (props.direction === 'horizontal' && props.ellipsis) {
		hiddenMeasure()
	}
}

const darkMode = useDarkMode()
const dark = computed(() => {
	return props.dark
})

provide<MenuProvide>(MENU_PROVIDE, {
	direction: toRef(props, 'direction'),
	active,
	expanded,
	collapsed: toRef(props, 'collapsed'),
	selectMenu,
	toggleOpenMenu,
	submenuMode: toRef(props, 'submenuMode'),
	submenuTrigger: toRef(props, 'submenuTrigger'),
	indent: toRef(props.indent),
	updateRender,
	dark,
	darkMode
})

watch(
	() => props.collapsed,
	(value) => {
		if (value) {
			updateExpanded([])
		}
	}
)

const ELLIPSIS = 'px-ellipsis'

const slots = useSlots()
const instance = getCurrentInstance()

const visibleIndex = ref(-1)

let childrenVNode = undefined as VNode[] | undefined

const isMenuOption = (
	arg: string | MenuOption | MenuGroupOption | SubmenuOption
): arg is MenuOption => {
	return isObject(arg) && !(arg as any).type
}
const isMenuGroupOption = (
	arg: string | MenuOption | MenuGroupOption | SubmenuOption
): arg is MenuGroupOption => {
	return isObject(arg) && (arg as any).type === GROUP_OPTION_TYPE
}

const renderOption = (option: string | MenuOption | MenuGroupOption | SubmenuOption) => {
	if (isString(option)) {
		return <MenuItem index={option} key={option} label={option}></MenuItem>
	} else if (isMenuOption(option)) {
		return (
			<MenuItem
				index={option.index}
				key={option.index}
				label={option.label}
				href={option.href}
				route={option.route}
				disabled={option.disabled}
				target={option.target}
			>
				{{
					icon: option.icon
				}}
			</MenuItem>
		)
	} else if (isMenuGroupOption(option)) {
		return (
			<MenuGroup key={option.index} label={option.label}>
				{{
					default: () => renderOptions(option.children)
				}}
			</MenuGroup>
		)
	} else {
		return (
			<Submenu
				index={option.index}
				key={option.index}
				label={option.label}
				disabled={option.disabled}
			>
				{{
					default: () => renderOptions(option.children),
					icon: option.icon
				}}
			</Submenu>
		)
	}
}

const renderOptions = (options: (string | MenuOption | MenuGroupOption | SubmenuOption)[]) => {
	return options.map((e) => renderOption(e))
}

const renderMenuChildren = () => {
	const children = flattenVNodes(slots.default?.() || []).filter((e) => e.type !== Comment)

	if (!children.length && isArray(props.options)) {
		return renderOptions(props.options)
	}
	return children
}

const menuClass = computed(() => {
	const classes = ['px-menu', 'pixelium', `px-menu__${props.direction}`]
	if (props.collapsed) {
		classes.push('px-menu__collapsed')
	}
	if (dark.value) {
		classes.push('px-menu__dark')
	}
	if (darkMode.value) {
		classes.push('px-menu__dark-theme')
	}
	return classes
})

const menuRef = shallowRef<HTMLUListElement | null>(null)
const measure = () => {
	if (!menuRef.value || !childrenVNode) {
		return
	}
	let width = menuRef.value.clientWidth
	const list = [...childrenVNode]
	const endIdx = list.findIndex((e) => e.props?.index === ELLIPSIS)
	if (endIdx === -1) {
		visibleIndex.value = list.length - 1
		return
	}
	const endVNode = list.splice(endIdx, 1)[0]
	if (!endVNode || !endVNode.el) {
		visibleIndex.value = list.length - 1
		return
	}

	const endVNodeEl = endVNode.el as HTMLElement

	width -= endVNodeEl.clientWidth
	let i = 0
	for (; i < list.length; i++) {
		const el = list[i].el as HTMLElement
		const curWidth = el.clientWidth

		if (width < curWidth) {
			break
		}
		width -= curWidth
	}
	visibleIndex.value = i - 1
}

const hiddenMeasureImmediate = () => {
	nextTick(() => {
		measure()
	})
}
const hiddenMeasure = debounce(hiddenMeasureImmediate, 150)
onMounted(() => {
	setTimeout(() => {
		if (props.direction === 'horizontal' && props.ellipsis) {
			hiddenMeasureImmediate()
		}
	})
})
watch([() => props.indent, () => props.ellipsis, () => props.direction], () => {
	if (props.direction === 'horizontal' && props.ellipsis) {
		hiddenMeasure()
	}
})
useResizeObserver(menuRef, () => {
	nextTick(() => {
		if (props.direction === 'horizontal' && props.ellipsis) {
			measure()
		}
	})
})

defineRender(() => {
	const scopeId = instance?.vnode.scopeId
	const isMeasure = props.direction === 'horizontal' && props.ellipsis
	const renderMenu = () => {
		const children = renderMenuChildren()
		const measureChildren = isMeasure
			? [
					...renderMenuChildren(),
					<Submenu key={ELLIPSIS} index={ELLIPSIS} label="..."></Submenu>
				]
			: undefined
		childrenVNode = measureChildren

		const visibleChildren = isMeasure
			? visibleIndex.value === -1
				? []
				: children.slice(0, visibleIndex.value + 1)
			: children
		const hiddenChildren = isMeasure
			? visibleIndex.value === -1
				? children
				: children.slice(visibleIndex.value + 1)
			: []
		if (hiddenChildren.length) {
			visibleChildren.push(
				<Submenu index={ELLIPSIS} label="...">
					{{
						default: () => hiddenChildren
					}}
				</Submenu>
			)
		}
		return (
			<ul
				ref={menuRef}
				role="menu"
				aria-orientation={props.direction === 'horizontal' ? 'horizontal' : 'vertical'}
				{...mergeProps({ class: menuClass.value }, attrs)}
			>
				{visibleChildren}
			</ul>
		)
	}

	const res = scopeId ? withScopeId(scopeId)(renderMenu) : renderMenu

	return (
		<>
			{res()}
			{isMeasure && <MeasureLayer classes={menuClass.value}>{childrenVNode}</MeasureLayer>}
		</>
	)
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
