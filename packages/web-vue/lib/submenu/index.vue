<template>
	<li
		class="px-submenu pixelium"
		:class="{
			'px-submenu__expanded': expanded,
			'px-submenu__active': active,
			'px-submenu__disabled': disabledComputed,
			'px-submenu__dark': !!menuProvide?.dark.value,
			'px-submenu__dark-theme': !!menuProvide?.darkMode.value,
			[`px-submenu__${modeComputed}`]: modeComputed
		}"
	>
		<template v-if="modeComputed === 'inline'">
			<div class="px-submenu-label" :tabindex="disabledComputed ? -1 : 0" @click="clickHandler">
				<div class="px-submenu-icon-wrapper" v-if="slots.icon">
					<slot name="icon"> </slot>
				</div>
				<slot name="label">{{ props.label }}</slot>
				<div class="px-submenu-arrow-icon-wrapper">
					<ChevronDown
						class="px-submenu-arrow-icon"
						:class="{
							'px-submenu-arrow-icon__expanded': expanded
						}"
					></ChevronDown>
				</div>
			</div>
			<ul
				v-show="showContent"
				class="px-submenu-list"
				ref="submenuListRef"
				:style="{
					maxHeight: maxHeight,
					paddingLeft: indentComputed + 'px'
				}"
			>
				<slot></slot>
			</ul>
		</template>
		<template v-else>
			<Popover
				:trigger="triggerComputed"
				:placement="placement"
				:arrow="false"
				:offset="4"
				:border-radius="0"
				:content-style="{
					padding: 0
				}"
				cascade
				v-model:visible="popoverVisible"
				:disabled="disabledComputed"
				v-bind="props.popoverProps"
			>
				<div class="px-submenu-label" :tabindex="disabledComputed ? -1 : 0">
					<div class="px-submenu-icon-wrapper" v-if="slots.icon">
						<slot name="icon"> </slot>
					</div>
					<slot name="label" v-if="!collapsedComputed">{{ props.label }}</slot>
					<div class="px-submenu-arrow-icon-wrapper" v-if="!collapsedComputed">
						<ChevronDown
							class="px-submenu-arrow-icon"
							:class="{
								[`px-submenu-arrow-icon__${menuProvide?.direction.value}`]:
									menuProvide?.direction.value,
								'px-submenu-arrow-icon__top': !submenuProvide
							}"
						></ChevronDown>
					</div>
				</div>
				<template #content>
					<ul class="px-submenu-list">
						<slot></slot>
					</ul>
				</template>
			</Popover>
		</template>
	</li>
</template>

<script setup lang="ts">
import {
	inject,
	computed,
	ref,
	provide,
	useSlots,
	shallowRef,
	useId,
	onMounted,
	watch
} from 'vue'
import type { MenuProvide } from '../menu/type'
import { SUBMENU_PROVIDE, MENU_PROVIDE } from '../share/const/provide-key'
import type { SubmenuProps, SubmenuProvide } from './type'
import { createProvideComputed } from '../share/util/reactivity'
import ChevronDown from '@hackernoon/pixel-icon-library/icons/SVG/regular/chevron-down.svg'
import Popover from '../popover/index.vue'
import { useExpand } from '../share/hook/use-expand'

const ANIMATION_DURATION = 250

const popoverVisible = ref(false)

const props = withDefaults(defineProps<SubmenuProps>(), {
	disabled: false,
	mode: undefined,
	trigger: undefined
})

defineOptions({
	name: 'Submenu'
})

const slots = useSlots()

const menuProvide = inject<MenuProvide | undefined>(MENU_PROVIDE, undefined)
const submenuProvide = inject<SubmenuProvide | undefined>(SUBMENU_PROVIDE, undefined)

const expanded = computed(() => menuProvide?.expanded.value?.includes(props.index))

const activeList = ref<
	{
		id: string
		status: boolean
	}[]
>([])
const active = computed(() => {
	return activeList.value.some((e) => e.status)
})

const disabledComputed = createProvideComputed('disabled', [submenuProvide, props], 'or')
const modeComputed = computed(() => {
	if (!submenuProvide && menuProvide) {
		if (menuProvide.direction.value === 'horizontal' || menuProvide.collapsed.value) {
			return 'popover'
		}
		return (props.mode ?? menuProvide.submenuMode.value) || 'inline'
	} else if (submenuProvide) {
		if (submenuProvide.mode.value === 'popover') {
			return 'popover'
		}
		return (props.mode ?? submenuProvide.mode.value) || 'inline'
	}
	return props.mode || 'inline'
})
const triggerComputed = computed(() => {
	if (!submenuProvide && menuProvide) {
		return props.trigger ?? menuProvide.submenuTrigger.value
	} else if (submenuProvide) {
		return props.trigger ?? submenuProvide.trigger.value
	}
	return props.trigger
})

const id = useId()
const setActive = (status: boolean, itemId: string) => {
	const entry = activeList.value.find((e) => itemId === e.id)
	if (entry) {
		entry.status = status
	} else {
		activeList.value.push({
			id: itemId,
			status
		})
	}

	submenuProvide?.setActive(
		activeList.value.some((e) => e.status),
		id
	)
}
const removeActive = (itemId: string) => {
	const idx = activeList.value.findIndex((e) => itemId === e.id)
	if (idx >= 0) {
		activeList.value.splice(idx, 1)
	}
}
const triggerUpdate = () => {
	popoverVisible.value = false
	submenuProvide?.triggerUpdate()
}
provide<SubmenuProvide>(SUBMENU_PROVIDE, {
	mode: modeComputed,
	trigger: triggerComputed,
	setActive,
	removeActive,
	triggerUpdate,
	disabled: disabledComputed
})

function clickHandler(e: MouseEvent) {
	if (disabledComputed.value) {
		return
	}
	menuProvide?.toggleOpenMenu(props.index, e)
}

const submenuListRef = shallowRef<HTMLUListElement | null>(null)
const [showContent, maxHeight] = useExpand(submenuListRef, expanded, ANIMATION_DURATION)

const placement = computed(() => {
	return menuProvide?.direction.value === 'horizontal'
		? submenuProvide
			? 'right-start'
			: 'bottom'
		: 'right-start'
})
const collapsedComputed = computed(() => {
	return !submenuProvide && menuProvide && menuProvide.collapsed.value
})

const indentComputed = computed(() => {
	return !collapsedComputed.value ? menuProvide?.indent.value || 0 : 0
})

onMounted(() => {
	if (!submenuProvide) {
		menuProvide?.updateRender()
	}
})
watch(
	() => slots,
	() => {
		if (!submenuProvide) {
			menuProvide?.updateRender()
		}
	},
	{ deep: true }
)
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
