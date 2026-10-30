import { computed, onMounted, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue'
import { useComposition } from '../share/hook/use-composition'
import { inBrowser } from '../share/util/env'
import { isNullish } from 'parsnip-kit'
import type {
	PromptCaretPosition,
	PromptContent,
	PromptCounterConfig,
	PromptChip,
	PromptSubmitKey,
	PromptSubmitModifier,
	PromptTriggerPayload
} from './type'

type UseEditorOptions = {
	modelValue: Ref<string | null | undefined>
	content?: Ref<PromptContent | null | undefined>
	contentControlled?: ComputedRef<boolean>
	disabled: ComputedRef<boolean>
	readonly: ComputedRef<boolean>
	counterConfig?: Ref<PromptCounterConfig | undefined>
	submitKey?: Ref<PromptSubmitKey | undefined>
	newlineKey?: Ref<PromptSubmitKey | undefined>
	trigger?: Ref<string | string[] | undefined>
	onUpdate: (value: string) => void
	onUpdateContent?: (content: PromptContent) => void
	onInput?: (value: string, e: Event) => void
	onSubmit?: (e: KeyboardEvent) => void
	onPasteFiles?: (files: File[], e: ClipboardEvent) => void
	onPaste?: (e: ClipboardEvent) => void
	onKeydown?: (e: KeyboardEvent) => boolean
	onTrigger?: (payload: PromptTriggerPayload) => void
	onChipAdd?: (chip: PromptChip) => void
	onChipRemove?: (chip: PromptChip) => void
}

const CHIP_CLASS = 'px-prompt-chip'

const chipStore = new WeakMap<HTMLElement, PromptChip>()

const isChipElement = (node: Node | null | undefined): boolean =>
	!!node && node.nodeType === 1 && (node as HTMLElement).classList.contains(CHIP_CLASS)

const SUBMIT_KEY_ALIASES: Record<PromptSubmitModifier, 'ctrl' | 'alt' | 'shift'> = {
	ctrl: 'ctrl',
	control: 'ctrl',
	meta: 'ctrl',
	cmd: 'ctrl',
	command: 'ctrl',
	alt: 'alt',
	option: 'alt',
	shift: 'shift'
}

const parseSubmitChord = (value: string) => {
	const chord = new Set<'ctrl' | 'alt' | 'shift'>()
	value.split('+').forEach((key) => {
		const alias = SUBMIT_KEY_ALIASES[key.trim().toLowerCase() as PromptSubmitModifier]
		if (alias) {
			chord.add(alias)
		}
	})
	return chord
}

export const useEditor = (options: UseEditorOptions) => {
	const editorRef = shallowRef<HTMLDivElement | null>(null)

	const maxLength = computed(() => options.counterConfig?.value?.maxLength)

	const editable = computed(() =>
		options.disabled.value || options.readonly.value ? 'false' : 'true'
	)

	const submitChord = computed(() => parseSubmitChord(options.submitKey?.value ?? 'ctrl+enter'))

	const newlineChord = computed(() => parseSubmitChord(options.newlineKey?.value ?? 'enter'))

	const matchesChord = (e: KeyboardEvent, chord: Set<'ctrl' | 'alt' | 'shift'>) =>
		(e.ctrlKey || e.metaKey) === chord.has('ctrl') &&
		e.altKey === chord.has('alt') &&
		e.shiftKey === chord.has('shift')

	const triggerChars = computed(() => {
		const value = options.trigger?.value
		if (!value) {
			return [] as string[]
		}
		return (Array.isArray(value) ? value : [value]).filter(Boolean)
	})

	const contentToText = (content: PromptContent) =>
		content
			.map((segment) => (segment.type === 'text' ? segment.text : segment.chip.label))
			.join('')

	const removeContentRange = (
		content: PromptContent,
		start: number,
		end: number
	): PromptContent => {
		const next: PromptContent = []
		let cursor = 0
		content.forEach((segment) => {
			const length = segment.type === 'text' ? segment.text.length : segment.chip.label.length
			const segmentStart = cursor
			cursor += length
			if (segment.type === 'chip') {
				if (end <= segmentStart || start >= segmentStart + length) {
					next.push(segment)
				}
				return
			}
			const prefix = segment.text.slice(0, Math.min(Math.max(start - segmentStart, 0), length))
			const suffix = segment.text.slice(Math.min(Math.max(end - segmentStart, 0), length))
			const text = prefix + suffix
			if (text) {
				next.push({ type: 'text', text })
			}
		})
		return next
	}

	const readContent = (): PromptContent => {
		const editor = editorRef.value
		const content: PromptContent = []
		if (!editor) {
			return content
		}
		const pushText = (text: string) => {
			if (!text) {
				return
			}
			if (content.length) {
				const last = content[content.length - 1]
				if (last.type === 'text') {
					last.text += text
					return
				}
			}
			content.push({ type: 'text', text })
		}
		const visit = (node: ChildNode) => {
			if (node.nodeType === 3) {
				pushText(node.nodeValue ?? '')
				return
			}
			if (node.nodeType !== 1) {
				return
			}
			const element = node as HTMLElement
			if (isChipElement(element)) {
				const chip = chipStore.get(element)
				if (chip) {
					content.push({ type: 'chip', chip })
				} else {
					pushText(element.textContent ?? '')
				}
				return
			}
			if (element.tagName === 'BR') {
				pushText('\n')
				return
			}
			element.childNodes.forEach(visit)
		}
		editor.childNodes.forEach(visit)
		return content
	}

	const createChipNode = (chip: PromptChip) => {
		const node = document.createElement('span')
		node.className = chip.type ? `${CHIP_CLASS} ${CHIP_CLASS}__${chip.type}` : CHIP_CLASS
		node.setAttribute('contenteditable', 'false')
		node.setAttribute('data-chip-type', chip.type ?? '')
		node.textContent = chip.label
		chipStore.set(node, chip)
		return node
	}

	const sameContent = (current: PromptContent, next: PromptContent) => {
		if (current.length !== next.length) {
			return false
		}
		return current.every((segment, index) => {
			const other = next[index]
			if (segment.type !== other.type) {
				return false
			}
			if (segment.type === 'text' && other.type === 'text') {
				return segment.text === other.text
			}
			if (segment.type === 'chip' && other.type === 'chip') {
				return segment.chip.id === other.chip.id && segment.chip.label === other.chip.label
			}
			return false
		})
	}

	const setValue = (value: string) => {
		const editor = editorRef.value
		if (editor && editor.textContent !== value) {
			editor.textContent = value
		}
	}

	const setContent = (next: PromptContent) => {
		const editor = editorRef.value
		if (!editor || sameContent(readContent(), next)) {
			return
		}
		editor.textContent = ''
		next.forEach((segment) => {
			if (segment.type === 'text') {
				if (segment.text) {
					editor.appendChild(document.createTextNode(segment.text))
				}
				return
			}
			editor.appendChild(createChipNode(segment.chip))
		})
	}

	const caretPointAt = (target: number): { node: Node; offset: number } | null => {
		const editor = editorRef.value
		if (!editor) {
			return null
		}
		let remaining = Math.max(0, target)
		const pointAt = (element: HTMLElement, after: boolean) => {
			const parent = element.parentNode
			if (!parent) {
				return null
			}
			const index = Array.prototype.indexOf.call(parent.childNodes, element)
			return { node: parent, offset: index + (after ? 1 : 0) }
		}
		const visit = (node: ChildNode): { node: Node; offset: number } | null => {
			if (node.nodeType === 3) {
				const length = node.nodeValue?.length ?? 0
				if (remaining <= length) {
					return { node, offset: remaining }
				}
				remaining -= length
				return null
			}
			if (node.nodeType !== 1) {
				return null
			}
			const element = node as HTMLElement
			if (isChipElement(element)) {
				const length = chipStore.get(element)?.label.length ?? element.textContent?.length ?? 0
				if (length > 0 && remaining <= length) {
					return pointAt(element, remaining === length)
				}
				remaining -= length
				return null
			}
			if (element.tagName === 'BR') {
				if (remaining === 0) {
					return pointAt(element, false)
				}
				remaining -= 1
				return null
			}
			for (const child of Array.from(element.childNodes)) {
				const found = visit(child)
				if (found) {
					return found
				}
			}
			return null
		}
		for (const child of Array.from(editor.childNodes)) {
			const found = visit(child)
			if (found) {
				return found
			}
		}
		return { node: editor, offset: editor.childNodes.length }
	}

	const contentOffsetOf = (target: Node, targetOffset: number): number => {
		const editor = editorRef.value
		if (!editor) {
			return 0
		}
		let count = 0
		let found = -1
		const measure = (node: Node): number => {
			if (node.nodeType === 3) {
				return node.nodeValue?.length ?? 0
			}
			if (node.nodeType !== 1) {
				return 0
			}
			const element = node as HTMLElement
			if (isChipElement(element)) {
				return chipStore.get(element)?.label.length ?? element.textContent?.length ?? 0
			}
			if (element.tagName === 'BR') {
				return 1
			}
			return Array.from(element.childNodes).reduce((total, child) => total + measure(child), 0)
		}
		const visit = (node: Node): boolean => {
			if (node === target) {
				if (node.nodeType === 3) {
					found = count + targetOffset
					return true
				}
				const children = Array.from(node.childNodes)
				let inner = 0
				for (let i = 0; i < targetOffset && i < children.length; i++) {
					inner += measure(children[i])
				}
				found = count + inner
				return true
			}
			if (node.nodeType === 3) {
				count += node.nodeValue?.length ?? 0
				return false
			}
			if (node.nodeType !== 1) {
				return false
			}
			const element = node as HTMLElement
			if (isChipElement(element)) {
				count += measure(element)
				return false
			}
			if (element.tagName === 'BR') {
				count += 1
				return false
			}
			for (const child of Array.from(element.childNodes)) {
				if (visit(child)) {
					return true
				}
			}
			return false
		}
		visit(editor)
		return found >= 0 ? found : count
	}

	const rangeAt = (point: { node: Node; offset: number }) => {
		const range = document.createRange()
		range.setStart(point.node, point.offset)
		range.collapse(true)
		return range
	}

	const applyRange = (range: Range) => {
		const selection = window.getSelection()
		selection?.removeAllRanges()
		selection?.addRange(range)
	}

	const placeCaretAtEnd = () => {
		if (!inBrowser()) {
			return
		}
		const point = caretPointAt(Number.POSITIVE_INFINITY)
		if (point) {
			applyRange(rangeAt(point))
		}
	}

	const insertText = (text: string) => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return
		}
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
			editor.appendChild(document.createTextNode(text))
			placeCaretAtEnd()
			return
		}
		const range = selection.getRangeAt(0)
		range.deleteContents()
		const node = document.createTextNode(text)
		range.insertNode(node)
		range.setStartAfter(node)
		range.collapse(true)
		applyRange(range)
	}

	const findChipNode = (id: number | string | symbol) => {
		const editor = editorRef.value
		if (!editor) {
			return null
		}
		const nodes = editor.querySelectorAll<HTMLElement>(`.${CHIP_CLASS}`)
		return Array.from(nodes).find((node) => chipStore.get(node)?.id === id) ?? null
	}

	const activeTrigger = ref<{ char: string; query: string } | null>(null)
	let activeRange: Range | null = null

	const caretRect = (): DOMRect | undefined => {
		if (!inBrowser()) {
			return undefined
		}
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) {
			return undefined
		}
		try {
			return selection.getRangeAt(0).getBoundingClientRect()
		} catch {
			return undefined
		}
	}

	const caretRange = (back: number): Range | null => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return null
		}
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) {
			return null
		}
		const caret = selection.getRangeAt(0)
		if (!editor.contains(caret.startContainer) || caret.startContainer.nodeType !== 3) {
			return null
		}
		const text = caret.startContainer as Text
		const range = document.createRange()
		range.setStart(text, Math.max(0, caret.startOffset - back))
		range.setEnd(text, caret.startOffset)
		return range
	}

	const liveCaretRange = (): Range | null => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return null
		}
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) {
			return null
		}
		const range = selection.getRangeAt(0)
		return editor.contains(range.startContainer) ? range : null
	}

	const textBeforeCaret = () => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return ''
		}
		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) {
			return ''
		}
		const caret = selection.getRangeAt(0)
		if (!editor.contains(caret.startContainer)) {
			return ''
		}
		const range = document.createRange()
		range.selectNodeContents(editor)
		try {
			range.setEnd(caret.startContainer, caret.startOffset)
		} catch {
			return ''
		}
		const fragment = range.cloneContents()
		let buffer = ''
		const visit = (node: ChildNode) => {
			if (node.nodeType === 3) {
				buffer += node.nodeValue ?? ''
				return
			}
			if (node.nodeType !== 1) {
				return
			}
			const element = node as HTMLElement
			if (isChipElement(element)) {
				buffer = ''
				return
			}
			if (element.tagName === 'BR') {
				buffer += '\n'
				return
			}
			element.childNodes.forEach(visit)
		}
		fragment.childNodes.forEach(visit)
		return buffer
	}

	const resetTrigger = () => {
		if (!activeTrigger.value) {
			return
		}
		activeTrigger.value = null
		activeRange = null
		options.onTrigger?.({ char: '', query: '', active: false })
	}

	const evaluateTrigger = () => {
		if (!triggerChars.value.length) {
			resetTrigger()
			return
		}
		const buffer = textBeforeCaret()
		let breakIndex = -1
		for (let index = buffer.length - 1; index >= 0; index -= 1) {
			if (/\s/.test(buffer[index])) {
				breakIndex = index
				break
			}
		}
		const word = buffer.slice(breakIndex + 1)
		let triggerIndex = -1
		for (let index = word.length - 1; index >= 0; index -= 1) {
			if (triggerChars.value.includes(word[index])) {
				triggerIndex = index
				break
			}
		}
		if (triggerIndex < 0) {
			resetTrigger()
			return
		}
		const char = word[triggerIndex]
		const query = word.slice(triggerIndex + 1)
		const previous = activeTrigger.value
		if (previous && previous.char === char && previous.query === query) {
			return
		}
		activeTrigger.value = { char, query }
		activeRange = caretRange(query.length + 1)
		options.onTrigger?.({ char, query, active: true, rect: caretRect() })
	}

	const replaceActiveTrigger = (): Range | null => {
		const range = activeRange
		activeTrigger.value = null
		activeRange = null
		if (!range) {
			return null
		}
		range.deleteContents()
		range.collapse(true)
		return range
	}

	const commit = () => {
		const content = readContent()
		options.onUpdate(contentToText(content))
		options.onUpdateContent?.(content)
	}

	const insertChip = (chip: PromptChip) => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return
		}
		const triggerRange = replaceActiveTrigger()
		const node = createChipNode(chip)
		const range = triggerRange ?? liveCaretRange()
		if (range) {
			range.insertNode(node)
			range.setStartAfter(node)
			range.collapse(true)
			if (inBrowser()) {
				editor.focus()
				applyRange(range)
			}
		} else {
			editor.appendChild(node)
			placeCaretAtEnd()
		}
		commit()
		options.onChipAdd?.(chip)
		if (triggerRange) {
			options.onTrigger?.({ char: '', query: '', active: false })
		}
	}

	const removeChip = (id: number | string | symbol) => {
		const node = findChipNode(id)
		if (!node || !inBrowser()) {
			return
		}
		const chip = chipStore.get(node)
		const range = document.createRange()
		range.setStartBefore(node)
		range.setEndAfter(node)
		range.deleteContents()
		if (inBrowser()) {
			applyRange(range)
		}
		commit()
		if (chip) {
			options.onChipRemove?.(chip)
		}
	}

	const sliceValue = (value: string) => {
		const {
			maxLength: limit,
			countGraphemes,
			sliceGraphemes
		} = options.counterConfig?.value ?? {}
		if (isNullish(limit)) {
			return value
		}
		if (countGraphemes && sliceGraphemes) {
			return sliceGraphemes(value, limit)
		}
		return value.slice(0, limit)
	}

	const sync = (e?: Event) => {
		let content = readContent()
		let value = contentToText(content)
		if (!isNullish(maxLength.value)) {
			const sliced = sliceValue(value)
			if (sliced !== value) {
				setValue(sliced)
				placeCaretAtEnd()
				content = readContent()
				value = contentToText(content)
			}
		}
		options.onUpdate(value)
		options.onUpdateContent?.(content)
		if (e) {
			options.onInput?.(value, e)
		}
		evaluateTrigger()
	}

	const [isComposing, compositionStartHandler, compositionEndHandler] = useComposition({
		afterComposition: (e) => {
			sync(e)
		}
	})

	const inputHandler = (e: Event) => {
		if (isComposing.value) {
			return
		}
		sync(e)
	}

	const pasteHandler = (e: ClipboardEvent) => {
		if (options.disabled.value || options.readonly.value) {
			return
		}
		options.onPaste?.(e)
		if (e.defaultPrevented) {
			return
		}
		const files = Array.from(e.clipboardData?.files ?? [])
		if (files.length && options.onPasteFiles) {
			e.preventDefault()
			options.onPasteFiles(files, e)
			return
		}
		const text = e.clipboardData?.getData('text/plain')
		if (isNullish(text)) {
			return
		}
		e.preventDefault()
		insertText(text)
		sync(e)
	}

	const keydownHandler = (e: KeyboardEvent) => {
		if (options.disabled.value || options.readonly.value || e.isComposing) {
			return
		}
		if (options.onKeydown?.(e)) {
			return
		}
		if (e.key !== 'Enter') {
			return
		}
		e.preventDefault()
		if (matchesChord(e, newlineChord.value)) {
			insertText('\n')
			sync(e)
			return
		}
		if (matchesChord(e, submitChord.value)) {
			options.onSubmit?.(e)
			return
		}
		insertText('\n')
		sync(e)
	}

	const select = () => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return
		}
		const range = document.createRange()
		range.selectNodeContents(editor)
		applyRange(range)
	}

	const setCaret = (position: PromptCaretPosition) => {
		const editor = editorRef.value
		if (!editor || !inBrowser()) {
			return
		}
		const target =
			position === 'start'
				? 0
				: position === 'end'
					? Number.POSITIVE_INFINITY
					: Math.trunc(position)
		const point = caretPointAt(target)
		if (!point) {
			return
		}
		editor.focus()
		applyRange(rangeAt(point))
	}

	const removeText = (length: number) => {
		if (!inBrowser()) {
			return
		}
		const amount = Math.floor(length)
		if (!Number.isFinite(amount) || amount <= 0) {
			return
		}
		const range = liveCaretRange()
		if (!range) {
			return
		}
		const caret = contentOffsetOf(range.startContainer, range.startOffset)
		const start = Math.max(0, caret - amount)
		if (start === caret) {
			return
		}
		setContent(removeContentRange(readContent(), start, caret))
		setCaret(start)
	}

	const focus = () => editorRef.value?.focus()

	const blur = () => editorRef.value?.blur()

	const updatePlainValue = (content: PromptContent) => {
		const value = contentToText(content)
		if (value !== (options.modelValue.value ?? '')) {
			options.onUpdate(value)
		}
	}

	watch(options.modelValue, (val) => {
		setValue(val ?? '')
	})

	watch(
		() => options.content?.value,
		(val) => {
			const next = val ?? []
			setContent(next)
			if (options.contentControlled?.value) {
				updatePlainValue(next)
			}
		}
	)

	onMounted(() => {
		const initialContent = options.content?.value
		if (initialContent?.length) {
			setContent(initialContent)
			updatePlainValue(initialContent)
			return
		}
		setValue(options.modelValue.value ?? '')
	})

	return {
		editorRef,
		editable,
		maxLength,
		setValue,
		setContent,
		sync,
		resetTrigger,
		select,
		setCaret,
		placeCaretAtEnd,
		insertText,
		removeText,
		focus,
		blur,
		insertChip,
		removeChip,
		getContent: readContent,
		isComposing,
		inputHandler,
		pasteHandler,
		keydownHandler,
		compositionStartHandler,
		compositionEndHandler
	}
}
