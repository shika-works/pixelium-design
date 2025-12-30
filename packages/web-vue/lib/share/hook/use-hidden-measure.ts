import { onBeforeUnmount } from 'vue'
import { inBrowser } from '../util/env'

const hiddenContainer = {} as Record<string, HTMLDivElement | undefined>

const HIDDEN_STYLE = `
  position:absolute!important;
  top:-9999px!important;
  left:-9999px!important;
  overflow:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
  width:99999px!important;
  min-height:0!important;
  height:0!important;
  z-index:-9999!important;
`
const count = {} as Record<string, number>

function destroyHiddenTextarea(key: string) {
	count[key]--
	if (hiddenContainer[key] && count[key] <= 0) {
		hiddenContainer[key].remove()
		hiddenContainer[key] = undefined
	}
}

function recordMounted(key: string) {
	count[key] = (count[key] || 0) + 1
	if (count[key] === 1) {
		hiddenContainer[key] = document.createElement('div')
		hiddenContainer[key].style = HIDDEN_STYLE
		document.body.appendChild(hiddenContainer[key])
	}
}

export const useHiddenMeasure = (key: string) => {
	if (inBrowser()) {
		recordMounted(key)
		onBeforeUnmount(() => {
			destroyHiddenTextarea(key)
		})
	}

	return () => hiddenContainer[key]
}
