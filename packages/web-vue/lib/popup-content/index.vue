<template>
	<PopupPortal :root="props.root">
		<PopupWrapper
			:zIndex="props.zIndex"
			:visible="props.visible"
			:close-delay="props.animationDuration"
			:destroy-on-hide="props.destroyOnHide"
		>
			<Transition
				:name="'px-popup-content-fade__' + (popupFinalPlacement || popupRoughPlacement)"
				appear
			>
				<div
					ref="contentRef"
					v-show="props.visible"
					:class="{
						pixelium: true,
						'px-popup-content': true,
						'px-popup-content__arrow': !!props.arrow,
						[`px-popup-content__${popupFinalPlacement || popupRoughPlacement}`]: true,
						[`px-popup-content__${props.variant}`]: true
					}"
					:style="{
						...floatingStyles,
						visibility: show ? 'visible' : 'hidden',
						pointerEvents: show ? 'auto' : 'none',
						width: isNumber(contentWidth) ? `${contentWidth}px` : undefined,
						'--px-animation-duration': `${props.animationDuration}ms`,
						...props.contentStyle
					}"
					v-bind="$attrs"
					@mouseenter="contentMouseenterHandler"
					@mouseleave="contentMouseleaveHandler"
					@mousedown="contentMousedownHandler"
				>
					<slot name="content">
						{{ props.content }}
					</slot>
					<div class="px-popup-content-arrow" :style="arrowStyles" ref="arrowRef" />
					<canvas class="px-popup-content-canvas" ref="canvasRef" />
				</div>
			</Transition>
		</PopupWrapper>
	</PopupPortal>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, toRef, watch } from 'vue'
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { calcWhenLeaveBaseline } from '../share/util/plot'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { useDraw } from './draw'
import type { PopupContentEvents, PopupContentProps } from './type'
import { isNumber } from 'parsnip-kit'
import { inBrowser } from '../share/util/env'
import PopupWrapper from '../popup-wrapper/index.vue'
import PopupPortal from '../popup-portal/index.vue'
import { hasNoneDisplayAncestor } from '../share/util/dom'

const pixelSizeRef = usePixelSize()

