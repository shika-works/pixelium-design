<template>
	<div class="px-color-picker-panel pixelium">
		<div class="px-color-picker-panel-body">
			<div class="px-color-picker-panel-container">
				<div
					class="px-color-picker-panel-color-field corner-gradient"
					ref="colorFieldRef"
					:style="{ background: fieldBackground }"
					@pointerdown="startFieldDrag"
				>
					<div class="px-color-picker-panel-color-overlay-light"></div>
					<div class="px-color-picker-panel-color-overlay-dark"></div>
					<div class="px-color-picker-panel-thumb" ref="colorThumbRef" :style="knobStyle">
						<canvas
							class="px-color-picker-panel-thumb-canvas"
							ref="colorThumbCanvasRef"
						></canvas>
					</div>
				</div>
			</div>
			<div class="px-color-picker-panel-sliders">
				<div
					class="px-color-picker-panel-slider corner-gradient px-color-picker-panel-hue-slider"
					ref="hueSliderRef"
					@pointerdown="startHueDrag"
				>
					<div ref="hueThumbRef" class="px-color-picker-panel-thumb" :style="hueThumbStyle">
						<canvas class="px-color-picker-panel-thumb-canvas" ref="hueThumbCanvasRef"></canvas>
					</div>
				</div>
				<div
					v-if="props.includeAlpha"
					class="px-color-picker-panel-slider corner-gradient px-color-picker-panel-alpha-slider"
					ref="alphaSliderRef"
					@pointerdown="startAlphaDrag"
				>
					<div class="px-color-picker-panel-thumb" ref="alphaThumbRef" :style="alphaThumbStyle">
						<canvas
							class="px-color-picker-panel-thumb-canvas"
							ref="alphaThumbCanvasRef"
						></canvas>
					</div>
				</div>
			</div>
		</div>

		<div class="px-color-picker-panel-footer">
			<Input
				size="small"
				v-model="inputValue"
				@blur="applyInput"
				@keydown.enter.prevent="applyInput"
			></Input>
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
import { hsvToHsl, hsvToRgba, parseColor, rgbaToHex } from '../share/util/color'
import type { ColorFormat, HsvaColor } from '../share/type'
import { clamp } from 'parsnip-kit'
import { useDraw } from './draw'
import Input from '../input/index.vue'

const props = withDefaults(defineProps<ColorPickerPanelProps>(), {
	format: 'hsv',
	includeAlpha: true
})

const emits = defineEmits<ColorPickerPanelEmits>()

const defaultHsv: HsvaColor = { h: 0, s: 1, v: 1, a: 255 }
const inputValue = ref(props.current || '')
const hsvColor = ref<HsvaColor>({ ...defaultHsv })
const colorFieldRef = ref<HTMLElement | null>(null)
const hueSliderRef = ref<HTMLElement | null>(null)
const alphaSliderRef = ref<HTMLElement | null>(null)

const parseColorString = (value: string): HsvaColor | null => {
	return parseColor(value, 'hsv')?.color || null
}

const formatColor = (format: ColorFormat, hsv: HsvaColor, allowAlpha: boolean): string => {
		const rgb = hsvToRgba(hsv)
	const alpha = Number((hsv.a / 255).toFixed(2))
	const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
	const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
	const hsl = hsvToHsl(hsv)
	if (format === 'hex') {
		return rgbaToHex(rgb, allowAlpha)
	}
	if (format === 'rgb') {
		return allowAlpha ? rgbaString : rgbString
	}
	if (format === 'hsl') {
		const s = parseFloat((hsl.s * 100).toFixed(2))
		const l = parseFloat((hsl.l * 100).toFixed(2))
		return allowAlpha
			? `hsla(${Math.round(hsl.h)}, ${s}%, ${l}%, ${alpha})`
			: `hsl(${Math.round(hsl.h)}, ${s}%, ${l}%)`
	}
	if (format === 'hsv') {
		const s = parseFloat((hsv.s * 100).toFixed(2))
		const v = parseFloat((hsv.v * 100).toFixed(2))
		return allowAlpha
			? `hsva(${Math.round(hsv.h)}, ${s}%, ${v}%, ${alpha})`
			: `hsv(${Math.round(hsv.h)}, ${s}%, ${v}%)`
	}
	if (format === 'hwb') {
		const w = parseFloat((Math.min(rgb.r, rgb.g, rgb.b) / 255).toFixed(2))
		const b = parseFloat((1 - Math.max(rgb.r, rgb.g, rgb.b) / 255).toFixed(2))
		const wPct = parseFloat((w * 100).toFixed(2))
		const bPct = parseFloat((b * 100).toFixed(2))
		return allowAlpha
			? `hwba(${Math.round(hsv.h)}, ${wPct}%, ${bPct}%, ${alpha})`
			: `hwb(${Math.round(hsv.h)}, ${wPct}%, ${bPct}%)`
	}
	return rgbaToHex(rgb, allowAlpha && hsv.a !== 255)
}

const applyColor = (source: HsvaColor, allowAlpha: boolean) => {
	hsvColor.value = {
		h: ((source.h % 360) + 360) % 360,
		s: clamp(source.s, 0, 100),
		v: clamp(source.v, 0, 100),
		a: allowAlpha ? clamp(Math.round(source.a), 0, 255) : 255
	}
}

