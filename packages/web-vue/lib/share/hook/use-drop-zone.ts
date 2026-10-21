import { onBeforeUnmount, ref, type Ref } from 'vue'

type UseDropZoneOptions = {
	onDrop: (files: File[], e: DragEvent) => void
	isEnabled?: () => boolean
}

const hasFiles = (e: DragEvent) => !!e.dataTransfer?.types.includes('Files')

export const useDropZone = (options: UseDropZoneOptions) => {
	const dragOver = ref(false)
	let dragDepth = 0

	const stopWatchingWindow = () => {
		window.removeEventListener('dragend', resetDrag)
		window.removeEventListener('drop', resetDrag)
	}

	// Leaving the window does not always fire dragleave, so the highlight is also reset from the window.
	const resetDrag = () => {
		dragDepth = 0
		dragOver.value = false
		stopWatchingWindow()
	}

	const startWatchingWindow = () => {
		window.addEventListener('dragend', resetDrag)
		window.addEventListener('drop', resetDrag)
	}

	const dragOverHandler = (e: DragEvent) => {
		if (options.isEnabled?.() === false || !hasFiles(e)) {
			return
		}
		if (!dragDepth) {
			startWatchingWindow()
		}
		dragDepth++
		dragOver.value = true
	}

	const dragLeaveHandler = () => {
		dragDepth = Math.max(dragDepth - 1, 0)
		if (!dragDepth) {
			dragOver.value = false
			stopWatchingWindow()
		}
	}

	const dropHandler = (e: DragEvent) => {
		resetDrag()
		if (options.isEnabled?.() === false) {
			return
		}
		options.onDrop(Array.from(e.dataTransfer?.files ?? []), e)
	}

	onBeforeUnmount(stopWatchingWindow)

	return {
		dragOver: dragOver as Ref<boolean>,
		dragOverHandler,
		dragLeaveHandler,
		dropHandler
	}
}
