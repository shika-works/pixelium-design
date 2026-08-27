<script setup lang="ts">
import { computed, inject, ref, shallowRef, useSlots } from 'vue'
import type { CollapseItemProps } from './type'
import { COLLAPSE_PROVIDE } from '../share/const/provide-key'
import type { CollapseProvide } from '../collapse/type'
import ChevronUp from '@hackernoon/pixel-icon-library/icons/SVG/regular/chevron-up.svg'
import { debounce } from 'parsnip-kit'
import { watch } from 'vue'
import { useResizeObserver } from '../share/hook/use-resize-observer'
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

const contentWrapperRef = shallowRef<HTMLDivElement | null>(null)
const contentWrapperHeight = ref(0)

let closeTimer = null as any

const displayContent = ref(!!isActive.value)
const transitionEnabled = ref(false)

const setContentHeight = () => {
	if (contentWrapperRef.value) {
		contentWrapperHeight.value = contentWrapperRef.value.clientHeight
	}
}

const activeHandler = (state: boolean) => {
	if (!state) {
		contentWrapperHeight.value = 0
		closeTimer = setTimeout(() => {
			displayContent.value = false
			clearTimeout(closeTimer)
			closeTimer = null
		}, animationDuration.value)
	} else {
		setContentHeight()
	}
}
const activeHandlerDebounce = debounce(activeHandler, 50)
watch(isActive, (val) => {
	transitionEnabled.value = true
	if (closeTimer) {
		clearTimeout(closeTimer)
		closeTimer = null
	}
	displayContent.value = true
	activeHandlerDebounce(val)
})
useResizeObserver(contentWrapperRef, setContentHeight)

const destroyOnHideComputed = computed(() => {
	return collapseProvide?.destroyOnHide.value || props.destroyOnHide
})

const headerRef = shallowRef<HTMLDivElement | null>(null)
const headerCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

const contentRef = shallowRef<HTMLDivElement | null>(null)
const contentCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

const [isHover, mouseenterHandler, mouseleaveHandler] = useHover()

useDraw(
	headerRef,
	headerCanvasRef,
	contentRef,
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
			<div
				v-if="
					collapseProvide &&
					collapseProvide.showExpandIcon.value &&
					collapseProvide.expandIconPlacement.value === 'left'
				"
				class="px-collapse-item-arrow px-collapse-item-arrow__left"
				:class="{ 'px-collapse-item-arrow__active': isActive }"
				:style="{
					transition: `${animationDuration}ms`
				}"
			>
				<ChevronUp />
			</div>
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
			<div
				v-if="
					collapseProvide &&
					collapseProvide.showExpandIcon.value &&
					collapseProvide.expandIconPlacement.value === 'right'
				"
				class="px-collapse-item-arrow px-collapse-item-arrow__right"
				:class="{ 'px-collapse-item-arrow__active': isActive }"
				:style="{
					transition: `${animationDuration}ms`
				}"
			>
				<ChevronUp />
			</div>
		</div>
		<div
			v-if="!(destroyOnHideComputed && !displayContent)"
			v-show="displayContent"
			class="px-collapse-item-content-wrapper"
			:class="{
				'px-collapse-item-content-wrapper__active': isActive
			}"
			:style="{
				transition: `margin ${animationDuration}ms`
			}"
			ref="contentRef"
		>
			<canvas
				ref="contentCanvasRef"
				class="px-collapse-item-content-canvas"
				v-if="collapseProvide?.variant.value === 'card'"
			></canvas>
			<div
				class="px-collapse-item-content"
				:style="{
					height: `${contentWrapperHeight || 0}px`,
					transition: transitionEnabled ? `height ${animationDuration}ms` : 'none'
				}"
				ref="contentRef"
			>
				<div class="px-collapse-item-content-box" ref="contentWrapperRef">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
