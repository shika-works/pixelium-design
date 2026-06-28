<script lang="tsx" setup>
import { ref, onMounted, computed, onBeforeUnmount, Transition, shallowRef, toRef } from 'vue'
import type { NotificationProps } from './type'
import { generatePalette, parseColor, rgbaColor2string } from '../share/util/color'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { type RgbaColor } from '../share/type'
import InfoCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/info-circle-solid.svg'
import ExclamationTriangleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclamation-triangle-solid.svg'
import OctagonTimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/octagon-times-solid.svg'
import CheckCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-circle-solid.svg'
import SpinnerThirdSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/spinner-third-solid.svg'
import { isString } from 'parsnip-kit'
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
import { useDraw } from './draw'

defineOptions({
	name: 'NotificationItem'
})

const props = withDefaults(defineProps<NotificationProps>(), {
	duration: 5000,
	type: 'normal',
	content: '',
	placement: 'top-right'
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
const notificationRef = shallowRef<null | HTMLDivElement>(null)

const darkMode = useDarkMode()
const palette = computed<null | RgbaColor[]>(() => {
	if (!props.color) return null
	const color = parseColor(props.color)?.color
	if (!color) {
		return null
	}
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

useDraw({
	wrapperRef: notificationRef,
	canvasRef,
	darkMode,
	type: toRef(props, 'type'),
	palette
})

defineExpose({
	close
})

defineRender(() => {
	return (
		<Transition name="px-notification-fade" onAfterLeave={afterLeaveHandler}>
			{visible.value && (
				<div
					ref={(node: any) => (notificationRef.value = node)}
					onMouseenter={clearTimer}
					onMouseleave={startTimer}
					class={{
						'px-notification': true,
						pixelium: true,
						[`px-notification__${props.type || 'normal'}`]: true,
						[`px-notification__${props.placement || 'top-right'}`]: true
					}}
				>
					{(!!props.icon ||
						(props.type && props.type !== 'normal' && props.type !== 'sakura')) && (
						<div class="px-notification-icon-wrapper">
							{props.icon ? (
								props.icon()
							) : props.type === 'info' || props.type === 'notice' ? (
								<InfoCircleSolid
									// @ts-ignore
									class="px-notification-icon"
									style={{
										fill: textColor.value
									}}
								></InfoCircleSolid>
							) : props.type === 'success' ? (
								<CheckCircleSolid
									// @ts-ignore
									class="px-notification-icon"
									style={{
										fill: textColor.value
									}}
								></CheckCircleSolid>
							) : props.type === 'warning' ? (
								<ExclamationTriangleSolid
									// @ts-ignore
									class="px-notification-icon"
									style={{
										fill: textColor.value
									}}
								></ExclamationTriangleSolid>
							) : props.type === 'error' ? (
								<OctagonTimesSolid
									// @ts-ignore
									class="px-notification-icon"
									style={{
										fill: textColor.value
									}}
								></OctagonTimesSolid>
							) : (
								props.type === 'loading' && (
									<SpinnerThirdSolid
										// @ts-ignore
										class="px-notification-icon px-animation__loading"
										style={{
											fill: textColor.value
										}}
									></SpinnerThirdSolid>
								)
							)}
						</div>
					)}
					<div
						class={{
							'px-notification-main': true,
							'px-notification-main__single': !props.content || !props.title
						}}
					>
						{props.title && (
							<div
								class={{
									'px-word-wrap': true,
									'px-notification-title': true
								}}
								style={{
									color: textColor.value
								}}
							>
								{isString(props.title) ? props.title : props.title()}
							</div>
						)}
						{props.content && (
							<div
								class={{
									'px-word-wrap': true,
									'px-notification-content': true
								}}
								style={{
									color: textColor.value
								}}
							>
								{isString(props.content) ? props.content : props.content()}
							</div>
						)}
					</div>
					{props.closable && (
						<div class="px-notification-close-wrapper">
							<Times
								// @ts-ignore
								class="px-notification-icon"
								style={{
									fill: closeIconColor.value
								}}
								onMouseenter={toggleHover(true)}
								onMouseleave={toggleHover(false)}
								onMousedown={toggleActive(true)}
								onMouseup={toggleActive(false)}
								onClick={close}
							></Times>
						</div>
					)}
					<canvas
						ref={(node: any) => (canvasRef.value = node)}
						class="px-notification-canvas"
					></canvas>
				</div>
			)}
		</Transition>
	)
})
</script>

<style lang="less" src="./index.less" />

<style src="../share/style/index.css" />
