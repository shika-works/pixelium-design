import { computed, watch, type Ref, type ShallowRef } from 'vue'
import { canvasPreprocess } from '../share/util/plot'
import { generatePalette, getGlobalThemeColor, parseColor } from '../share/util/color'
import type { RgbaColor } from '../share/type'
import { STAR_TEMPLATE } from './shared'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'

type DrawRateItemOptions = {
	activeColor: Ref<string>
	active: Ref<boolean | undefined>
	half: Ref<boolean | undefined>
	disabled: Ref<boolean | undefined>
	pollSizeChange: Ref<boolean | undefined>
}

const starImageCache = new Map<string, ImageData>()

function createStarImageData(
	activeColor: RgbaColor,
	inactiveColor: RgbaColor,
	halfMode: boolean,
	active: boolean
): ImageData {
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

export const useDrawPixel = (
	wrapperRef: ShallowRef<HTMLDivElement | null>,
	canvasRef: ShallowRef<HTMLCanvasElement | null>,
	options: DrawRateItemOptions
) => {
	const darkMode = useDarkMode()

	const palette = computed<null | RgbaColor[]>(() => {
		if (!options.activeColor.value) return null
		const color = parseColor(options.activeColor.value)?.color
		if (!color) {
			return null
		}
		return generatePalette(color.r, color.g, color.b, color.a, darkMode.value)
	})

	const drawPixel = () => {
		const data = canvasPreprocess(wrapperRef, canvasRef)
		if (!data) {
			return
		}
		if (!palette.value) {
			return
		}

		const { ctx, width, height } = data
		ctx.clearRect(0, 0, width, height)
		const scale = 3
		const color = options.disabled.value ? palette.value[1] : palette.value[5]
		const bgColor = getGlobalThemeColor('neutral', options.disabled.value ? 4 : 7) || {
			r: 200,
			g: 200,
			b: 200,
			a: 255
		}

		const image = createStarImageData(
			color,
			bgColor,
			options.half.value === true,
			options.active.value === true
		)
		ctx.putImageData(scaleImageData(image, scale), 0, 0)
	}

	const { debouncedTrigger } = useDrawCanvas(wrapperRef, drawPixel, {
		pollSizeChange: options.pollSizeChange
	})

	watch([options.active, options.half, palette, options.disabled], () => {
		debouncedTrigger()
	})
}
