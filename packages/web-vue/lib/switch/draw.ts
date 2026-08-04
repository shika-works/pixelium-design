import {
	drawRoundRect,
	drawSmoothCircle,
	canvasPreprocess,
	floodFill
} from '../share/util/plot'
import type { RgbaColor } from '../share/type'
import { getGlobalThemeColor, parseColor, rgbaColor2string } from '../share/util/color'
import { TRANSPARENT_RGBA_COLOR_OBJECT } from '../share/const'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import { inBrowser } from '../share/util/env'
import { isNullish } from 'parsnip-kit'
import {
	watch,
	type ComputedRef,
	type Ref,
	type ShallowRef,
	type Slots,
	type WatchSource
} from 'vue'
import type { SwitchProps } from './type'

const MID_PROGRESS = 0.5

export const getMainColor = (
	progress: number,
	activeColor: string | undefined,
	inactiveColor: string | undefined,
	disabled: boolean
): RgbaColor | null => {
	if (!inBrowser()) {
		return TRANSPARENT_RGBA_COLOR_OBJECT
	}
	return progress > MID_PROGRESS
		? activeColor
			? parseColor(activeColor)?.color || null
			: disabled
				? getGlobalThemeColor('primary', 2)
				: getGlobalThemeColor('primary', 6)
		: inactiveColor
			? parseColor(inactiveColor)?.color || null
			: disabled
				? getGlobalThemeColor('neutral', 6)
				: getGlobalThemeColor('neutral', 8)
}

type UseDrawOptions = {
	wrapperRef: ShallowRef<HTMLElement | null>
	pixelSizeRef: Ref<number>
	darkMode: Ref<boolean>
	canvasRef: ShallowRef<HTMLCanvasElement | null>
	buttonCanvasRef: ShallowRef<HTMLCanvasElement | null>
	switchButtonRef: ShallowRef<HTMLElement | null>
	sizeComputed: ComputedRef<string | undefined>
	disabled: Ref<boolean | undefined>
	shape: Ref<SwitchProps['shape']>
	activeColor: Ref<SwitchProps['activeColor']>
	inactiveColor: Ref<SwitchProps['inactiveColor']>
	progress: Ref<number>
	pollSizeChange?: WatchSource<any>
	slots: Slots
	refresh: () => void
}

export const useDraw = (options: UseDrawOptions) => {
	const drawPixel = () => {
		const preprocessData = canvasPreprocess(options.wrapperRef, options.canvasRef)
		if (!preprocessData) {
			return
		}
		const { ctx, width, height } = preprocessData

		const pixelSize = options.pixelSizeRef.value

		const backgroundColor = getMainColor(
			options.progress.value,
			options.activeColor.value,
			options.inactiveColor.value,
			!!options.disabled.value
		)

		if (backgroundColor) {
			drawRoundRect(ctx, backgroundColor, pixelSize, {
				shape: options.shape.value,
				miniRadius: options.sizeComputed.value === 'small' && options.shape.value === 'round'
			})
			floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
		}

		const buttonPreprocessData = canvasPreprocess(
			options.switchButtonRef,
			options.buttonCanvasRef
		)
		if (!buttonPreprocessData) {
			return
		}
		const { ctx: buttonCtx, width: buttonWidth, height: buttonHeight } = buttonPreprocessData

		const buttonSize = Math.min(buttonWidth, buttonHeight)
		const sliceColor = getGlobalThemeColor('neutral', 1)

		if (!sliceColor) {
			return
		}

		buttonCtx.fillStyle = rgbaColor2string(sliceColor)

		const radius = Math.round(buttonSize / 2 - pixelSize / 2)
		if (options.shape.value === 'round') {
			drawSmoothCircle(buttonCtx, radius, radius, radius, 0, Math.PI * 2, pixelSize)
		} else {
			buttonCtx.fillRect(0, 0, buttonSize, buttonSize)
		}

		floodFill(buttonCtx, Math.round(radius + 1), Math.round(radius + 1), sliceColor)
	}

	const drawAndRefresh = () => {
		drawPixel()
		options.refresh()
	}

	const { debouncedTrigger } = useDrawCanvas(options.wrapperRef, drawAndRefresh, {
		pollSizeChange: options.pollSizeChange
	})

	watch(
		[
			options.pixelSizeRef,
			options.darkMode,
			options.sizeComputed,
			options.shape,
			options.disabled,
			options.activeColor,
			options.inactiveColor,
			() => options.slots
		],
		() => {
			debouncedTrigger()
		}
	)

	watch(options.progress, (val, old) => {
		if (!isNullish(old) && (val - MID_PROGRESS) * (old - MID_PROGRESS) < 0) {
			debouncedTrigger()
		}
	})
}
