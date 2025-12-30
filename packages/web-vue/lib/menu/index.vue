<script setup lang="tsx">
import {
	computed,
	getCurrentInstance,
	nextTick,
	onMounted,
	provide,
	ref,
	render,
	shallowRef,
	toRef,
	useId,
	useSlots,
	watch,
	withScopeId,
	type VNode
} from 'vue'
import type { MenuEvents, MenuProps, MenuProvide } from './type'
import { MENU_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { debounce, isArray, isNullish } from 'parsnip-kit'
import { flattenVNodes } from '../share/util/render'
import { useHiddenMeasure } from '../share/hook/use-hidden-measure'
import Submenu from '../submenu/index.vue'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useDarkMode } from '../share/hook/use-dark-mode'

defineOptions({
	name: 'Menu'
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

const id = useId()
let childrenVNode = undefined as VNode[] | undefined

const hiddenMeasureGetter = useHiddenMeasure('menu-' + id)
const latestMeasure = () => {
	const children = flattenVNodes(slots.default?.() || [])
	children.push(<Submenu index={ELLIPSIS} label="..."></Submenu>)
	const renderMeasure = () => {
		return (
			<ul
				class={[
					'px-menu',
					'pixelium',
					`px-menu__${props.direction}`,
					{ 'px-menu__collapsed': props.collapsed }
				]}
			>
				{children}
			</ul>
		)
	}
	return {
		render: renderMeasure,
		children
	}
}

const menuRef = shallowRef<HTMLUListElement | null>(null)

const hiddenRender = () => {
	const container = hiddenMeasureGetter()

	if (!container) {
		return
	}
	const { render: renderFunc, children } = latestMeasure()
	render(renderFunc(), container)
	childrenVNode = children
}
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
		hiddenRender()
		nextTick(() => {
			measure()
		})
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
	const renderMenu = () => {
		const children = flattenVNodes(slots.default?.() || [])
		const visibleChildren =
			props.direction === 'horizontal' && props.ellipsis
				? visibleIndex.value === -1
					? []
					: children.slice(0, visibleIndex.value + 1)
				: children
		const hiddenChildren =
			props.direction === 'horizontal' && props.ellipsis
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
				class={[
					'px-menu',
					'pixelium',
					`px-menu__${props.direction}`,
					{ 'px-menu__collapsed': props.collapsed },
					{ 'px-menu__dark': dark.value },
					{ 'px-menu__dark-theme': darkMode.value }
				]}
			>
				{visibleChildren}
			</ul>
		)
	}

	const res = scopeId ? withScopeId(scopeId)(renderMenu) : renderMenu
	return res()
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
