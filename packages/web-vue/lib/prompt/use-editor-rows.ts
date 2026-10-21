import { computed, onMounted, ref, watch, type Ref, type ShallowRef } from 'vue'
import { inBrowser } from '../share/util/env'
import { useResizeObserver } from '../share/hook/use-resize-observer'

type UseEditorRowsOptions = {
	editorRef: ShallowRef<HTMLElement | null>
	modelValue: Ref<string | null | undefined>
	autoSize: Ref<boolean | undefined>
	minRow: Ref<number | undefined>
	maxRow: Ref<number | undefined>
}

const FALLBACK_LINE_HEIGHT_RATIO = 1.5

export const useEditorRows = (options: UseEditorRowsOptions) => {
	const lineHeight = ref(0)
	const contentHeight = ref(0)

	const measure = () => {
		const editor = options.editorRef.value
		if (!editor || !inBrowser()) {
			return
		}
		const style = window.getComputedStyle(editor)
		const parsedLineHeight = Number.parseFloat(style.lineHeight)
		const parsedFontSize = Number.parseFloat(style.fontSize)
		lineHeight.value = Number.isFinite(parsedLineHeight)
			? parsedLineHeight
			: Number.isFinite(parsedFontSize)
				? parsedFontSize * FALLBACK_LINE_HEIGHT_RATIO
				: 0
		contentHeight.value = editor.scrollHeight
	}

	useResizeObserver(options.editorRef, measure)

	watch([options.modelValue, options.autoSize, options.minRow, options.maxRow], () => {
		measure()
	})

	onMounted(measure)

	const editorStyle = computed(() => {
		const rowHeight = lineHeight.value
		const min = Math.max(options.minRow.value ?? 1, 0) * rowHeight
		const maxRow = options.maxRow.value
		const max =
			maxRow === undefined || !Number.isFinite(maxRow)
				? Infinity
				: Math.max(maxRow, 0) * rowHeight
		const style: Record<string, string | undefined> = {
			minHeight: min > 0 ? `${min}px` : undefined,
			maxHeight: Number.isFinite(max) ? `${max}px` : undefined
		}
		if (options.autoSize.value && contentHeight.value > 0) {
			style.height = `${Math.min(Math.max(contentHeight.value, min), max)}px`
		}
		return style
	})

	return { editorStyle }
}
