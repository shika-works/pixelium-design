<script setup lang="ts">
import { computed, inject, shallowRef, useSlots } from 'vue'
import type { CollapseItemProps } from './type'
import { COLLAPSE_PROVIDE } from '../share/const/provide-key'
import type { CollapseProvide } from '../collapse/type'
import ChevronUp from '../chevron-up/index.vue'
import { useExpandTransition } from '../share/hook/use-expand-transition'
import { useDraw } from './draw'
import { useHover } from '../share/hook/use-hover'

defineOptions({
	name: 'CollapseItem'
})

const props = withDefaults(defineProps<CollapseItemProps>(), {
	disabled: false,
	destroyOnHide: false
})

const slots = useSlots()

const collapseProvide = inject<CollapseProvide | undefined>(COLLAPSE_PROVIDE, undefined)

const isActive = computed(() => {
	const activeIndices = collapseProvide?.activeIndices.value
	return activeIndices ? activeIndices.includes(props.index) : false
})

const disabledComputed = computed(() => {
	return collapseProvide?.disabled.value || props.disabled
})

const headerClickHandler = () => {
	if (disabledComputed.value) {
		return
	}
	collapseProvide?.toggle(props.index)
}
const animationDuration = computed(() => {
	return collapseProvide?.animationDuration.value || 0
})

const contentRef = shallowRef<HTMLDivElement | null>(null)
const contentWrapperRef = shallowRef<HTMLDivElement | null>(null)
const contentBoxRef = shallowRef<HTMLDivElement | null>(null)

const [showContent] = useExpandTransition(
	contentRef,
	contentBoxRef,
	isActive,
	() => animationDuration.value
)

const destroyOnHideComputed = computed(() => {
	return collapseProvide?.destroyOnHide.value || props.destroyOnHide
})

const headerRef = shallowRef<HTMLDivElement | null>(null)
const headerCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

const contentCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

const [isHover, mouseenterHandler, mouseleaveHandler] = useHover()

useDraw(
	headerRef,
	headerCanvasRef,
	contentWrapperRef,
	contentCanvasRef,
	slots,
	{
		isHover,
		disabled: disabledComputed
	},
	collapseProvide
)
</script>

<template>
	<div
		class="px-collapse-item"
		:class="{
			'px-collapse-item__active': isActive,
			'px-collapse-item__disabled': disabledComputed,
			[`px-collapse-item__${collapseProvide?.variant.value}`]: !!collapseProvide?.variant.value
		}"
	>
		<div
			class="px-collapse-item-header"
			:class="{
				'px-collapse-item-header__active': isActive,
				'px-collapse-item-header__disabled': disabledComputed
			}"
			@click="headerClickHandler"
			@mouseenter="mouseenterHandler"
			@mouseleave="mouseleaveHandler"
			ref="headerRef"
		>
			<canvas
				ref="headerCanvasRef"
				class="px-collapse-item-header-canvas"
				v-if="collapseProvide?.variant.value === 'card'"
			></canvas>
			<ChevronUp
				v-if="
					collapseProvide &&
					collapseProvide.showExpandIcon.value &&
					collapseProvide.expandIconPlacement.value === 'left'
				"
				class="px-collapse-item-arrow px-collapse-item-arrow__left"
				:active="isActive"
				:duration="animationDuration"
			/>
			<div v-if="slots.prefix" class="px-collapse-item-extra">
				<slot name="prefix"></slot>
			</div>
			<div class="px-collapse-item-title">
				<slot name="title">
					<span>{{ title }}</span>
				</slot>
			</div>
			<div v-if="slots.suffix" class="px-collapse-item-extra">
				<slot name="suffix"></slot>
			</div>
			<ChevronUp
				v-if="
					collapseProvide &&
					collapseProvide.showExpandIcon.value &&
					collapseProvide.expandIconPlacement.value === 'right'
				"
				class="px-collapse-item-arrow px-collapse-item-arrow__right"
				:active="isActive"
				:duration="animationDuration"
			/>
		</div>
		<div
			v-if="!(destroyOnHideComputed && !showContent)"
			v-show="showContent"
			class="px-collapse-item-content-wrapper"
			:class="{
				'px-collapse-item-content-wrapper__active': isActive
			}"
			:style="{
				transition: `margin ${animationDuration}ms`
			}"
			ref="contentWrapperRef"
		>
			<canvas
				ref="contentCanvasRef"
				class="px-collapse-item-content-canvas"
				v-if="collapseProvide?.variant.value === 'card'"
			></canvas>
			<div class="px-collapse-item-content" ref="contentRef">
				<div class="px-collapse-item-content-box" ref="contentBoxRef">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
