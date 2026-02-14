<template>
	<li
		class="px-menu-item pixelium"
		:class="{
			'px-menu-item__active': active,
			'px-menu-item__disabled': disabledComputed,
			'px-menu-item__collapsed': collapsedComputed,
			'px-menu-item__dark-theme': !!menuProvide?.darkMode.value,
			'px-menu-item__dark': !!menuProvide?.dark.value
		}"
		@click="clickHandler"
		:tabindex="disabledComputed ? -1 : 0"
	>
		<RouterLink
			class="px-menu-item-link"
			:to="props.route"
			:target="props.target"
			@click="linkClickHandler"
			v-if="props.route"
		>
			<div class="px-menu-item-icon-wrapper" v-if="slots.icon">
				<slot name="icon"> </slot>
			</div>
			<slot v-if="!collapsedComputed">{{ props.label }}</slot>
		</RouterLink>
		<a
			class="px-menu-item-link"
			:href="props.href"
			v-else-if="props.href"
			:target="props.target"
			@click="linkClickHandler"
		>
			<div class="px-menu-item-icon-wrapper" v-if="slots.icon">
				<slot name="icon"> </slot>
			</div>
			<slot v-if="!collapsedComputed">{{ props.label }}</slot>
		</a>
		<span class="px-menu-item-link" :href="props.href" v-else :target="props.target">
			<div class="px-menu-item-icon-wrapper" v-if="slots.icon">
				<slot name="icon"> </slot>
			</div>
			<slot v-if="!collapsedComputed">{{ props.label }}</slot>
		</span>
	</li>
</template>

<script setup lang="ts">
import { inject, computed, watch, useSlots, useId, onBeforeUnmount, onMounted } from 'vue'
import type { MenuItemProps } from './type'
import type { MenuProvide } from '../menu/type'
import { SUBMENU_PROVIDE, MENU_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
import type { SubmenuProvide } from '../submenu/type'
import { RouterLink } from 'vue-router'

defineOptions({
	name: 'MenuItem'
})

const props = withDefaults(defineProps<MenuItemProps>(), {
	disabled: false
})

const slots = useSlots()

const menuProvide = inject<MenuProvide | undefined>(MENU_PROVIDE, undefined)
const submenuProvide = inject<SubmenuProvide | undefined>(SUBMENU_PROVIDE, undefined)

const disabledComputed = createProvideComputed('disabled', [submenuProvide, props], 'or')
const active = computed(() => menuProvide?.active.value === props.index)

function clickHandler(e: MouseEvent) {
	if (props.disabled) return
	menuProvide?.selectMenu(props.index, e)
	submenuProvide?.triggerUpdate()
}

const id = useId()

watch(
	active,
	(val) => {
		submenuProvide?.setActive(val, id)
	},
	{ immediate: true }
)

onBeforeUnmount(() => {
	submenuProvide?.removeActive(id)
})

const collapsedComputed = computed(() => {
	return !submenuProvide && menuProvide && menuProvide?.collapsed.value
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

const linkClickHandler = (e: MouseEvent) => {
	if (props.disabled) {
		e.preventDefault()
	}
}
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
