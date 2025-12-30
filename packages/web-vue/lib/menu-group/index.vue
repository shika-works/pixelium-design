<template>
	<li class="px-menu-group pixelium">
		<div
			class="px-menu-group-label"
			v-if="shouldShow"
			:class="{
				'px-menu-group-label__collapsed': collapsedComputed,
				'px-menu-group-label__in-popover': inPopover,
				'px-menu-group-label__dark': !!menuProvide?.dark.value,
				'px-menu-group-label__dark-theme': !!menuProvide?.darkMode.value
			}"
		>
			<slot name="label">{{ props.label }}</slot>
		</div>
		<ul
			class="px-menu-group-list"
			:style="{
				paddingLeft: indentComputed + 'px',
				display: !shouldShow ? 'flex' : 'block'
			}"
		>
			<slot></slot>
		</ul>
	</li>
</template>
<script setup lang="ts">
import { inject, computed, onMounted, useSlots, watch } from 'vue'
import type { MenuProvide } from '../menu/type'
import { MENU_PROVIDE, SUBMENU_PROVIDE } from '../share/const/provide-key'
import type { SubmenuProvide } from '../submenu/type'
import type { MenuGroupProps } from './type'

defineOptions({
	name: 'MenuGroup'
})

const props = defineProps<MenuGroupProps>()

const menuProvide = inject<MenuProvide | undefined>(MENU_PROVIDE, undefined)
const submenuProvide = inject<SubmenuProvide | undefined>(SUBMENU_PROVIDE, undefined)

const shouldShow = computed(() => {
	return !!(menuProvide?.direction.value === 'vertical' || submenuProvide)
})

const collapsedComputed = computed(() => {
	return !submenuProvide && menuProvide && menuProvide?.collapsed.value
})
const indentComputed = computed(() => {
	return collapsedComputed.value ? 0 : !shouldShow.value ? 0 : menuProvide?.indent.value || 0
})

onMounted(() => {
	if (!submenuProvide) {
		menuProvide?.updateRender()
	}
})
const slots = useSlots()
watch(
	() => slots,
	() => {
		if (!submenuProvide) {
			menuProvide?.updateRender()
		}
	},
	{ deep: true }
)

const inPopover = computed(() => {
	return submenuProvide?.mode.value === 'popover'
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
