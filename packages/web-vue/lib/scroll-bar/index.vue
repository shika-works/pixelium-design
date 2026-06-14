<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { initScroll } from '../share/util/scroll'

import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import type { ScrollBarEvents, ScrollBarExpose, ScrollBarProps } from './type'
import { debounce, isArray, isNullish, isNumber, isObject, throttle } from 'parsnip-kit'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { inBrowser, inVitest } from '../share/util/env'
import type { OverlayScrollbars } from 'overlayscrollbars'
import { fillArr } from '../share/util/common'

initScroll()

defineOptions({
	name: 'ScrollBar'
})

const props = withDefaults(defineProps<ScrollBarProps>(), {
	showScrollPadding: true,
	variant: 'pixel',
	visible: true
})

const osRef = shallowRef<OverlayScrollbarsComponentRef>()

const emits = defineEmits<ScrollBarEvents>()

const transform = (nextValue: { left?: number; top?: number } | null | undefined) => {
	if (isNullish(nextValue)) {
		return { left: 0, top: 0 }
	} else {
		return {
			left: nextValue.left || 0,
			top: nextValue.top || 0
		}
	}
}
const [scrollOffset, updateScrollOffset] = useControlledMode<
	{ left?: number; top?: number },
	'scrollOffset',
	'defaultScrollOffset',
	typeof props
>('scrollOffset', props, emits, {
	transform,
	defaultField: 'defaultScrollOffset'
})

watch(scrollOffset, () => {
	scrollTo({
		behavior: 'smooth',
		...transform(scrollOffset.value)
	})
})

const showYScroll = ref(false)
const showXScroll = ref(false)

const scrollAreaSize = ref({ x: 0, y: 0 })
const visibleAreaSize = ref({ x: 0, y: 0 })
const innerScrollOffset = ref({ x: 0, y: 0 })

const initializeHandler = (ins: OverlayScrollbars) => {
	const state = ins.state()

	showXScroll.value = state.hasOverflow.x
	showYScroll.value = state.hasOverflow.y

	scrollTo({
		behavior: 'smooth',
		...transform(scrollOffset.value)
	})

	const { scrollOffsetElement } = ins.elements()
	const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollOffsetElement
	scrollAreaSize.value = {
		x: scrollWidth,
		y: scrollHeight
	}
	visibleAreaSize.value = {
		x: clientWidth,
		y: clientHeight
	}

	emits('initialize', ins)
}

const updateScrollOffsetDebounce = debounce(updateScrollOffset, 100)
const updateInnerScrollOffsetThrottle = throttle((x: number, y: number) => {
	innerScrollOffset.value = { x, y }
}, 0)

const scrollHandler = (_: any, event: Event) => {
	const target = event.target
	if (inBrowser() && target && target instanceof Element) {
		const { scrollLeft, scrollTop } = target
		updateScrollOffsetDebounce({
			left: scrollLeft,
			top: scrollTop
		})
		updateInnerScrollOffsetThrottle(scrollLeft, scrollTop)
	}

	emits('scroll', event)
}

type ScrollTo = {
	(options?: ScrollToOptions): void
	(x: number, y: number): void
}
type ScrollBy = {
	(options?: ScrollToOptions): void
	(x: number, y: number): void
}

const scrollTo: ScrollTo = (arg1?: ScrollToOptions | number, arg2?: number) => {
	if (!inBrowser() || inVitest()) {
		return
	}
	const osInstance = osRef?.value?.osInstance()

	if (!osInstance) {
		return
	}

	const { scrollOffsetElement } = osInstance.elements()
	if (isNumber(arg1) && isNumber(arg2)) {
		scrollOffsetElement.scrollTo(arg1, arg2)
	} else if (isObject(arg1)) {
		scrollOffsetElement.scrollTo(arg1)
	}
}
const scrollBy: ScrollBy = (arg1?: ScrollToOptions | number, arg2?: number) => {
	const osInstance = osRef?.value?.osInstance()

	if (!osInstance) {
		return
	}

	const { scrollOffsetElement } = osInstance.elements()

	if (isNumber(arg1) && isNumber(arg2)) {
		scrollOffsetElement.scrollBy(arg1, arg2)
	} else if (isObject(arg1)) {
		scrollOffsetElement.scrollBy(arg1)
	}
}

