import { onBeforeUnmount } from 'vue'
import { inBrowser } from '../share/util/env'

function setHtmlOverflow(value: 'auto' | 'hidden') {
	const htmlElement = document.documentElement
	const computedStyle = window.getComputedStyle(htmlElement)
	const overflowValue = computedStyle.getPropertyValue('overflow')

	if (overflowValue !== value) {
		htmlElement.style.overflow = value
	}
}

type PopupWrapperInfo = {
	id: string
	escKeydownHandler: (e: KeyboardEvent) => void
	needPreventDocumentScroll: () => boolean
	getZIndex: () => number
}

let listened = false

const listenWindow = (flag: boolean) => {
	if (!inBrowser()) {
		return
	}
	if (flag && !listened) {
		window.addEventListener('keydown', callback)
		listened = true
	} else if (!flag && listened) {
		window.removeEventListener('keydown', callback)
		listened = false
	}
}

class PopupWrapperManager {
	private popups = new Map<string, PopupWrapperInfo>()
	sortedPopups: PopupWrapperInfo[] = []
	private isListening = false

	add(info: PopupWrapperInfo) {
		this.remove(info.id)

		this.popups.set(info.id, info)

		const insertIndex = this.findInsertIndex(info.getZIndex())
		this.sortedPopups.splice(insertIndex, 0, info)

		this.updateState()
	}

	remove(id: string) {
		if (!this.popups.has(id)) return

		this.popups.delete(id)

		const index = this.sortedPopups.findIndex((p) => p.id === id)
		if (index >= 0) {
			this.sortedPopups.splice(index, 1)
		}

		this.updateState()
	}

	getTop(): PopupWrapperInfo | undefined {
		return this.sortedPopups[this.sortedPopups.length - 1]
	}

	hasPreventScroll(): boolean {
		for (const popup of this.popups.values()) {
			if (popup.needPreventDocumentScroll()) {
				return true
			}
		}
		return false
	}

	private findInsertIndex(zIndex: number): number {
		let left = 0
		let right = this.sortedPopups.length - 1

		while (left <= right) {
			const mid = Math.floor((left + right) / 2)
			if (this.sortedPopups[mid].getZIndex() <= zIndex) {
				left = mid + 1
			} else {
				right = mid - 1
			}
		}

		return left
	}

	private updateState() {
		setHtmlOverflow(this.hasPreventScroll() ? 'hidden' : 'auto')

		const shouldListen = this.popups.size > 0
		if (shouldListen !== this.isListening) {
			listenWindow(shouldListen)
			this.isListening = shouldListen
		}
	}

	clearState() {
		window.removeEventListener('keydown', callback)
		this.sortedPopups.length = 0
		this.popups.clear()
	}
}

export const popupWrapperManager = new PopupWrapperManager()

const callback = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		const lastInfo = popupWrapperManager.getTop()
		lastInfo?.escKeydownHandler(e)
	}
}

// only for test
export const cleanState = () => {
	popupWrapperManager.clearState()
}

export const usePopupWrapperManager = (info: PopupWrapperInfo) => {
	const activate = () => {
		popupWrapperManager.add(info)
	}
	const hide = () => {
		popupWrapperManager.remove(info.id)
	}

	onBeforeUnmount(() => {
		hide()
	})

	return [activate, hide] as const
}