const updateFromInput = (event: Event) => {
	const parsed = parseColorString(inputValue.value)
	if (!parsed) {
		inputValue.value = formattedValue.value
		return
	}
	applyColor(parsed, props.includeAlpha)
	inputValue.value = formatColor(props.format, parsed, props.includeAlpha)
	emitValue(event)
}

const emitValue = (event?: Event) => {
	if (!event) return
	const formatted = formattedValue.value
	emits('change', formatted, event)
}

const alphaPercent = computed<number>({
	get: () => Math.round((hsvColor.value.a / 255) * 100),
	set: (value) => {
		const alpha = clamp(Math.round(value), 0, 100)
		hsvColor.value.a = Math.round((alpha * 255) / 100)
	}
})

const hsvValue = computed({
	get: () => hsvColor.value,
	set: (value: { h: number; s: number; v: number }) => {
		hsvColor.value = {
			...hsvColor.value,
			...value
		}
	}
})
const formattedValue = computed(() =>
	formatColor(props.format, hsvValue.value, props.includeAlpha)
)

watch(
	() => props.format,
	(newFormat) => {
		if (newFormat) {
			inputValue.value = formatColor(props.format, hsvValue.value, props.includeAlpha)
		}
	}
)

const fieldBackground = computed(() => {
	return `hsl(${hsvValue.value.h}, 100%, 50%)`
})

const knobStyle = computed(() => {
	return {
		left: `${hsvValue.value.s * 100}%`,
		top: `${100 - hsvValue.value.v * 100}%`
	}
})

const hueThumbStyle = computed(() => {
	return {
		left: `${(hsvValue.value.h / 360) * 100}%`
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

const startDrag = (
	event: PointerEvent,
	element: HTMLElement,
	handler: (
		event: PointerEvent,
		element: HTMLElement,
		position: { x: number; y: number }
	) => void
) => {
	event.preventDefault()
	element.setPointerCapture(event.pointerId)
	handler(event, element, getPointerPosition(event, element))

	const move = (moveEvent: PointerEvent) => {
		handler(moveEvent, element, getPointerPosition(moveEvent, element))
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
	const hsv = hsvValue.value
	hsvValue.value = {
		h: hsv.h,
		s: position.x,
		v: 1 - position.y
	}
	emitValue(event)
}

const handleHuePointer = (
	event: PointerEvent,
	_element: HTMLElement,
	position: { x: number; y: number }
) => {
	const hsv = hsvValue.value
	hsvValue.value = {
		h: position.x * 360,
		s: hsv.s,
		v: hsv.v
	}
	emitValue(event)
}

const handleAlphaPointer = (
	event: PointerEvent,
	_element: HTMLElement,
	position: { x: number; y: number }
) => {
	hsvColor.value.a = clamp(Math.round(position.x * 255), 0, 255)
	emitValue(event)
}

const startFieldDrag = (event: PointerEvent) => {
	if (!colorFieldRef.value) return
	startDrag(event, colorFieldRef.value, handleFieldPointer)
}

const startHueDrag = (event: PointerEvent) => {
	if (!hueSliderRef.value) return
	startDrag(event, hueSliderRef.value, handleHuePointer)
}

const startAlphaDrag = (event: PointerEvent) => {
	if (!alphaSliderRef.value) return
	startDrag(event, alphaSliderRef.value, handleAlphaPointer)
}

const selectPreset = (value: string, event: MouseEvent) => {
	const parsed = parseColorString(value)
	if (!parsed) return
	applyColor(parsed, props.includeAlpha)
	inputValue.value = formatColor(props.format, parsed, props.includeAlpha)
	emitValue(event)
}
watch(
	() => props.current,
	(newValue) => {
		if (newValue === inputValue.value) return
		if (!newValue) {
			applyColor(defaultHsv, props.includeAlpha)
			inputValue.value = ''
			return
		}
		const parsed = parseColorString(newValue)
		if (parsed) {
			applyColor(parsed, props.includeAlpha)
			inputValue.value = formatColor(props.format, parsed, props.includeAlpha)
		}
	},
	{ immediate: true }
)

watch(
	() => hsvColor.value,
	() => {
		nextTick(() => {
			inputValue.value = formattedValue.value
		})
	},
	{ deep: true }
)

watch(
	() => props.format,
	() => {
		inputValue.value = formattedValue.value
	}
)

const applyInput = (event: Event) => {
	updateFromInput(event)
}

const alphaThumbRef = shallowRef<HTMLDivElement | null>(null)
const alphaThumbCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const hueThumbRef = shallowRef<HTMLDivElement | null>(null)
const hueThumbCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const colorThumbRef = shallowRef<HTMLDivElement | null>(null)
const colorThumbCanvasRef = shallowRef<HTMLCanvasElement | null>(null)

useDraw(alphaThumbRef, alphaThumbCanvasRef)
useDraw(hueThumbRef, hueThumbCanvasRef)
useDraw(colorThumbRef, colorThumbCanvasRef)
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