defineExpose<ScrollBarExpose>({
	scrollBy,
	scrollTo,
	get scrollHeight() {
		return osRef?.value?.osInstance()?.elements().scrollOffsetElement?.scrollHeight || 0
	},
	get scrollWidth() {
		return osRef?.value?.osInstance()?.elements().scrollOffsetElement?.scrollWidth || 0
	},
	get scrollLeft() {
		return osRef?.value?.osInstance()?.elements().scrollOffsetElement?.scrollLeft || 0
	},
	get scrollTop() {
		return osRef?.value?.osInstance()?.elements().scrollOffsetElement?.scrollTop || 0
	}
})

const updateHandler = (ins: OverlayScrollbars) => {
	const state = ins.state()
	showXScroll.value = state.hasOverflow.x
	showYScroll.value = state.hasOverflow.y

	const { scrollOffsetElement } = ins.elements()
	const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } =
		scrollOffsetElement

	updateScrollOffset({
		left: scrollLeft,
		top: scrollTop
	})
	scrollAreaSize.value = {
		x: scrollWidth,
		y: scrollHeight
	}
	visibleAreaSize.value = {
		x: clientWidth,
		y: clientHeight
	}

	emits('update', {
		left: scrollLeft,
		top: scrollTop
	})
}

const THRESHOLD = 4

const xAtEnd = computed(() => {
	const x = innerScrollOffset.value.x
	return x + visibleAreaSize.value.x >= scrollAreaSize.value.x - THRESHOLD
})
const xAtStart = computed(() => {
	const x = innerScrollOffset.value.x
	return x <= THRESHOLD
})
const yAtStart = computed(() => {
	const y = innerScrollOffset.value.y

	return y <= THRESHOLD
})
const yAtEnd = computed(() => {
	const y = innerScrollOffset.value.y
	return y + visibleAreaSize.value.y >= scrollAreaSize.value.y - THRESHOLD
})

const theme = computed(() => {
	return props.variant === 'simple' ? 'px-scroll-simple-theme' : 'px-scroll-theme'
})

const getPlacement = (value: boolean | boolean[] | undefined) => {
	if (!value) return fillArr(false, 4)
	if (!isArray(value)) {
		return fillArr(value, 4)
	}
	switch (value.length) {
		case 1:
			return fillArr(value[0], 4)
		case 2: {
			const t = value[0]
			const b = value[1]
			return [t, b, t, b]
		}
		case 3: {
			const t = value[0]
			const b = value[2]
			const rest = value[1]
			return [t, rest, b, rest]
		}
		default:
			return value
	}
}

const shouldShowMask = computed(() => {
	return getPlacement(props.edgeMask)
})
</script>

<template>
	<OverlayScrollbarsComponent
		ref="osRef"
		:options="{
			scrollbars: {
				theme: theme,
				clickScroll: true,
				visibility: props.visible ? 'auto' : 'hidden'
			}
		}"
		:events="{
			initialized: initializeHandler,
			scroll: scrollHandler,
			updated: updateHandler
		}"
		defer
		:class="{
			'px-scroll': true,
			'px-scroll__simple': props.variant === 'simple',
			'px-scroll__ghost': props.ghost,
			'px-scroll__x': props.showScrollPadding && showXScroll,
			'px-scroll__y': props.showScrollPadding && showYScroll
		}"
	>
		<slot></slot>
		<div
			class="px-scroll-mask px-scroll-mask__x-start"
			v-if="shouldShowMask[3] && !xAtStart"
			:style="{
				left: innerScrollOffset.x + 'px'
			}"
		></div>
		<div
			class="px-scroll-mask px-scroll-mask__y-start"
			v-if="shouldShowMask[0] && !yAtStart"
			:style="{
				top: innerScrollOffset.y + 'px'
			}"
		></div>
		<div
			class="px-scroll-mask px-scroll-mask__x-end"
			v-if="shouldShowMask[1] && !xAtEnd"
			:style="{
				left: innerScrollOffset.x + visibleAreaSize.x + 'px'
			}"
		></div>
		<div
			class="px-scroll-mask px-scroll-mask__y-end"
			v-if="shouldShowMask[2] && !yAtEnd"
			:style="{
				top: innerScrollOffset.y + visibleAreaSize.y + 'px'
			}"
		></div>
	</OverlayScrollbarsComponent>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