defineOptions({
	name: 'PopupContent',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PopupContentProps>(), {
	placement: 'top',
	root: 'body',
	arrow: true,
	offset: 8,
	variant: 'light',
	visible: undefined,
	widthEqual: false,
	destroyOnHide: false,
	animationDuration: 250
})

const show = ref(false)

const contentRef = shallowRef<HTMLDivElement | null>(null)
const arrowRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const floatingStyles = ref<Record<string, string>>({})
const arrowStyles = ref<Record<string, string | undefined>>({})

const arrowXOffset = ref<number | undefined>(undefined)
const arrowYOffset = ref<number | undefined>(undefined)
const popupFinalPlacement = ref<'top' | 'bottom' | 'left' | 'right' | undefined>(undefined)

const popupRoughPlacement = computed<'top' | 'bottom' | 'left' | 'right'>(() => {
	const placement = props.placement.split('-')[0]
	return placement as 'top' | 'bottom' | 'left' | 'right'
})
const popupSide = computed<'start' | 'end' | 'middle'>(() => {
	const side = props.placement.split('-')[1]
	return (side || 'middle') as 'start' | 'end' | 'middle'
})

const contentWidth = ref<undefined | number>(undefined)

async function updatePosition(element: HTMLElement | SVGElement) {
	if (!inBrowser()) {
		return
	}
	if (!contentRef.value || !arrowRef.value || !canvasRef.value) return

	const contentComputedStyle = getComputedStyle(contentRef.value)
	const elementComputedStyle = getComputedStyle(element)

	if (hasNoneDisplayAncestor(element)) {
		return
	}

	const contentBorder =
		parseFloat(contentComputedStyle.borderLeftWidth) +
		parseFloat(contentComputedStyle.borderRightWidth)
	const addX = contentBorder / 2
	const addY =
		(parseFloat(contentComputedStyle.borderTopWidth) +
			parseFloat(contentComputedStyle.borderBottomWidth)) /
		2

	if (
		(popupRoughPlacement.value === 'top' || popupRoughPlacement.value === 'bottom') &&
		props.widthEqual
	) {
		const boxSizing = elementComputedStyle.boxSizing
		const contentBoxSizing = contentComputedStyle.boxSizing
		const padding =
			parseFloat(elementComputedStyle.paddingLeft) +
			parseFloat(elementComputedStyle.paddingRight)
		const contentPadding =
			parseFloat(contentComputedStyle.paddingLeft) +
			parseFloat(contentComputedStyle.paddingRight)
		const border =
			parseFloat(elementComputedStyle.borderLeftWidth) +
			parseFloat(elementComputedStyle.borderRightWidth)
		const width = parseFloat(elementComputedStyle.width)

		if (boxSizing === 'border-box') {
			if (contentBoxSizing === 'border-box') {
				contentWidth.value = width
			} else {
				contentWidth.value = width - contentPadding - contentBorder
			}
		} else {
			if (contentBoxSizing === 'border-box') {
				contentWidth.value = width + padding + border
			} else {
				contentWidth.value = width - contentPadding - contentBorder + padding + border
			}
		}
		await nextTick()
	} else {
		contentWidth.value = undefined
	}

	const pixelSize = pixelSizeRef.value

	const borderRadius = Math.max(props.borderRadius || pixelSize, pixelSize)

	const ds =
		Math.max(0, borderRadius - calcWhenLeaveBaseline(pixelSize, borderRadius) + pixelSize) +
		pixelSize

	const data = await computePosition(element, contentRef.value, {
		placement: props.placement,
		middleware: [
			offset(props.offset),
			shift(),
			flip(),
			arrow({ element: arrowRef.value, padding: ds })
		]
	})

	const { x, y, middlewareData, placement } = data
	floatingStyles.value = {
		left: `${x}px`,
		top: `${y}px`
	}

	const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {}

	popupFinalPlacement.value = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right'

	arrowStyles.value = {
		left: arrowX ? `${arrowX + addX}px` : undefined,
		top: arrowY ? `${arrowY + addY}px` : undefined
	}

	arrowXOffset.value = arrowX ? arrowX + addX : undefined
	arrowYOffset.value = arrowY ? arrowY + addY : undefined

	nextTick(() => {
		if (props.visible) {
			show.value = true
		}
	})
}

let closeTimer: any

async function closeHandler() {
	if (show.value === false) {
		return
	}
	closeTimer = setTimeout(() => {
		show.value = false
		popupFinalPlacement.value = undefined
	}, props.animationDuration)
}

const doOpen = () => {
	let element: HTMLElement | SVGElement | null = null
	if (props.target instanceof HTMLElement || props.target instanceof SVGElement) {
		element = props.target
	} else if (
		props.target &&
		(props.target.el instanceof HTMLElement || props.target.el instanceof SVGElement)
	) {
		element = props.target.el
	}
	if (!inBrowser()) {
		return
	}
	if (element) {
		updatePosition(element)
	}
}

const processVisible = (value: boolean) => {
	if (!inBrowser()) {
		return
	}
	if (closeTimer) {
		clearTimeout(closeTimer)
		closeTimer = null
	}
	if (value) {
		doOpen()
	} else {
		closeHandler()
	}
}

watch(
	() => props.visible,
	() => {
		updateRenderState()
	}
)

const emits = defineEmits<PopupContentEvents>()

const contentMouseenterHandler = (e: MouseEvent) => {
	emits('contentMouseenter', e)
}
const contentMouseleaveHandler = (e: MouseEvent) => {
	emits('contentMouseleave', e)
}

const updateRenderState = () => {
	processVisible(!!props.visible)
}

const contentMousedownHandler = (e: MouseEvent) => {
	emits('contentMousedown', e)
}

defineExpose({
	updateRenderState,
	content: contentRef
})

const darkMode = useDarkMode()
onMounted(() => {
	nextTick(() => {
		processVisible(!!props.visible)
	})
})

useDraw({
	wrapperRef: contentRef,
	canvasRef,
	darkMode,
	popupFinalPlacement,
	arrowXOffset,
	arrowYOffset,
	show,
	floatingStyles,
	variant: toRef(props, 'variant'),
	arrow: toRef(props, 'arrow'),
	popupSide,
	borderRadius: toRef(props, 'borderRadius')
})
</script>

<style lang="less" src="./index.less" />

<style src="../share/style/index.css" />
