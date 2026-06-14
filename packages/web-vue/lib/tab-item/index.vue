<template>
	<div
		class="px-tab-item"
		:class="{
			'px-tab-item__active': active,
			'px-tab-item__disabled': props.disabled,
			[`px-tab-item__${variant}`]: !!variant,
			[`px-tab-item__has-prefix`]: !!tabsProvide?.hasPrefix.value,
			[`px-tab-item__has-suffix`]: !!tabsProvide?.hasSuffix.value,
			[`px-tab-item__has-add`]: !!tabsProvide?.creatable.value,
			[`px-tab-item__${tabsProvide?.justify.value}`]: !!tabsProvide?.justify.value,
			[`px-tab-item__${tabsProvide?.placement.value}`]: !!tabsProvide?.placement.value
		}"
		role="tab"
		:style="{
			maxWidth: tabsProvide?.tabMaxWidth.value || 'none',
			minWidth: tabsProvide?.tabMinWidth.value || 'none'
		}"
	>
		<div class="px-tab-item-pad"></div>
		<div
			class="px-tab-item-inner"
			@click="clickHandler"
			ref="wrapperRef"
			:class="{
				'px-word-wrap': tabsProvide?.isHorizontal.value
			}"
		>
			<IconWrapper
				v-if="slots.icon"
				class="px-tab-item-icon"
				:class="{
					'px-tab-item-icon__single': singleIcon
				}"
			>
				<slot name="icon"></slot>
			</IconWrapper>
			<slot name="title">
				{{ props.title }}
			</slot>
			<IconWrapper
				ref="closeRef"
				v-if="props.closable && !tabsProvide?.lastTab.value"
				:class="{
					'px-tab-item-close-icon__single': singleIcon
				}"
				class="px-tab-item-close-icon"
				active-color="var(--px-primary-6)"
				:disabled-color="variant === 'card' ? 'var(--px-neutral-7)' : 'var(--px-neutral-6)'"
				active-disabled-color="var(--px-primary-3)"
				color="var(--px-neutral-8)"
				press-color="var(--px-primary-7)"
				hover-color="var(--px-primary-5)"
				:disabled="props.disabled"
				:active="active"
				@click="closeHandler"
				size="mini"
			>
				<Times></Times>
			</IconWrapper>
			<canvas v-if="variant === 'card'" class="px-tab-item-canvas" ref="canvasRef"></canvas>
		</div>
		<div class="px-tab-item-pad"></div>
	</div>
</template>
<script setup lang="ts">
import { computed, inject, shallowRef, useSlots } from 'vue'
import type { TabItemProps } from './type'
import { TAB_PROVIDE } from '../share/const/provide-key'
import { type TabProvide } from '../tab/type'
import IconWrapper from '../icon-wrapper/index.vue'
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
import { useDraw } from './draw.ts'
import { wait } from 'parsnip-kit'

defineOptions({
	name: 'TabItem'
})

const props = withDefaults(defineProps<TabItemProps>(), {
	title: ''
})

const closeRef = shallowRef<null | InstanceType<typeof IconWrapper>>(null)

const tabsProvide = inject<TabProvide | null>(TAB_PROVIDE, null)

const active = computed(() => {
	return tabsProvide?.active.value === props.index
})
const slots = useSlots()

const closeHandler = (e: MouseEvent) => {
	if (props.disabled) {
		return
	}
	// Defer close until after click propagates, so clickHandler can detect
	// close-button clicks via closeRef and avoid selecting the closing tab.
	// Parent component handles reselection after removal.
	wait(0, () => {
		tabsProvide?.closeHandler(props.index, e)
	})
}
const clickHandler = (e: MouseEvent) => {
	if (props.disabled) {
		return
	}
	if (
		closeRef.value?.$el instanceof HTMLElement &&
		closeRef.value.$el.contains(e.target as Element)
	) {
		return
	}
	tabsProvide?.selectHandler(props.index, e)
}

const singleIcon = computed(() => {
	return (
		(slots.icon && !slots.title && !props.title && !props.closable) ||
		(props.closable && !slots.icon && !slots.title && !props.title)
	)
})

const variant = computed(() => {
	return tabsProvide?.variant.value || 'line'
})

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const pollSizeChange = computed(() => {
	return !!tabsProvide?.pollSizeChange
})
const placement = computed(() => {
	return tabsProvide?.placement.value || 'top'
})
useDraw(wrapperRef, canvasRef, {
	pollSizeChange,
	active,
	placement
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
