<template>
	<div class="px-color-picker-panel pixelium">
		<div class="px-color-picker-panel-body">
			<div
				class="px-color-picker-panel-color-field corner-gradient"
				ref="colorFieldRef"
				:style="{ background: fieldBackground }"
				@pointerdown="startFieldDrag"
			>
				<div class="px-color-picker-panel-color-overlay-light"></div>
				<div class="px-color-picker-panel-color-overlay-dark"></div>
				<div class="px-color-picker-panel-thumb" ref="colorThumbRef" :style="knobStyle">
					<canvas class="px-color-picker-panel-thumb-canvas" ref="colorThumbCanvasRef"></canvas>
				</div>
			</div>
			<div class="px-color-picker-panel-sliders">
				<div
					class="px-color-picker-panel-container"
					ref="hueSliderRef"
					@pointerdown="startHueDrag"
				>
					<div
						class="px-color-picker-panel-slider corner-gradient px-color-picker-panel-hue-slider"
					>
						<div ref="hueThumbRef" class="px-color-picker-panel-thumb" :style="hueThumbStyle">
							<canvas
								class="px-color-picker-panel-thumb-canvas"
								ref="hueThumbCanvasRef"
							></canvas>
						</div>
					</div>
				</div>
				<div
					class="px-color-picker-panel-container"
					v-if="props.includeAlpha"
					ref="alphaSliderRef"
					@pointerdown="startAlphaDrag"
				>
					<div
						class="px-color-picker-panel-slider corner-gradient px-color-picker-panel-alpha-slider"
					>
						<div
							class="px-color-picker-panel-thumb"
							ref="alphaThumbRef"
							:style="alphaThumbStyle"
						>
							<canvas
								class="px-color-picker-panel-thumb-canvas"
								ref="alphaThumbCanvasRef"
							></canvas>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="px-color-picker-panel-footer">
			<Input size="small" v-model="inputValue" @change="updateFromInput"></Input>
			<div class="px-color-picker-panel-presets">
				<button
					type="button"
					class="px-color-picker-panel-preset corner-gradient"
					v-for="preset in props.presets"
					:key="preset"
					:style="{ background: preset }"
					@click="selectPreset(preset, $event)"
				></button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import type { ColorPickerPanelEmits, ColorPickerPanelProps } from './type'
import { hsvToRgba, parseColor } from '../share/util/color'
import type { HsvaColor } from '../share/type'
import { clamp, isEqual } from 'parsnip-kit'
import { useDraw } from './draw'
import Input from '../input/index.vue'
import { calcColorWithModel, formatColor } from './util'
import { usePixelSize } from '../share/hook/use-pixel-size'

defineOptions({
	name: 'ColorPickerPanel'
})

const props = withDefaults(defineProps<ColorPickerPanelProps>(), {
	format: 'rgb',
	includeAlpha: true
})

const emits = defineEmits<ColorPickerPanelEmits>()

const defaultHsv: HsvaColor = { h: 0, s: 0, v: 0, a: 255 }
const hsvColor = ref<HsvaColor>({ ...defaultHsv })
const colorFieldRef = ref<HTMLElement | null>(null)
const hueSliderRef = ref<HTMLElement | null>(null)
const alphaSliderRef = ref<HTMLElement | null>(null)

const pixelSize = usePixelSize()

const calcColor = computed(() => {
	return calcColorWithModel(hsvColor.value, props.includeAlpha)
})
const formattedValue = computed(() =>
	formatColor(props.format, calcColor.value, props.includeAlpha)
)

const inputValue = ref(formattedValue.value || '')

const getRgbaValue = (source: HsvaColor) => {
	const res = hsvToRgba(source)
	if (!props.includeAlpha) {
		res.a = 255
	}
	return res
}

const parseColorString = (value: string): HsvaColor | null => {
	return parseColor(value, 'hsv')?.color || null
}

const applyColor = (source: HsvaColor, allowAlpha: boolean, inner: boolean = false) => {
	let h = source.h % (inner ? 361 : 360)
	if (!inner) {
		if (Math.round(hsvColor.value.h) === 360 && h === 0) {
			h = 360
		}
	}
	hsvColor.value = {
		h: h,
		s: clamp(source.s, 0, 1),
		v: clamp(source.v, 0, 1),
		a: allowAlpha ? clamp(Math.round(source.a), 0, 255) : 255
	}
}

const updateFromInput = async (value: string, event?: Event) => {
	const parsed = parseColorString(inputValue.value)
	console.log(value, inputValue.value, parsed)

	if (!parsed) {
		inputValue.value = formattedValue.value
		return
	}
	emitValue(parsed, event as Event)
	await nextTick()
	inputValue.value = formattedValue.value
}

const emitValue = (value: HsvaColor, event: Event) => {
	applyColor(value, props.includeAlpha, true)
	const calcColor = calcColorWithModel(value, props.includeAlpha)
	const formatted = formatColor(props.format, calcColor, props.includeAlpha)
	emits('change', getRgbaValue(value), formatted, calcColor, event)
}

