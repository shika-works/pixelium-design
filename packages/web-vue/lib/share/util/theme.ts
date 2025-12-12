import { isString } from 'parsnip-kit'
import { generatePalette, parseColor, rgbaColor2string } from './color'
import { throwError } from './console'
import { inBrowser } from './env'
import { EventBus } from './event-bus'
import { GLOBAL_CSS_VAR_CHANGE } from '../const/event-bus-key'
import {
	MEDIUM_BASE_SIZE,
	SMALL_BASE_SIZE,
	INTERVAL,
	INTERVAL_MINI,
	LARGE_BASE_SIZE,
	DEFAULT_PIXEL_SIZE
} from '../const/style'

export const setThemeColor = (
	theme: 'primary' | 'success' | 'warning' | 'danger' | 'sakura' | 'neutral',
	color: string | { light?: string[]; dark?: string[] }
): void => {
	if (!inBrowser()) {
		return
	}
	const colorList = {
		light: [] as string[],
		dark: [] as string[]
	}
	if (isString(color)) {
		const rgbaColor = parseColor(color)
		if (!rgbaColor) {
			return
		}
		colorList.light = generatePalette(
			rgbaColor.r,
			rgbaColor.g,
			rgbaColor.b,
			rgbaColor.a,
			false
		).map((color) => {
			return rgbaColor2string(color)
		})
		colorList.dark = generatePalette(
			rgbaColor.r,
			rgbaColor.g,
			rgbaColor.b,
			rgbaColor.a,
			true
		).map((color) => {
			return rgbaColor2string(color)
		})
	} else {
		if (color.light?.length && color.light.length !== 10) {
			return throwError(
				`The length of color.light does not match the required number of CSS color palette (10).`
			)
		}
		if (color.dark?.length && color.dark.length !== 10) {
			return throwError(
				`The length of color.dark does not match the required number of CSS color palette (10).`
			)
		}
		colorList.light = color.light || []
		colorList.dark = color.dark || []
	}
	colorList.light.forEach((item, index) => {
		document.documentElement.style.setProperty(`--px-${theme}-light-custom-${index + 1}`, item)
	})
	colorList.dark.forEach((item, index) => {
		document.documentElement.style.setProperty(`--px-${theme}-dark-custom-${index + 1}`, item)
	})
	EventBus.emit(GLOBAL_CSS_VAR_CHANGE)
}

export const resetThemeColor = (
	theme: 'primary' | 'success' | 'warning' | 'danger' | 'sakura' | 'neutral'
): void => {
	if (!inBrowser()) {
		return
	}
	for (let i = 0; i < 10; i++) {
		document.documentElement.style.setProperty(`--px-${theme}-light-custom-${i + 1}`, null)
		document.documentElement.style.setProperty(`--px-${theme}-dark-custom-${i + 1}`, null)
	}
	EventBus.emit(GLOBAL_CSS_VAR_CHANGE)
}

const calcSizes = (pixelSize: number) => {
	const mediumSize = MEDIUM_BASE_SIZE + pixelSize * 2
	const smallSize = SMALL_BASE_SIZE + pixelSize * 2
	const largeSubSize = mediumSize
	const mediumSubSize = mediumSize - INTERVAL * 2 - INTERVAL_MINI
	const smallSubSize = smallSize - INTERVAL * 2

	return {
		'-px-large-size': LARGE_BASE_SIZE + pixelSize * 2,
		'-px-medium-size': mediumSize,
		'-px-small-size': smallSize,
		'-px-large-sub-size': largeSubSize,
		'-px-medium-sub-size': mediumSubSize,
		'-px-small-sub-size': smallSubSize,
		'-px-large-sub-base-size': largeSubSize - 2 * pixelSize,
		'-px-medium-sub-base-size': mediumSubSize - 2 * pixelSize,
		'-px-small-sub-base-size': smallSubSize - 2 * pixelSize,
		'-px-large-compat-size': mediumSize - INTERVAL,
		'-px-medium-compat-size': mediumSize - INTERVAL * 2,
		'-px-small-compat-size': smallSize - INTERVAL
	}
}

export const setPixelSize = (size: number): void => {
	if (!inBrowser()) {
		return
	}
	document.documentElement.style.setProperty(`--px-bit`, size + 'px')
	const sizes = calcSizes(size)
	Object.keys(sizes).forEach((key) => {
		document.documentElement.style.setProperty(key, ((sizes as any)[key] as number) + 'px')
	})
	EventBus.emit(GLOBAL_CSS_VAR_CHANGE)
}

export const resetPixelSize = (): void => {
	if (!inBrowser()) {
		return
	}
	setPixelSize(DEFAULT_PIXEL_SIZE)
}
