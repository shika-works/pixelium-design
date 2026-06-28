<script lang="tsx" setup>
import {
	ref,
	onMounted,
	computed,
	onBeforeUnmount,
	Transition,
	shallowRef,
	toRef,
	useSlots
} from 'vue'
import type { MessageProps } from './type'
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
	name: 'MessageItem'
})

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

const slots = useSlots()
const canvasRef = shallowRef<null | HTMLCanvasElement>(null)
const messageRef = shallowRef<null | HTMLDivElement>(null)

const darkMode = useDarkMode()
const type = toRef(props, 'type')
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
	wrapperRef: messageRef,
	canvasRef,
	darkMode,
	type,
	palette,
	slots
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
						[`px-message__${props.type || 'normal'}`]: true
					}}
				>
					{(!!props.icon ||
						(props.type && props.type !== 'normal' && props.type !== 'sakura')) && (
						<div class="px-message-icon-wrapper">
							{props.icon ? (
								props.icon()
							) : props.type === 'info' || props.type === 'notice' ? (
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
							<Times
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
							></Times>
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

<style src="../share/style/index.css" />
