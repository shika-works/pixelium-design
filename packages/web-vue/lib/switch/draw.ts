import { drawCircle, drawSmoothCircle } from '../share/util/plot'
import type { RgbaColor } from '../share/type'
import { rgbaColor2string } from '../share/util/color'

export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	center: [number, number][],
	borderRadius: number[],
	rad: [number, number][],
	borderColor: RgbaColor,
	pixelSize: number,
	paddingX: number = 0,
	paddingY: number = 0,
	small: boolean = false,
	smooth: boolean = false
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)
	for (let i = 0; i < 4; i++) {
		if (borderRadius[i] > pixelSize || (small && borderRadius[i] === pixelSize)) {
			if (!smooth) {
				drawCircle(
					ctx,
					center[i][0] + paddingX,
					center[i][1] + paddingY,
					borderRadius[i],
					rad[i][0],
					rad[i][1],
					pixelSize
				)
			} else {
				drawSmoothCircle(
					ctx,
					center[i][0] + paddingX,
					center[i][1] + paddingY,
					borderRadius[i],
					rad[i][0],
					rad[i][1],
					pixelSize
				)
			}
		}
	}

	if (center[1][0] + pixelSize > center[0][0]) {
		let length = center[1][0] - center[0][0] + pixelSize
		ctx.fillRect(center[0][0] + paddingX, paddingY, length, pixelSize)
	}

	if (center[2][1] + pixelSize > center[1][1]) {
		ctx.fillRect(
			width - pixelSize + paddingX,
			center[1][1] + paddingY,
			pixelSize,
			center[2][1] - center[1][1] + pixelSize
		)
	}

	if (center[3][0] < center[2][0] + pixelSize) {
		let length = center[2][0] - center[3][0] + pixelSize
		ctx.fillRect(center[3][0] + paddingX, height - pixelSize + paddingY, length, pixelSize)
	}

	if (center[3][1] + pixelSize > center[0][1]) {
		ctx.fillRect(
			paddingX,
			center[0][1] + paddingY,
			pixelSize,
			center[3][1] - center[0][1] + pixelSize
		)
	}
}
