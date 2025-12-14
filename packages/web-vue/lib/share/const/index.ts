import type { RgbaColor } from '../type'

export const TRANSPARENT_RGBA_COLOR_OBJECT: RgbaColor = {
	r: 0,
	g: 0,
	b: 0,
	a: 0
}

export const MESSAGE_Z_INDEX = 3000

export const Z_INDEX = 1000

export const COVER_Z_INDEX = 20

export enum SCREEN_SIZE_TYPE {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	XL = 'xl',
	XXL = 'xxl'
}

export const GROUP_OPTION_TYPE = 'group'

export const BORDER_CORNER_RAD_RANGE: [number, number][] = [
	[Math.PI, (Math.PI * 3) / 2],
	[(Math.PI * 3) / 2, Math.PI * 2],
	[0, Math.PI / 2],
	[Math.PI / 2, Math.PI]
]

export const POPUP_CONTENT_DEFAULT_MAX_WIDTH = 400

export const SQRT3 = Math.sqrt(3)
export const INV_SQRT3 = 1 / SQRT3

export const GET_ELEMENT_RENDERED = 'getElementRendered'
