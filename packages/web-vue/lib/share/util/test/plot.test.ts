import { describe, expect, it } from 'vitest'
import { drawRoundRect, floodFill } from '../plot'
import type { RgbaColor } from '../../type'

const rgba = (r: number, g: number, b: number, a = 255): RgbaColor => ({ r, g, b, a })
const toUint32 = (c: RgbaColor) => ((c.a << 24) | (c.b << 16) | (c.g << 8) | c.r) >>> 0

const BORDER = toUint32(rgba(0, 0, 0, 255))
const TRANSPARENT = 0

const FILL_STYLE_RE = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/

function createFakeContext(width: number, height: number) {
	const buffer = new Uint8ClampedArray(width * height * 4)
	const stats = { bytesRead: 0, bytesWritten: 0, fillRects: 0 }

	const getPixel = (x: number, y: number) => {
		const i = (y * width + x) * 4
		return (
			((buffer[i + 3] << 24) | (buffer[i + 2] << 16) | (buffer[i + 1] << 8) | buffer[i]) >>> 0
		)
	}

	const setPixel = (x: number, y: number, color: number) => {
		const i = (y * width + x) * 4
		buffer[i] = color & 0xff
		buffer[i + 1] = (color >>> 8) & 0xff
		buffer[i + 2] = (color >>> 16) & 0xff
		buffer[i + 3] = (color >>> 24) & 0xff
	}

	const snapshot = () => {
		const out = new Uint32Array(width * height)
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) out[y * width + x] = getPixel(x, y)
		}
		return out
	}

	const raw = {
		canvas: { width, height },
		fillStyle: '',
		getImageData(x: number, y: number, w: number, h: number) {
			const data = new Uint8ClampedArray(w * h * 4)
			for (let row = 0; row < h; row++) {
				const from = ((y + row) * width + x) * 4
				data.set(buffer.subarray(from, from + w * 4), row * w * 4)
			}
			stats.bytesRead += w * h * 4
			return { width: w, height: h, data } as unknown as ImageData
		},
		putImageData(
			img: ImageData,
			dx: number,
			dy: number,
			dirtyX = 0,
			dirtyY = 0,
			dirtyW = img.width,
			dirtyH = img.height
		) {
			for (let row = 0; row < dirtyH; row++) {
				const from = ((dirtyY + row) * img.width + dirtyX) * 4
				const to = ((dy + dirtyY + row) * width + dx + dirtyX) * 4
				buffer.set(img.data.subarray(from, from + dirtyW * 4), to)
			}
			stats.bytesWritten += dirtyW * dirtyH * 4
		},
		fillRect(x: number, y: number, w: number, h: number) {
			const match = FILL_STYLE_RE.exec(raw.fillStyle)
			if (!match) throw new Error(`unexpected fillStyle: ${raw.fillStyle}`)
			const color = toUint32(
				rgba(
					Number(match[1]),
					Number(match[2]),
					Number(match[3]),
					match[4] === undefined ? 255 : Math.round(Number(match[4]) * 255)
				)
			)
			for (let row = 0; row < h; row++) {
				for (let col = 0; col < w; col++) setPixel(x + col, y + row, color)
			}
			stats.fillRects++
		}
	}

	return {
		ctx: raw as unknown as CanvasRenderingContext2D,
		stats,
		getPixel,
		setPixel,
		snapshot
	}
}

function drawBorder(
	ctx: ReturnType<typeof createFakeContext>,
	width: number,
	height: number,
	thickness: number
) {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (x < thickness || y < thickness || x >= width - thickness || y >= height - thickness) {
				ctx.setPixel(x, y, BORDER)
			}
		}
	}
}

function referenceFill(
	pixels: Uint32Array,
	w: number,
	h: number,
	startX: number,
	startY: number,
	fill: number
) {
	const target = pixels[startY * w + startX]
	if (target === fill) return
	const stack = [startY * w + startX]
	pixels[startY * w + startX] = fill
	while (stack.length) {
		const pos = stack.pop()!
		const x = pos % w
		const y = (pos - x) / w
		if (x > 0 && pixels[pos - 1] === target) {
			pixels[pos - 1] = fill
			stack.push(pos - 1)
		}
		if (x < w - 1 && pixels[pos + 1] === target) {
			pixels[pos + 1] = fill
			stack.push(pos + 1)
		}
		if (y > 0 && pixels[pos - w] === target) {
			pixels[pos - w] = fill
			stack.push(pos - w)
		}
		if (y < h - 1 && pixels[pos + w] === target) {
			pixels[pos + w] = fill
			stack.push(pos + w)
		}
	}
}

function createRandomMap(w: number, h: number, seed: number, obstacleRate: number) {
	const map = new Uint32Array(w * h)
	let state = seed >>> 0
	const next = () => {
		state = (state * 1664525 + 1013904223) >>> 0
		return state / 0x100000000
	}
	for (let i = 0; i < w * h; i++) {
		map[i] = next() < obstacleRate ? BORDER : TRANSPARENT
	}
	return map
}

