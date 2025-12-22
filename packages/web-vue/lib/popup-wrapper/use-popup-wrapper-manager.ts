import { onBeforeUnmount } from 'vue'

const activeId = new Set<string>()

function setHtmlOverflow(value: 'auto' | 'hidden') {
	const htmlElement = document.documentElement
	const computedStyle = window.getComputedStyle(htmlElement)
	const overflowValue = computedStyle.getPropertyValue('overflow')

	if (overflowValue !== value) {
		htmlElement.style.overflow = value
	}
}

export const usePopupWrapperManager = (id: string) => {
	const activate = () => {
		activeId.add(id)
		if (activeId.size) {
			setHtmlOverflow('hidden')
		}
	}
	const hide = () => {
		activeId.delete(id)
		if (!activeId.size) {
			setHtmlOverflow('auto')
		}
	}

	onBeforeUnmount(() => {
		hide()
	})

	return [activate, hide] as const
}
