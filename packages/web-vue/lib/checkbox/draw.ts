export const drawBorder = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	borderColor: string,
	pixelSize: number
) => {
	ctx.fillStyle = borderColor

	ctx.fillRect(pixelSize, 0, width - pixelSize * 2, pixelSize)

	ctx.fillRect(width - pixelSize, pixelSize, pixelSize, height - pixelSize * 2)

	ctx.fillRect(pixelSize, height - pixelSize, width - pixelSize * 2, pixelSize)

	ctx.fillRect(0, pixelSize, pixelSize, height - pixelSize * 2)
}
