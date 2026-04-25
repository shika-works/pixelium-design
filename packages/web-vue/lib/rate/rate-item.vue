<template>
	<div class="px-rate-item">
		<div ref="rateItemRef" class="px-rate-item-inner">
			<canvas ref="rateItemCanvasRef" class="px-rate-item-canvas"></canvas>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { computed, nextTick, onMounted, shallowRef, watch } from 'vue'
import { canvasPreprocess } from '../share/util/plot'
import { generatePalette, getGlobalThemeColor, parseColor } from '../share/util/color'
import type { RateItemProps } from './type'
import { STAR_TEMPLATE } from './shared'
import type { RgbaColor } from '../share/type'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { debounce } from 'parsnip-kit'
import { useTransitionEnd } from '../share/hook/use-transition-end'
import { useWatchGlobalCssVal } from '../share/hook/use-watch-global-css-var'
import { usePolling } from '../share/hook/use-polling'

const props = withDefaults(defineProps<RateItemProps>(), {
	activeColor: '#FFCC33'
})

const darkMode = useDarkMode()

const palette = computed<null | RgbaColor[]>(() => {
	if (!props.activeColor) return null
	const color = parseColor(props.activeColor)?.color
	if (!color) {
		return null
	}
	const palette = generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	return palette
})

const rateItemCanvasRef = shallowRef<HTMLCanvasElement | null>(null)
const rateItemRef = shallowRef<HTMLDivElement | null>(null)

const starImageCache = new Map<string, ImageData>()

function createStarImageData(
	activeColor: { r: number; g: number; b: number; a: number },
	inactiveColor: { r: number; g: number; b: number; a: number },
	halfMode: boolean,
	active: boolean
) {
	const width = 9
	const height = 9
	const cacheKey = `${activeColor.r},${activeColor.g},${activeColor.b},${activeColor.a}|${inactiveColor.r},${inactiveColor.g},${inactiveColor.b},${inactiveColor.a}|${halfMode}|${active}`
	const cached = starImageCache.get(cacheKey)
	if (cached) {
		return cached
	}

	const pixels = new Uint8ClampedArray(width * height * 4)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4
			if (STAR_TEMPLATE[y][x] === 0) {
				pixels[idx] = 0
				pixels[idx + 1] = 0
				pixels[idx + 2] = 0
				pixels[idx + 3] = 0
				continue
			}

			const isLeftHalf = x < width / 2
			const useActive = active ? (halfMode ? isLeftHalf : true) : false
			const color = useActive ? activeColor : inactiveColor

			pixels[idx] = color.r
			pixels[idx + 1] = color.g
			pixels[idx + 2] = color.b
			pixels[idx + 3] = color.a
		}
	}

	const imageData = new ImageData(pixels, width, height)
	starImageCache.set(cacheKey, imageData)
	return imageData
}

function scaleImageData(imageData: ImageData, scale: number): ImageData {
	const { width, height, data } = imageData
	const newWidth = Math.floor(width * scale)
	const newHeight = Math.floor(height * scale)
	const newData = new Uint8ClampedArray(newWidth * newHeight * 4)

	for (let y = 0; y < newHeight; y++) {
		const srcY = Math.min(Math.floor(y / scale), height - 1)
		for (let x = 0; x < newWidth; x++) {
			const srcX = Math.min(Math.floor(x / scale), width - 1)
			const srcIdx = (srcY * width + srcX) * 4
			const dstIdx = (y * newWidth + x) * 4
			newData[dstIdx] = data[srcIdx]
			newData[dstIdx + 1] = data[srcIdx + 1]
			newData[dstIdx + 2] = data[srcIdx + 2]
			newData[dstIdx + 3] = data[srcIdx + 3]
		}
	}

	return new ImageData(newData, newWidth, newHeight)
}

const draw = () => {
	const data = canvasPreprocess(rateItemRef, rateItemCanvasRef)
	if (!data) {
		return
	}
	if (!palette.value) {
		return
	}

	const { ctx, width, height } = data
	ctx.clearRect(0, 0, width, height)
	const scale = 3
	const color = props.disabled ? palette.value[1] : palette.value[5]
	const bgColor = getGlobalThemeColor('neutral', props.disabled ? 4 : 7) || {
		r: 200,
		g: 200,
		b: 200,
		a: 255
	}

	const image = createStarImageData(color, bgColor, props.half === true, props.active === true)
	ctx.putImageData(scaleImageData(image, scale), 0, 0)
}

const drawDebounce = debounce(draw, 0)

watch([() => props.active, () => props.half, palette, () => props.disabled], () => {
	drawDebounce()
})

onMounted(() => {
	nextTick(draw)
})

useWatchGlobalCssVal(drawDebounce)
useTransitionEnd(rateItemRef, drawDebounce)

let wrapperSize = {
	width: 0,
	height: 0
}

const pollSizeChangeComputed = computed(() => {
	return props.pollSizeChange
})

usePolling(pollSizeChangeComputed, () => {
	const wrapper = rateItemRef.value
	if (wrapper) {
		const rect = wrapper.getBoundingClientRect()
		if (rect.width !== wrapperSize.width || rect.height !== wrapperSize.height) {
			wrapperSize = {
				width: rect.width,
				height: rect.height
			}
			drawDebounce()
		}
	}
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
