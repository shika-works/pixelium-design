<template>
	<div class="pixelium px-carousel">
		<div
			ref="viewportRef"
			class="px-carousel-viewport"
			:style="{
				height: `${contentItemHeight}px`
			}"
		>
			<div
				class="px-carousel-track"
				:style="{ transform: `translateX(${viewportWidth - offset}px)` }"
			>
				<div
					v-for="i in contentItemCount"
					:key="i"
					:ref="(el) => setGroupRef(el, i)"
					class="px-carousel-content-wrapper"
					:style="{
						marginRight: i < contentItemCount ? `${itemMargin}px` : undefined
					}"
				>
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import type { CarouselExpose, CarouselProps } from './type'
import { useResizeObserver } from '../share/hook/use-resize-observer'

defineOptions({
	name: 'Carousel'
})

const props = withDefaults(defineProps<CarouselProps>(), {
	autoFill: false,
	speed: 100
})

const viewportRef = shallowRef<HTMLElement | null>(null)
const contentItemElementRef = shallowRef<HTMLElement | null>(null)

const viewportWidth = ref(0)
const contentItemWidth = ref(0)
const contentItemHeight = ref(0)

const contentItemCount = ref(3)

const itemMargin = ref(0)

const offset = ref(0)

const setGroupRef = (el: unknown, index: number) => {
	if (index !== 1) return
	contentItemElementRef.value = el instanceof HTMLElement ? el : null
}

const calcOffset = () => {
	if (props.autoFill) {
		return (contentItemCount.value - 1) * contentItemWidth.value
	} else {
		return (contentItemWidth.value + itemMargin.value) * 2
	}
}

const measure = () => {
	const viewportElement = viewportRef.value
	const contentItemElement = contentItemElementRef.value

	const nextViewportWidth = viewportElement?.clientWidth ?? 0
	const nextContentItemWidth = contentItemElement?.clientWidth ?? 0
	const nextContentItemHeight = contentItemElement?.clientHeight ?? 0

	viewportWidth.value = nextViewportWidth
	contentItemWidth.value = nextContentItemWidth
	contentItemHeight.value = nextContentItemHeight

	if (nextContentItemWidth === 0 || nextContentItemWidth == 0) {
		contentItemCount.value = 3
		itemMargin.value = 0
		return
	}

	if (props.autoFill) {
		contentItemCount.value =
			Math.max(2, Math.ceil(nextViewportWidth / nextContentItemWidth)) + 1
		itemMargin.value = 0
	} else {
		contentItemCount.value = 3
		itemMargin.value = Math.max(nextViewportWidth - nextContentItemWidth, 0)
	}
	offset.value = calcOffset()
}

let rafId: number | null = null
let lastTs: number | null = null
let running = false

const tick = (ts: number) => {
	if (!running) return
	const resetPoint = !props.autoFill
		? (contentItemWidth.value + itemMargin.value) * 2
		: (contentItemCount.value - 1) * contentItemWidth.value
	const resetTarget = !props.autoFill
		? contentItemWidth.value + itemMargin.value
		: (contentItemCount.value - 2) * contentItemWidth.value

	if (resetPoint > 0) {
		if (lastTs !== null) {
			offset.value += Math.max(0, props.speed) * ((ts - lastTs) / 1000)
			if (offset.value >= resetPoint) {
				offset.value = resetTarget
			}
		}
	} else {
		offset.value = 0
	}
	lastTs = ts
	rafId = requestAnimationFrame(tick)
}

const resume = () => {
	if (running) return
	running = true
	lastTs = null
	rafId = requestAnimationFrame(tick)
}

const pause = () => {
	running = false
	lastTs = null
	if (rafId !== null) {
		cancelAnimationFrame(rafId)
		rafId = null
	}
}

const reset = () => {
	measure()
	resume()
	offset.value = calcOffset()
}

defineExpose<CarouselExpose>({
	resume,
	pause,
	reset,
	measure
})

useResizeObserver(viewportRef, measure)
useResizeObserver(contentItemElementRef, measure)

watch(
	() => props.autoFill,
	() => {
		measure()
	}
)

onMounted(() => {
	nextTick(() => {
		measure()
		resume()
	})
})

onUnmounted(() => {
	pause()
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
