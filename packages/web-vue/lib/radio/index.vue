<template>
	<label
		class="pixelium px-radio"
		ref="radioRef"
		@mousedown.prevent
		:class="{ [`px-radio__disabled`]: disabledComputed }"
	>
		<div class="px-radio-canvas-wrapper" ref="canvasWrapperRef">
			<canvas ref="canvasRef" class="px-radio-canvas"></canvas>
		</div>
		<slot></slot>
		{{ disabledComputed }}
		<input
			type="radio"
			:value="$props.label"
			class="px-radio__input"
			:checked="isChecked"
			@input="inputHandler"
			@change="handleChange"
			:disabled="disabledComputed"
		/>
	</label>
</template>

<script setup lang="ts">
import { onMounted, nextTick, computed, watch, ref, inject, onUnmounted, type Ref } from 'vue'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { generatePalette, parseColor } from '../share/util/color'
import type { RadioProps, RadioEvents } from './type'
import type { RgbaColor } from '../share/type'
import { TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import { FORM_ITEM_PROVIDE } from '../share/const/provide-key'
import { getGlobalThemeColor } from '../share/util/color'
import { canvasPreprocess } from '../share/util/plot'
import { inBrowser } from '../share/util/env'
import type { FormItemProvide } from '../form-item/type'
import { drawLargePixelTriangle } from './draw'
import { createProvideComputed } from '../share/util/reactivity'
import { useSmoothTransition } from '../share/hook/use-smooth-transition'
import { calcPixelSize } from '../share/util/plot'

defineOptions({
	name: 'Radio'
})
const radioRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const props = withDefaults(defineProps<RadioProps>(), {
	modelValue: '',
	label: ''
})

const emits = defineEmits<RadioEvents>()

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits)

onMounted(() => {
	nextTick(() => {
		drawPixel()
	})
})

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

// 注入RadioGroup提供的响应式引用
const radioGroup = inject<{
	modelValue: Ref<string | number>
	updateValue: (value: string | number) => void
	disabled: boolean
} | null>('radio-group', null)
console.log(radioGroup, 'radioGroup')

const isGroup = computed(() => !!radioGroup)

// 计算当前选中的值
const actualModelValue = computed(() => {
	if (isGroup.value && radioGroup) {
		return radioGroup.modelValue.value
	}
	return modelValue.value
})

// 计算当前radio是否被选中
const isChecked = computed(() => {
	return actualModelValue.value === props.label
})

// 监听actualModelValue的变化
watch(actualModelValue, () => {
	nextTick(() => {
		drawPixel()
	})
})

const handleChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	if (target.checked) {
		if (isGroup.value && radioGroup) {
			// 如果在RadioGroup中，调用RadioGroup的更新方法
			radioGroup.updateValue(props.label)
		} else {
			// 否则使用原有的更新方法
			updateModelValue(props.label)
		}
	}
}

const inputHandler = async (e: InputEvent) => {
	const target = e.target as HTMLInputElement
	const newValue = target.value

	if (isGroup.value && radioGroup) {
		// 如果在RadioGroup中，调用RadioGroup的更新方法
		radioGroup.updateValue(newValue)
		formItemProvide?.inputHandler()
	} else {
		// 否则使用原有的更新方法
		modelValue.value = newValue
		await updateModelValue(newValue)
		formItemProvide?.inputHandler()
	}
}

const darkMode = useDarkMode()
const palette = computed<null | RgbaColor[]>(() => {
	if (!props.activeColor) return null

	const color = parseColor(props.activeColor)
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const pixelSize = calcPixelSize()

const MID_PROGRESS = 0.5
const disabledComputed = createProvideComputed(
	'disabled',
	[formItemProvide, props, radioGroup],
	'or'
)

const ANIMATION_DURATION = 250
const [progress, play] = useSmoothTransition(ANIMATION_DURATION, modelValue.value ? 1 : 0)

// 闪烁动画相关状态
const blinkState = ref({
	isActive: false,
	timestamp: 0,
	alpha: 1
})

// 控制闪烁动画的函数
const startBlinking = () => {
	blinkState.value.isActive = true
	blinkState.value.timestamp = Date.now()
	animateBlink()
}

const stopBlinking = () => {
	blinkState.value.isActive = false
}

// 闪烁动画帧处理函数
const animateBlink = () => {
	if (!blinkState.value.isActive) return

	const elapsed = Date.now() - blinkState.value.timestamp
	// 创建一个周期性的闪烁效果 (周期为1秒)
	blinkState.value.alpha = 0.5 + 0.5 * Math.sin((elapsed / 1000) * Math.PI * 2)

	drawPixel()

	if (blinkState.value.isActive) {
		requestAnimationFrame(animateBlink)
	}
}

const getMainColor = () => {
	if (!inBrowser()) {
		return TRANSPARENT_RGBA_COLOR_OBJECT
	}

	let baseColor =
		progress.value > MID_PROGRESS
			? props.activeColor
				? parseColor(props.activeColor)
				: disabledComputed.value
					? getGlobalThemeColor('primary', 2)
					: getGlobalThemeColor('primary', 6)
			: disabledComputed.value
				? getGlobalThemeColor('neutral', 6)
				: getGlobalThemeColor('neutral', 8)

	// 如果正在闪烁，则根据alpha值调整颜色透明度
	if (blinkState.value.isActive) {
		return {
			r: baseColor.r,
			g: baseColor.g,
			b: baseColor.b,
			a: Math.round(baseColor.a * blinkState.value.alpha)
		}
	}

	return baseColor
}

const drawPixel = () => {
	const preprocessData = canvasPreprocess(radioRef, canvasRef)
	if (!preprocessData) {
		return
	}
	const { ctx, width, height } = preprocessData
	ctx.clearRect(0, 0, width, height)

	const backgroundColor = getMainColor()

	// 绘制大颗粒像素风格的三角形
	if (progress.value > 0) {
		const triangleSize = Math.min(width, height) * 0.6
		const triangleX = (width - triangleSize) / 2
		const triangleY = (height - triangleSize) / 2

		drawLargePixelTriangle(
			ctx,
			triangleX,
			triangleY,
			triangleSize,
			backgroundColor,
			pixelSize / 2
		)
	}
}

watch([() => props.disabled, disabledComputed, palette, progress, darkMode], () => {
	drawPixel()
})

watch(
	() => actualModelValue.value,
	(newVal) => {
		play(newVal === props.label ? 'forward' : 'backward')

		// 当选中状态变化时，控制闪烁动画
		if (newVal === props.label) {
			// 开始闪烁
			nextTick(() => {
				startBlinking()
			})
		} else {
			// 停止闪烁
			stopBlinking()
		}
	},
	{
		immediate: true
	}
)

// 组件卸载时清理动画
onUnmounted(() => {
	stopBlinking()
})
</script>

<style lang="less" src="./style.less"></style>
