<script setup lang="ts">
import { computed, inject, ref, useSlots } from 'vue'
import type { BreadcrumbItemProps } from './type'
import { BREADCRUMB_PROVIDE } from '../share/const/provide-key'
import type { BreadcrumbProvide } from '../breadcrumb/type'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { RouterLink } from 'vue-router'
import { BREADCRUMB_UPDATE } from '../share/const/event-bus-key'

defineOptions({
	name: 'BreadcrumbItem'
})

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
	disabled: false,
	clickable: true
})
const slots = useSlots()

const breadcrumbProvide = inject<BreadcrumbProvide | undefined>(BREADCRUMB_PROVIDE, undefined)

const [_0, _1, last] = breadcrumbProvide
	? useIndexOfChildren(BREADCRUMB_UPDATE + `-${breadcrumbProvide.id}`)
	: [ref(0), ref(false), ref(false)]

const renderAsText = computed(() => {
	return !props.clickable || (breadcrumbProvide?.renderLastText.value && last.value)
})

const linkClickHandler = (e: MouseEvent) => {
	if (props.disabled || !props.clickable) {
		e.preventDefault()
	}
}

const clickHandler = (e: MouseEvent) => {
	if (props.disabled || renderAsText.value) {
		return
	}
	breadcrumbProvide?.select(props.index, e)
}
</script>

<template>
	<li
		class="px-breadcrumb-item"
		:class="{
			'px-breadcrumb-item__disabled': props.disabled,
			'px-breadcrumb-item__cannot-click': renderAsText
		}"
		@click="clickHandler"
	>
		<RouterLink
			v-if="!renderAsText && props.route"
			:to="props.route"
			:target="props.target"
			class="px-breadcrumb-item-link"
			@click="linkClickHandler"
		>
			<div class="px-breadcrumb-item-icon-wrapper" v-if="slots.icon">
				<slot name="icon"></slot>
			</div>
			<slot>{{ props.label }}</slot>
		</RouterLink>
		<a
			v-else-if="!renderAsText && props.href"
			:href="props.href"
			:target="props.target"
			class="px-breadcrumb-item-link"
			@click="linkClickHandler"
		>
			<div class="px-breadcrumb-item-icon-wrapper" v-if="slots.icon">
				<slot name="icon"></slot>
			</div>
			<slot>{{ props.label }}</slot>
		</a>
		<span v-else class="px-breadcrumb-item-link">
			<div class="px-breadcrumb-item-icon-wrapper" v-if="slots.icon">
				<slot name="icon"></slot>
			</div>
			<slot>{{ props.label }}</slot>
		</span>
	</li>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