describe('floodFill', () => {
	it('fills the enclosed region and leaves the border/outside untouched', () => {
		const width = 24
		const height = 16
		const ctx = createFakeContext(width, height)
		drawBorder(ctx, width, height, 3)

		floodFill(ctx.ctx, Math.round(width / 2), Math.round(height / 2), rgba(255, 0, 0, 255))

		const fillColor = toUint32(rgba(255, 0, 0, 255))
		expect(ctx.getPixel(12, 8)).toBe(fillColor)
		expect(ctx.getPixel(3, 3)).toBe(fillColor)
		expect(ctx.getPixel(20, 12)).toBe(fillColor)
		expect(ctx.getPixel(0, 0)).toBe(BORDER)
		expect(ctx.getPixel(2, 8)).toBe(BORDER)
		expect(ctx.getPixel(23, 15)).toBe(BORDER)
		expect(ctx.getPixel(12, 15)).toBe(BORDER)
	})

	it('skips reading/writing when the seed already has the fill color', () => {
		const ctx = createFakeContext(10, 10)
		drawBorder(ctx, 10, 10, 2)
		const before = ctx.snapshot()

		floodFill(ctx.ctx, 5, 5, rgba(0, 0, 0, 0))

		expect(ctx.snapshot()).toEqual(before)
		expect(ctx.stats.bytesWritten).toBe(0)
	})

	it('ignores seeds outside of the canvas without touching the canvas', () => {
		const ctx = createFakeContext(10, 10)
		drawBorder(ctx, 10, 10, 2)
		const before = ctx.snapshot()

		floodFill(ctx.ctx, -1, 5, rgba(255, 255, 255, 255))
		floodFill(ctx.ctx, 5, 10, rgba(255, 255, 255, 255))
		floodFill(ctx.ctx, 10, 5, rgba(255, 255, 255, 255))

		expect(ctx.snapshot()).toEqual(before)
		expect(ctx.stats.bytesRead).toBe(0)
		expect(ctx.stats.bytesWritten).toBe(0)
	})

	it('only uploads the dirty bounding box of the fill', () => {
		const ctx = createFakeContext(40, 40)
		for (let x = 16; x < 24; x++) {
			ctx.setPixel(x, 16, BORDER)
			ctx.setPixel(x, 23, BORDER)
		}
		for (let y = 16; y < 24; y++) {
			ctx.setPixel(16, y, BORDER)
			ctx.setPixel(23, y, BORDER)
		}

		floodFill(ctx.ctx, 20, 20, rgba(0, 0, 255, 255))

		expect(ctx.stats.bytesWritten).toBe(6 * 6 * 4)
		expect(ctx.stats.bytesWritten).toBeLessThan(40 * 40 * 4)
		expect(ctx.getPixel(19, 19)).toBe(toUint32(rgba(0, 0, 255, 255)))
		expect(ctx.getPixel(16, 20)).toBe(BORDER)
	})

	it.each([1, 2, 3, 42, 1234, 98765])(
		'matches an independent reference implementation (seed %i)',
		(seed) => {
			const w = 40
			const h = 30
			const map = createRandomMap(w, h, seed, 0.35)
			const ctx = createFakeContext(w, h)
			for (let i = 0; i < map.length; i++) {
				const x = i % w
				ctx.setPixel(x, (i - x) / w, map[i])
			}

			const sx = Math.floor(w / 2)
			const sy = Math.floor(h / 2)
			const fill = toUint32(rgba(17, 34, 51, 255))

			floodFill(ctx.ctx, sx, sy, rgba(17, 34, 51, 255))

			const expected = map.slice()
			referenceFill(expected, w, h, sx, sy, fill)

			expect(ctx.snapshot()).toEqual(expected)
		}
	)
})

describe('integration with drawRoundRect', () => {
	const drawShape = (ctx: ReturnType<typeof createFakeContext>, ps: number) =>
		drawRoundRect(ctx.ctx, rgba(0, 0, 0, 255), ps, {
			borderRadius: [ps * 3, ps * 3, ps * 3, ps * 3]
		})

	it('fills the interior of a real pixel-art border', () => {
		const w = 96
		const h = 64
		const ps = 4
		const fillColor = rgba(255, 128, 0, 255)
		const cx = Math.round(w / 2)
		const cy = Math.round(h / 2)

		const fake = createFakeContext(w, h)
		drawShape(fake, ps)
		expect(fake.stats.fillRects).toBeGreaterThan(0)

		const before = fake.snapshot()
		expect(before[cy * w + cx]).toBe(TRANSPARENT)

		const fillRectsAfterBorder = fake.stats.fillRects
		floodFill(fake.ctx, cx, cy, fillColor)

		const expected = before.slice()
		referenceFill(expected, w, h, cx, cy, toUint32(fillColor))
		expect(fake.snapshot()).toEqual(expected)

		expect(fake.getPixel(cx, cy)).toBe(toUint32(fillColor))
		expect(fake.stats.fillRects).toBe(fillRectsAfterBorder)
	})
})
