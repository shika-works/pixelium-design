import { isString } from 'parsnip-kit'
import { generatePalette, parseColor, rgbaColor2string } from './color'
import { throwError } from './console'
import { inBrowser } from './env'
import { EventBus } from './event-bus'
import { GLOBAL_CSS_VAR_CHANGE } from '../const/event-bus-key'

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
