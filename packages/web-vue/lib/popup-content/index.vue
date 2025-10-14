<template>
	<Teleport :to="props.root || 'body'">
		<Transition :name="'px-popup-content-fade__' + popupRoughPlacement">
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
					zIndex: props.zIndex ?? currentZIndex,
					width: isNumber(contentWidth) ? `${contentWidth}px` : undefined,
					...props.contentStyle
				}"
				v-bind="$attrs"
				@mouseenter="contentMouseenterHandler"
				@mouseleave="contentMouseleaveHandler"
			>
				<slot name="content">
					{{ props.content }}
				</slot>
				<div class="px-popup-content-arrow" :style="arrowStyles" ref="arrowRef" />
				<canvas class="px-popup-content-canvas" ref="canvasRef" />
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { BORDER_CORNER_RAD_RANGE } from '../share/const'
import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom'
import {
	calcBorderCornerCenter,
	calcPixelSize,
	calcWhenLeaveBaseline,
	canvasPreprocess,
	floodFill
} from '../share/util/plot'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { fillArr } from '../share/util/common'
import { drawArrow, drawBorder, getBackgroundColor, getBorderColor } from './draw'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import type { PopupContentEvents, PopupContentProps } from './type'
import { isNumber } from 'parsnip-kit'
import { useZIndex } from '../share/hook/use-z-index'

defineOptions({
	name: 'PopupContent'
})

const props = withDefaults(defineProps<PopupContentProps>(), {
	placement: 'top',
	root: 'body',
	arrow: true,
	offset: 8,
	variant: 'light',
	visible: undefined,
	widthEqual: false
})
const [currentZIndex, next] = useZIndex('popup')

const ANIMATION_DURATION = 250

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

async function updatePosition(element: HTMLElement) {
	if (!contentRef.value || !arrowRef.value || !canvasRef.value) return

	const contentComputedStyle = getComputedStyle(contentRef.value)
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
		const elementComputedStyle = getComputedStyle(element)
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

	const pixelSize = calcPixelSize()

	const borderRadius = Math.max(props.borderRadius || pixelSize, pixelSize)

	const ds = Math.max(
		0,
		borderRadius - calcWhenLeaveBaseline(pixelSize, borderRadius) + pixelSize
	)

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

async function openHandler(element: HTMLElement) {
	setTimeout(() => {
		updatePosition(element)
	})
}

async function closeHandler() {
	setTimeout(() => {
		show.value = false
		popupFinalPlacement.value = undefined
	}, ANIMATION_DURATION)
}

const processVisible = (value: boolean) => {
	if (value) {
		next()
		if (props.target instanceof HTMLElement) {
			openHandler(props.target)
		} else if (props.target && props.target.el instanceof HTMLElement) {
			openHandler(props.target.el)
		}
	} else {
		closeHandler()
	}
}

watch(
	() => props.visible,
	(val) => {
		processVisible(!!val)
	}
)

const emits = defineEmits<PopupContentEvents>()

const contentMouseenterHandler = (e: MouseEvent) => {
	emits('contentMouseenter', e)
}
const contentMouseleaveHandler = (e: MouseEvent) => {
	emits('contentMouseleave', e)
}

defineExpose({
	updateRenderState: () => {
		nextTick(() => {
			processVisible(!!props.visible)
		})
	},
	content: contentRef
})

const darkMode = useDarkMode()
onMounted(() => {
	nextTick(() => {
		drawPixel()
		processVisible(!!props.visible)
	})
})
watch(
	[
		darkMode,
		popupFinalPlacement,
		arrowXOffset,
		arrowYOffset,
		show,
		() => props.variant,
		() => props.arrow
	],
	() => {
		drawPixel()
	}
)
const drawPixel = () => {
	if (!popupFinalPlacement.value) {
		return
	}

	const preprocessData = canvasPreprocess(contentRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const pixelSize = calcPixelSize()

	const borderRadius = fillArr(Math.max(props.borderRadius || pixelSize, pixelSize), 4)

	const offset = props.arrow ? pixelSize * 3 : 0
	const offsetX =
		popupFinalPlacement.value === 'left' || popupFinalPlacement.value === 'right' ? offset : 0
	const offsetY =
		popupFinalPlacement.value === 'top' || popupFinalPlacement.value === 'bottom' ? offset : 0

	const borderColor = getBorderColor(props.variant)
	const center = calcBorderCornerCenter(
		borderRadius,
		width,
		height,
		pixelSize,
		offsetX,
		offsetY
	)
	const rad = BORDER_CORNER_RAD_RANGE

	const offsetTop = popupFinalPlacement.value === 'bottom' ? offset : 0
	const offsetLeft = popupFinalPlacement.value === 'right' ? offset : 0

	drawBorder(
		ctx,
		width,
		height,
		center,
		borderRadius,
		rad,
		borderColor,
		pixelSize,
		offsetX,
		offsetY,
		offsetTop,
		offsetLeft
	)
	const backgroundColor = getBackgroundColor(props.variant)

	floodFill(
		ctx,
		Math.round((width - offsetX) / 2 + offsetLeft),
		Math.round((height - offsetY) / 2 + offsetTop),
		backgroundColor
	)
	if (props.arrow) {
		drawArrow(
			ctx,
			width,
			height,
			borderColor,
			backgroundColor,
			pixelSize,
			popupFinalPlacement.value,
			popupSide.value,
			arrowXOffset.value || 0,
			arrowYOffset.value || 0
		)
	}
}

useResizeObserver(contentRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
</script>

<style lang="less" src="./index.less" />
