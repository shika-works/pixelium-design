<script setup lang="ts">
import { computed, inject, ref, shallowRef, useSlots, watch } from 'vue'
import type { ActionListItemEvents, ActionListItemProps } from './type'
import { ACTION_LIST_PROVIDE } from '../share/const/provide-key'
import type { ActionListProvide } from '../action-list/type'
import ChevronUp from '../chevron-up/index.vue'
import { useExpandTransition } from '../share/hook/use-expand-transition'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { isNullish, isNumber } from 'parsnip-kit'
import CheckSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-solid.svg'
import ExclaimationSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclaimation-solid.svg'
import MinusSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/minus-solid.svg'
import PauseSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/pause-solid.svg'
import RefreshSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/refresh-solid.svg'
import TimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-solid.svg'
import { ACTION_LIST_UPDATE } from '../share/const/event-bus-key.ts'
import { useIndexOfChildren } from '../share/hook/use-index-of-children.ts'

defineOptions({
	name: 'ActionListItem'
})

const props = withDefaults(defineProps<ActionListItemProps>(), {
	status: 'pending',
	ellipsis: false,
	expandable: true,
	animationDuration: 250
})

const emits = defineEmits<ActionListItemEvents>()

const slots = useSlots()

const actionListProvide = inject<ActionListProvide | undefined>(ACTION_LIST_PROVIDE, undefined)

const [_0, _1, last] = actionListProvide
	? useIndexOfChildren(ACTION_LIST_UPDATE + `-${actionListProvide.id}`)
	: [ref(0), ref(false), ref(false)]

const size = computed(() => actionListProvide?.size.value ?? 'medium')
const lineVariant = computed(
	() => props.lineVariant ?? actionListProvide?.lineVariant.value ?? 'solid'
)
const animationDuration = computed(
	() => actionListProvide?.animationDuration.value ?? props.animationDuration
)

const expandedComputed = computed(() =>
	(actionListProvide?.expandedIndices.value ?? []).includes(props.index)
)

const hasDetail = computed(() => {
	return !!props.detail || !!slots.detail
})

const isExpandable = computed(() => props.expandable && hasDetail.value)

const detailRef = shallowRef<HTMLDivElement | null>(null)
const detailBoxRef = shallowRef<HTMLDivElement | null>(null)

useExpandTransition(detailRef, detailBoxRef, expandedComputed, () => animationDuration.value)

const STATUS_ICON_MAP = {
	pending: PauseSolid,
	running: RefreshSolid,
	success: CheckSolid,
	warning: ExclaimationSolid,
	error: TimesSolid,
	skipped: MinusSolid
} as const

const statusIcon = computed(() => STATUS_ICON_MAP[props.status])

const spacingValue = computed(() => {
	return props.spacing ?? actionListProvide?.spacing.value
})

const spacing = computed(() => (!last.value ? spacingValue.value : undefined))

const rootStyle = computed(() => (props.color ? { color: props.color } : undefined))

const mainStyle = computed(() => {
	if (isNullish(spacing.value) || spacing.value === '') {
		return undefined
	}
	return {
		paddingBottom: isNumber(spacing.value) ? `${spacing.value}px` : spacing.value
	}
})

const headerRef = shallowRef<HTMLDivElement | null>(null)
const titleRef = shallowRef<HTMLDivElement | null>(null)

const titleOverflow = ref(false)

const measureTitleOverflow = () => {
	const header = headerRef.value
	const title = titleRef.value
	if (!props.ellipsis || !header || !title) {
		titleOverflow.value = false
		return
	}
	// While the content is shown the title keeps its intrinsic width, so an overflowing
	// header is what reveals that the title alone is too wide for the line.
	titleOverflow.value = titleOverflow.value
		? title.scrollWidth - title.clientWidth > 1
		: header.scrollWidth - header.clientWidth > 1
}

useResizeObserver(headerRef, measureTitleOverflow)
useResizeObserver(titleRef, measureTitleOverflow)

watch(
	[() => props.ellipsis, () => props.title, () => props.content, size, isExpandable],
	measureTitleOverflow,
	{ flush: 'post' }
)

const toggleHandler = () => {
	if (!isExpandable.value) {
		return
	}
	const next = !expandedComputed.value
	actionListProvide?.toggle(props.index)
	emits('expandedChange', next)
}
</script>

<template>
	<div
		class="pixelium px-action-list-item"
		:class="{
			[`px-action-list-item__${size}`]: true,
			[`px-action-list-item__${status}`]: true,
			[`px-action-list-item__line-${lineVariant}`]: true,
			'px-action-list-item__expandable': isExpandable,
			'px-action-list-item__expanded': expandedComputed,
			'px-action-list-item__ellipsis': ellipsis,
			'px-action-list-item__title-overflow': titleOverflow
		}"
		:style="rootStyle"
	>
		<div class="px-action-list-item-indicator">
			<div class="px-action-list-item-icon">
				<slot name="icon" :status="status">
					<component
						:class="{ 'px-animation__loading-clockwise': status === 'running' }"
						:is="statusIcon"
					></component>
				</slot>
			</div>
			<div class="px-action-list-item-line"></div>
		</div>
		<div class="px-action-list-item-main" :style="mainStyle">
			<div
				class="px-action-list-item-header"
				:style="{ transition: `margin-bottom ${animationDuration}ms` }"
				ref="headerRef"
				@click="toggleHandler"
			>
				<div class="px-action-list-item-title px-word-wrap" ref="titleRef">
					<slot name="title">{{ title }}</slot>
				</div>
				<div class="px-action-list-item-content px-word-wrap" v-if="slots.content || content">
					<slot name="content">{{ content }}</slot>
				</div>
				<ChevronUp
					v-if="isExpandable"
					class="px-action-list-item-arrow"
					:active="expandedComputed"
					:rotate="90"
					:active-rotate="180"
					:duration="animationDuration"
				/>
			</div>
			<div
				class="px-action-list-item-detail px-word-wrap"
				:class="{
					'px-action-list-item-detail__expanded': expandedComputed
				}"
				v-if="isExpandable"
				ref="detailRef"
			>
				<div class="px-action-list-item-detail-box" ref="detailBoxRef">
					<slot name="detail">{{ detail }}</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
