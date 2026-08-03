import { watch, type ComputedRef, type Ref, type ShallowRef, type Slots } from 'vue'
import { useDrawCanvas } from '../share/hook/use-draw-canvas'
import type { RgbaColor } from '../share/type'
import type { CollapseProvide } from '../collapse/type'
import { usePixelSize } from '../share/hook/use-pixel-size'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { canvasPreprocess, drawRoundRect, floodFill } from '../share/util/plot'
import { getGlobalThemeColor } from '../share/util/color'
import { fillArr } from '../share/util/common'

const getRanges = (width: number, height: number) => {
	return [
		[
			[0, 0],
			[Math.round(width / 2), Math.round(height / 2)]
		],
		[
			[Math.round(width / 2), 0],
			[width, Math.round(height / 2)]
		],
		[
			[Math.round(width / 2), Math.round(height / 2)],
			[width, height]
		],
		[
			[0, Math.round(height / 2)],
			[Math.round(width / 2), height]
		]
	]
}

const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderRadius: number[],
	borderColor: RgbaColor,
	pixelSize: number
) => {
	const ranges = getRanges(width, height)
	drawRoundRect(ctx, width, height, borderRadius, borderColor, pixelSize, ranges)
}

const HEAD_BORDER_RADIUS = fillArr(4, 4)
const CONTENT_BORDER_RADIUS = fillArr(12, 4)

type UseDrawOptions = {
	isHover: Readonly<Ref<boolean>>
	disabled: ComputedRef<boolean>
}

export const useDraw = (
	headerWrapperRef: ShallowRef<HTMLDivElement | null>,
	headerCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	contentWrapperRef: ShallowRef<HTMLDivElement | null>,
	contentCanvasRef: ShallowRef<HTMLCanvasElement | null>,
	slots: Slots,
	options: UseDrawOptions,
	collapseProvide?: CollapseProvide
) => {
	const pixelSizeRef = usePixelSize()
	const getDrawFn = (
		wrapperRef: ShallowRef<HTMLDivElement | null>,
		canvasRef: ShallowRef<HTMLCanvasElement | null>,
		borderRadius: number[],
		borderColor: RgbaColor | null
	) => {
		return (backgroundColor: RgbaColor | null) => {
			const preprocessData = canvasPreprocess(wrapperRef, canvasRef)
			if (!preprocessData) {
				return
			}
			const { ctx, width, height } = preprocessData

			const pixelSize = pixelSizeRef.value

			if (borderColor) {
				drawBorder(ctx, width, height, borderRadius, borderColor, pixelSize)
			}

			if (backgroundColor) {
				floodFill(ctx, Math.round(width / 2), Math.round(height / 2), backgroundColor)
			}
		}
	}

	const drawPixelHeader = getDrawFn(
		headerWrapperRef,
		headerCanvasRef,
		HEAD_BORDER_RADIUS,
		getGlobalThemeColor('neutral', 9)
	)
	const drawPixelContent = getDrawFn(
		contentWrapperRef,
		contentCanvasRef,
		CONTENT_BORDER_RADIUS,
		getGlobalThemeColor('neutral', 8)
	)

	const drawPixelHeaderFn = () => {
		const backgroundColor = options.disabled.value
			? getGlobalThemeColor('neutral', 6)
			: options.isHover.value
				? getGlobalThemeColor('neutral', 2)
				: getGlobalThemeColor('neutral', 1)
		drawPixelHeader(backgroundColor)
	}

	const drawPixelContentFn = () => {
		drawPixelContent(getGlobalThemeColor('neutral', 1))
	}

	const darkMode = useDarkMode()

	watch(
		[
			collapseProvide?.showExpandIcon,
			collapseProvide?.expandIconPlacement,
			pixelSizeRef,
			darkMode,
			options.isHover,
			options.disabled,
			() => slots
		],
		() => {
			debouncedTriggerHeader()
		}
	)

	const { debouncedTrigger: debouncedTriggerHeader } = useDrawCanvas(
		headerWrapperRef,
		drawPixelHeaderFn,
		{
			pollSizeChange: () => collapseProvide?.pollSizeChange.value
		}
	)
	useDrawCanvas(contentWrapperRef, drawPixelContentFn, {
		pollSizeChange: () => collapseProvide?.pollSizeChange.value
	})
}
