import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Prompt from '../index.vue'
import { createMocks } from '../../share/util/test'

const editorOf = (wrapper: any) => wrapper.find('.px-prompt-editor-inner')

const setCaretOf = (wrapper: any, position: 'start' | 'end' | number) =>
	(wrapper.vm as any).setCaret(position)

const selectionOf = () => window.getSelection()

describe('Prompt selection methods', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('moves the caret to a character offset or an edge', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello world' },
			attachTo: document.body
		})
		await flushPromises()
		const editor = editorOf(wrapper)
		setCaretOf(wrapper, 'end')
		let selection = selectionOf()
		expect(selection?.isCollapsed).toBe(true)
		expect(selection?.anchorNode).toBe(editor.element)
		expect(selection?.anchorOffset).toBe(editor.element.childNodes.length)
		setCaretOf(wrapper, 5)
		selection = selectionOf()
		expect(selection?.anchorNode).toBe(editor.element.firstChild)
		expect(selection?.anchorOffset).toBe(5)

		setCaretOf(wrapper, 'start')
		expect(selectionOf()?.anchorOffset).toBe(0)
		wrapper.unmount()
	})

	it('snaps a caret offset inside a chip to the chip boundary', async () => {
		const wrapper = mount(Prompt, {
			props: {
				defaultContent: [
					{ type: 'chip', chip: { id: 'a', label: 'Alice' } },
					{ type: 'text', text: ' and Bob' }
				]
			},
			attachTo: document.body
		})
		await flushPromises()
		const editor = editorOf(wrapper)

		setCaretOf(wrapper, 2)
		expect(selectionOf()?.anchorNode).toBe(editor.element)
		expect(selectionOf()?.anchorOffset).toBe(0)

		setCaretOf(wrapper, 5)
		expect(selectionOf()?.anchorOffset).toBe(1)
		wrapper.unmount()
	})

	it('places the caret at the end of the content', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello' },
			attachTo: document.body
		})
		await flushPromises()
		const editor = editorOf(wrapper)
		;(wrapper.vm as any).placeCaretAtEnd()
		const selection = selectionOf()
		expect(selection?.isCollapsed).toBe(true)
		expect(selection?.anchorNode).toBe(editor.element)
		expect(selection?.anchorOffset).toBe(editor.element.childNodes.length)
		wrapper.unmount()
	})

	it('inserts text at the caret', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello' },
			attachTo: document.body
		})
		await flushPromises()
		setCaretOf(wrapper, 2)
		;(wrapper.vm as any).insertText('XY')
		await flushPromises()
		expect(editorOf(wrapper).element.textContent).toBe('heXYllo')
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('heXYllo')
		wrapper.unmount()
	})

	it('inserts a chip at the caret and emits chipAdd', async () => {
		const chip = { id: 'a', label: '@alice' }
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hi ' },
			attachTo: document.body
		})
		await flushPromises()
		setCaretOf(wrapper, 3)
		;(wrapper.vm as any).insertChip(chip)
		await flushPromises()
		expect(wrapper.findAll('.px-prompt-chip')).toHaveLength(1)
		expect(editorOf(wrapper).element.textContent).toBe('hi @alice')
		expect(wrapper.emitted('chipAdd')?.[0]?.[0]).toEqual(chip)
		wrapper.unmount()
	})

	it('selects the whole content', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello' },
			attachTo: document.body
		})
		await flushPromises()
		;(wrapper.vm as any).select()
		const selection = selectionOf()
		expect(selection?.isCollapsed).toBe(false)
		expect(selection?.getRangeAt(0).toString()).toBe('hello')
		wrapper.unmount()
	})

	it('removes the given number of characters before the caret', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello world' },
			attachTo: document.body
		})
		await flushPromises()
		setCaretOf(wrapper, 5)
		;(wrapper.vm as any).removeText(3)
		await flushPromises()
		expect(editorOf(wrapper).element.textContent).toBe('he world')
		expect(selectionOf()?.anchorOffset).toBe(2)
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('he world')
		wrapper.unmount()
	})

	it('drops a whole chip covered by removeText', async () => {
		const wrapper = mount(Prompt, {
			props: {
				defaultContent: [
					{ type: 'chip', chip: { id: 'a', label: 'Alice' } },
					{ type: 'text', text: ' hi' }
				]
			},
			attachTo: document.body
		})
		await flushPromises()
		setCaretOf(wrapper, 'end')
		;(wrapper.vm as any).removeText(2)
		await flushPromises()
		expect(wrapper.find('.px-prompt-chip').exists()).toBe(true)
		expect(editorOf(wrapper).element.textContent).toBe('Alice ')

		setCaretOf(wrapper, 'end')
		;(wrapper.vm as any).removeText(1)
		await flushPromises()
		expect(wrapper.find('.px-prompt-chip').exists()).toBe(true)
		expect(editorOf(wrapper).element.textContent).toBe('Alice')

		setCaretOf(wrapper, 'end')
		;(wrapper.vm as any).removeText(1)
		await flushPromises()
		expect(wrapper.find('.px-prompt-chip').exists()).toBe(false)
		expect(editorOf(wrapper).element.textContent).toBe('')
		wrapper.unmount()
	})

	it('keeps the exposed edit methods working while disabled', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello', disabled: true },
			attachTo: document.body
		})
		await flushPromises()
		const editor = editorOf(wrapper)
		setCaretOf(wrapper, 'end')
		;(wrapper.vm as any).insertText('!')
		await flushPromises()
		expect(editor.element.textContent).toBe('hello!')
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('hello!')
		;(wrapper.vm as any).removeText(1)
		await flushPromises()
		expect(editor.element.textContent).toBe('hello')
		expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('hello')
		wrapper.unmount()
	})
})
