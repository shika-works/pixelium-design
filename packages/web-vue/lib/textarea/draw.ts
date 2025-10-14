import type { RgbaColor } from '../share/type'
import { rgbaColor2string } from '../share/util/color'

export const draw = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: RgbaColor,
	backgroundColor: RgbaColor,
	pixelSize: number
) => {
	ctx.fillStyle = rgbaColor2string(borderColor)

	ctx.fillRect(pixelSize, 0, width - 2 * pixelSize, pixelSize)
	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - 2 * pixelSize)
	ctx.fillRect(pixelSize, height - pixelSize, width - 2 * pixelSize, pixelSize)
	ctx.fillRect(0, pixelSize, pixelSize, height - 2 * pixelSize)

	ctx.fillStyle = rgbaColor2string(backgroundColor)
	ctx.fillRect(pixelSize, pixelSize, width - 2 * pixelSize, height - 2 * pixelSize)
}
