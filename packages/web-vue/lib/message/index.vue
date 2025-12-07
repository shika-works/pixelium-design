<script lang="tsx" setup>
import { ref, onMounted, computed, watch, onBeforeUnmount, Transition, shallowRef } from 'vue'
import type { MessageProps } from './type'
import {
	generatePalette,
	getGlobalThemeColor,
	parseColor,
	rgbaColor2string
} from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { type RgbaColor } from '../share/type'
import { useResizeObserver } from '../share/hook/use-resize-observer'
import InfoCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/info-circle-solid.svg'
import ExclamationTriangleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclamation-triangle-solid.svg'
import OctagonTimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/octagon-times-solid.svg'
import CheckCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-circle-solid.svg'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { isString } from 'parsnip-kit'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import TimesCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/times-circle-solid.svg'
import { calcPixelSize, canvasPreprocess } from '../share/util/plot'
import { useTransitionEnd } from '../share/hook/use-transition-end'

const props = withDefaults(defineProps<MessageProps>(), {
	duration: 3000,
	type: 'normal',
	content: ''
})

const hoverFlag = ref(false)
const activeFlag = ref(false)

const toggleActive = (status: boolean) => {
	activeFlag.value = status
}
const toggleHover = (status: boolean) => {
	hoverFlag.value = status
}

const visible = ref(false)
let timer: any = undefined

onMounted(() => {
	visible.value = true
	startTimer()
})

onBeforeUnmount(() => {
	clearTimeout(timer)
})

function startTimer() {
	timer = setTimeout(() => close(), props.duration)
}
function clearTimer() {
	clearTimeout(timer)
	timer = undefined
}
function close() {
	visible.value = false
}

const emits = defineEmits(['close'])
const afterLeaveHandler = () => {
	emits('close', props.id)
	clearTimer()
}
const canvasRef = shallowRef<null | HTMLCanvasElement>(null)
const messageRef = shallowRef<null | HTMLDivElement>(null)

const themeMap = (type: MessageProps['type']) => {
	if (!type) {
		return 'normal'
	}
	switch (type) {
		case 'info':
			return 'primary'
		case 'error':
			return 'danger'
		default:
			return type
	}
}
const darkMode = useDarkMode()
const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})
const textColor = computed(() => {
	return palette.value ? rgbaColor2string(palette.value[5]) : undefined
})

const closeIconColor = computed(() => {
	if (!palette.value) {
		return undefined
	}
	return activeFlag.value
		? rgbaColor2string(palette.value[6])
		: hoverFlag.value
			? rgbaColor2string(palette.value[4])
			: rgbaColor2string(palette.value[5])
})
function getBorderColor(type: MessageProps['type'] = 'normal', palette: RgbaColor[] | null) {
	if (palette) {
		return palette[5]
	} else {
		const theme = themeMap(type)
		if (theme === 'normal') {
			return getGlobalThemeColor('neutral', 10)
		} else if (theme === 'loading') {
			return getGlobalThemeColor('neutral', 8)
		} else {
			return getGlobalThemeColor(theme, 6)
		}
	}
}
const draw = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: RgbaColor,
	pixelSize: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)

	ctx.fillRect(pixelSize, 0, width - 2 * pixelSize, pixelSize)
	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - 2 * pixelSize)
	ctx.fillRect(pixelSize, height - pixelSize, width - 2 * pixelSize, pixelSize)
	ctx.fillRect(0, pixelSize, pixelSize, height - 2 * pixelSize)

	const backgroundColor = getGlobalThemeColor('neutral', 1)
	ctx.fillStyle = rgbaColor2string(backgroundColor)
	ctx.fillRect(pixelSize, pixelSize, width - 2 * pixelSize, height - 2 * pixelSize)
}
const drawPixel = () => {
	const preprocessData = canvasPreprocess(messageRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData

	const pixelSize = calcPixelSize()

	const borderColor = getBorderColor(props.type, palette.value)

	draw(ctx, width, height, borderColor, pixelSize)
}

useResizeObserver(messageRef, drawPixel)
useWatchGlobalCssVal(drawPixel)
useTransitionEnd(messageRef, drawPixel)

watch([() => props.type, palette, darkMode], () => {
	setTimeout(() => {
		drawPixel()
	})
})
defineExpose({
	close
})

defineRender(() => {
	return (
		<Transition name="px-message-fade" onAfterLeave={afterLeaveHandler}>
			{visible.value && (
				<div
					ref={(node: any) => (messageRef.value = node)}
					onMouseenter={clearTimer}
					onMouseleave={startTimer}
					class={{
						'px-message': true,
						pixelium: true,
						[`px-message__${props.type || 'primary'}`]: true
					}}
				>
					{(!!props.icon ||
						(props.type && props.type !== 'normal' && props.type !== 'sakura')) && (
						<div class="px-message-icon-wrapper">
							{props.icon ? (
								props.icon()
							) : props.type === 'info' ? (
								<InfoCircleSolid
									// @ts-ignore
									class="px-message-icon"
									style={{
										fill: textColor.value
									}}
								></InfoCircleSolid>
							) : props.type === 'success' ? (
								<CheckCircleSolid
									// @ts-ignore
									class="px-message-icon"
									style={{
										fill: textColor.value
									}}
								></CheckCircleSolid>
							) : props.type === 'warning' ? (
								<ExclamationTriangleSolid
									// @ts-ignore
									class="px-message-icon"
									style={{
										fill: textColor.value
									}}
								></ExclamationTriangleSolid>
							) : props.type === 'error' ? (
								<OctagonTimesSolid
									// @ts-ignore
									class="px-message-icon"
									style={{
										fill: textColor.value
									}}
								></OctagonTimesSolid>
							) : (
								props.type === 'loading' && (
									<SpinnerThirdSolid
										// @ts-ignore
										class="px-message-icon px-animation__loading"
										style={{
											fill: textColor.value
										}}
									></SpinnerThirdSolid>
								)
							)}
						</div>
					)}
					<span
						class="px-message-content"
						style={{
							color: textColor.value
						}}
					>
						{isString(props.content) ? props.content : props.content()}
					</span>
					{props.closable && (
						<div class="px-message-close-wrapper">
							<TimesCircleSolid
								// @ts-ignore
								class="px-message-icon"
								style={{
									fill: closeIconColor.value
								}}
								onMouseenter={toggleHover(true)}
								onMouseleave={toggleHover(false)}
								onMousedown={toggleActive(true)}
								onMouseup={toggleActive(false)}
								onClick={close}
							></TimesCircleSolid>
						</div>
					)}
					<canvas
						ref={(node: any) => (canvasRef.value = node)}
						class="px-message-canvas"
					></canvas>
				</div>
			)}
		</Transition>
	)
})
</script>

<style lang="less" src="./index.less" />
