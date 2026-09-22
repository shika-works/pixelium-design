<script setup lang="ts">
import { computed, inject, ref, shallowRef, useSlots } from 'vue'
import type { TimelineItemProps } from './type'
import { TIMELINE_PROVIDE } from '../share/const/provide-key'
import { TIMELINE_UPDATE } from '../share/const/event-bus-key'
import type { TimelineProvide } from '../timeline/type'
import { useDraw } from './draw'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { isNumber } from 'parsnip-kit'

defineOptions({
	name: 'TimelineItem'
})

const props = withDefaults(defineProps<TimelineItemProps>(), {
	lineVariant: 'solid',
	theme: 'primary'
})

const slots = useSlots()

const timelineProvide = inject<TimelineProvide | undefined>(TIMELINE_PROVIDE, undefined)

const [_0, _1, last] = timelineProvide
	? useIndexOfChildren(TIMELINE_UPDATE + `-${timelineProvide.id}`)
	: [ref(0), ref(false), ref(false)]

const isHorizontal = computed(() => timelineProvide?.horizontal.value ?? false)
const contentPlacement = computed(() => timelineProvide?.contentPlacement.value ?? 'end')
const size = computed(() => timelineProvide?.size.value ?? 'medium')
const hasMark = computed(() => timelineProvide?.hasMark.value ?? false)
const smooth = computed(() => timelineProvide?.smooth.value ?? false)
const contentSpan = computed(() => timelineProvide?.contentSpan.value ?? 70)

const spacing = computed(() => props.spacing ?? timelineProvide?.spacing.value)

const spacingStyle = computed(() => {
	// The last item has no following item to be kept away from.
	if (last.value) {
		return undefined
	}
	const value = spacing.value
	if (value === undefined || value === null || value === '') {
		return undefined
	}
	const spacingValue = isNumber(value) ? `${value}px` : value
	return isHorizontal.value ? { paddingRight: spacingValue } : { paddingBottom: spacingValue }
})

const dotRef = shallowRef<HTMLDivElement | null>(null)
const dotCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

useDraw(dotRef, dotCanvasRef, props, {
	smoothComputed: smooth,
	pollSizeChangeComputed: computed(() => {
		return !!timelineProvide?.pollSizeChange
	})
})

const sectionOrder = computed(() => {
	return contentPlacement.value === 'end'
		? (['mark', 'indicator', 'content'] as const)
		: (['content', 'indicator', 'mark'] as const)
})

const contentFlexBasis = computed(() => `${contentSpan.value}%`)
const markFlexBasis = computed(() => `${100 - contentSpan.value}%`)

const themeColorVar = computed(() => {
	if (props.color) return props.color
	switch (props.theme) {
		case 'notice':
			return 'var(--px-notice-6)'
		case 'success':
			return 'var(--px-success-6)'
		case 'info':
			return 'var(--px-neutral-8)'
		case 'warning':
			return 'var(--px-warning-6)'
		case 'danger':
			return 'var(--px-danger-6)'
		case 'sakura':
			return 'var(--px-sakura-6)'
		default:
			return 'var(--px-primary-6)'
	}
})
</script>

<template>
	<div
		class="pixelium px-timeline-item"
		:class="{
			'px-timeline-item__horizontal': isHorizontal,
			'px-timeline-item__vertical': !isHorizontal,
			[`px-timeline-item__content-placement-${contentPlacement}`]: true,
			[`px-timeline-item__${props.lineVariant}`]: true,
			[`px-timeline-item__${size}`]: true
		}"
	>
		<div
			class="px-timeline-item-mark"
			v-if="hasMark"
			:style="[{ order: sectionOrder.indexOf('mark'), flexBasis: markFlexBasis }, spacingStyle]"
		>
			<slot name="mark">
				{{ mark }}
			</slot>
		</div>

		<div
			class="px-timeline-item-indicator"
			:style="{ order: sectionOrder.indexOf('indicator') }"
		>
			<div class="px-timeline-item-dot" ref="dotRef">
				<div class="px-timeline-item-icon" v-if="slots.icon" :style="{ color: themeColorVar }">
					<slot name="icon"></slot>
				</div>
				<canvas v-else class="px-timeline-item-dot-canvas" ref="dotCanvasRef"></canvas>
			</div>
			<div class="px-timeline-item-line"></div>
		</div>

		<div
			class="px-timeline-item-content"
			:style="[
				{ order: sectionOrder.indexOf('content'), flexBasis: contentFlexBasis },
				spacingStyle
			]"
		>
			<div class="px-timeline-item-header" v-if="slots.header || title">
				<slot name="header">
					{{ title }}
				</slot>
			</div>
			<div class="px-timeline-item-body" v-if="slots.default || content">
				<slot>{{ content }}</slot>
			</div>
			<div class="px-timeline-item-footer" v-if="slots.footer || footer">
				<slot name="footer">{{ footer }}</slot>
			</div>
		</div>
	</div>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
