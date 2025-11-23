import type { RgbaColor } from '../share/type'
import { rgbaColor2string } from '../share/util/color'

// 新增绘制大颗粒像素风格三角形的函数
export const drawLargePixelTriangle = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	color: RgbaColor,
	pixelSize: number = 2
) => {
	ctx.fillStyle = rgbaColor2string(color)

	// 计算三角形的大小和位置
	const gridSize = Math.floor(size / pixelSize)
	// console.log(gridSize,'gridSize',size , pixelSize);

	// 绘制大颗粒像素风格的三角形
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < gridSize; col++) {
			if (col >= row && col <= gridSize - 1 - row) {
				// 绘制大的像素块
				ctx.fillRect(x + row * pixelSize, y + col * pixelSize, pixelSize, pixelSize * 2)
			}
		}
	}
}