const alphaPercent = computed<number>({
	get: () => Math.round((hsvColor.value.a / 255) * 100),
	set: (value) => {
		const alpha = clamp(Math.round(value), 0, 100)
		hsvColor.value.a = Math.round((alpha * 255) / 100)
	}
})

watch(formattedValue, async (newFormat) => {
	if (newFormat) {
		inputValue.value = formattedValue.value
	}
})

const fieldBackground = computed(() => {
	return `hsl(${hsvColor.value.h}, 100%, 50%)`
})

const knobStyle = computed(() => {
	return {
		left: `${hsvColor.value.s * 100}%`,
		top: `${100 - hsvColor.value.v * 100}%`
	}
})

const hueThumbStyle = computed(() => {
	return {
		left: `${(hsvColor.value.h / 360) * 100}%`
	}
})

const alphaThumbStyle = computed(() => {
	return {
		left: `${alphaPercent.value}%`
	}
})

const getPointerPosition = (event: PointerEvent, element: HTMLElement) => {
	const rect = element.getBoundingClientRect()
	const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
	const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
	return { x, y }
}

const getPointerPosition4Slider = (event: PointerEvent, element: HTMLElement) => {
	let clientX = event.clientX
	if (clientX < pixelSize.value) {
		clientX = pixelSize.value
	}
	if (clientX > element.clientWidth - pixelSize.value) {
		clientX = element.clientWidth - pixelSize.value
	}

	const rect = element.getBoundingClientRect()
	let left = rect.left + pixelSize.value
	let width = rect.width - 2 * pixelSize.value
	let x = clamp((event.clientX - left) / width, 0, 1)
	let y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
	return { x, y }
}

const startDrag = (
	event: PointerEvent,
	element: HTMLElement,
	getPosition: (event: PointerEvent, element: HTMLElement) => { x: number; y: number },
	handler: (
		event: PointerEvent,
		element: HTMLElement,
		position: { x: number; y: number }
	) => void
) => {
	event.preventDefault()
	element.setPointerCapture(event.pointerId)
	handler(event, element, getPosition(event, element))

	const move = (moveEvent: PointerEvent) => {
		handler(moveEvent, element, getPosition(moveEvent, element))
	}
	const up = () => {
		element.releasePointerCapture(event.pointerId)
		element.removeEventListener('pointermove', move)
		element.removeEventListener('pointerup', up)
		element.removeEventListener('pointercancel', up)
	}
	element.addEventListener('pointermove', move)
	element.addEventListener('pointerup', up)
	element.addEventListener('pointercancel', up)
}

const handleFieldPointer = (
	event: PointerEvent,
	_element: HTMLElement,
	position: { x: number; y: number }
) => {
	const hsv = hsvColor.value
	const next = {
		h: hsv.h,
		s: position.x,
		v: 1 - position.y,
		a: hsv.a
	}
	emitValue(next, event)
}

const handleHuePointer = (
	event: PointerEvent,
	_element: HTMLElement,
	position: { x: number; y: number }
) => {
	const hsv = hsvColor.value
	const next = {
		h: position.x * 360,
		s: hsv.s,
		v: hsv.v,
		a: hsv.a
	}
	emitValue(next, event)
}

const handleAlphaPointer = (
	event: PointerEvent,
	_element: HTMLElement,
	position: { x: number; y: number }
) => {
	const hsv = hsvColor.value
	const next = {
		h: hsv.h,
		s: hsv.s,
		v: hsv.v,
		a: clamp(Math.round(position.x * 255), 0, 255)
	}
	emitValue(next, event)
}

const startFieldDrag = (event: PointerEvent) => {
	if (!colorFieldRef.value) return
	startDrag(event, colorFieldRef.value, getPointerPosition, handleFieldPointer)
}

const startHueDrag = (event: PointerEvent) => {
	if (!hueSliderRef.value) return
	startDrag(event, hueSliderRef.value, getPointerPosition4Slider, handleHuePointer)
}

const startAlphaDrag = (event: PointerEvent) => {
	if (!alphaSliderRef.value) return
	startDrag(event, alphaSliderRef.value, getPointerPosition4Slider, handleAlphaPointer)
}

const selectPreset = async (value: string, event: MouseEvent) => {
	const parsed = parseColorString(value)
	if (!parsed) return
	emitValue(parsed, event)
}
watch(
	() => props.current,
	(newValue) => {
		if (isEqual(newValue, hsvColor.value)) return
		if (!newValue) {
			applyColor(defaultHsv, props.includeAlpha)
			inputValue.value = ''
			return
		}
		applyColor(newValue, props.includeAlpha)
	},
	{ immediate: true }
)

const alphaThumbRef = shallowRef<HTMLDivElement | null>(null)
const alphaThumbCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const hueThumbRef = shallowRef<HTMLDivElement | null>(null)
const hueThumbCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const colorThumbRef = shallowRef<HTMLDivElement | null>(null)
const colorThumbCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

useDraw(alphaThumbRef, alphaThumbCanvasRef, pixelSize)
useDraw(hueThumbRef, hueThumbCanvasRef, pixelSize)
useDraw(colorThumbRef, colorThumbCanvasRef, pixelSize, calcColor)
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
