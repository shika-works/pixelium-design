<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue'
import { initScroll } from '../share/util/scroll'

import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import type { ScrollEvents, ScrollExpose, ScrollProps } from './type'
import { debounce, isNullish, isNumber, isObject } from 'parsnip-kit'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { inBrowser, inVitest } from '../share/util/env'
import type { OverlayScrollbars } from 'overlayscrollbars'

initScroll()

defineOptions({
	name: 'ScrollBar'
})

const props = defineProps<ScrollProps>()

const osRef = shallowRef<OverlayScrollbarsComponentRef>()

const emits = defineEmits<ScrollEvents>()

const [scrollOffset, updateScrollOffset] = useControlledMode<
	{ left?: number; top?: number },
	string,
	string
>('scrollOffset', props, emits, {
	transform(nextValue: { left?: number; top?: number } | null | undefined) {
		if (isNullish(nextValue)) {
			return { left: 0, top: 0 }
		} else {
			return {
				left: nextValue.left || 0,
				top: nextValue.top || 0
			}
		}
	},
	defaultField: 'defaultScrollOffset'
})

onMounted(() => {
	if (scrollOffset.value) {
		scrollTo(scrollOffset.value)
	}
})

watch(scrollOffset, () => {
	if (scrollOffset.value) {
		scrollTo({
			behavior: 'smooth',
			...scrollOffset.value
		})
	}
})

const showYScroll = ref(false)
const showXScroll = ref(false)

const initializeHandler = (ins: OverlayScrollbars) => {
	const state = ins.state()

	showXScroll.value = state.hasOverflow.x
	showYScroll.value = state.hasOverflow.y

	emits('initialize')
}

const updateScrollOffsetDebounce = debounce(updateScrollOffset, 100)

const scrollHandler = (_: any, event: Event) => {
	const target = event.target
	if (inBrowser() && target && target instanceof Element) {
		const { scrollLeft, scrollTop } = target
		updateScrollOffsetDebounce({
			left: scrollLeft,
			top: scrollTop
		})
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

defineExpose<ScrollExpose>({
	scrollBy,
	scrollTo
})

const updateHandler = (ins: OverlayScrollbars) => {
	const state = ins.state()
	showXScroll.value = state.hasOverflow.x
	showYScroll.value = state.hasOverflow.y

	const { scrollOffsetElement } = ins.elements()
	const { scrollLeft, scrollTop } = scrollOffsetElement
	updateScrollOffset({
		left: scrollLeft,
		top: scrollTop
	})

	emits('update')
}
</script>

<template>
	<OverlayScrollbarsComponent
		ref="osRef"
		:options="{
			scrollbars: {
				theme: 'px-scroll-theme',
				clickScroll: true
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
			'px-scroll__x': showXScroll,
			'px-scroll__y': showYScroll
		}"
	>
		<slot></slot>
	</OverlayScrollbarsComponent>
</template>

<style src="../share/style/index.css" />
<style lang="less" src="./index.less"></style>
