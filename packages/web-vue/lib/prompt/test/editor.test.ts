import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Prompt from '../index.vue'
import { createMocks } from '../../share/util/test'

const editorOf = (wrapper: any) => wrapper.find('.px-prompt-editor-inner')

describe('Prompt editor', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('syncs the editor content back to the value', async () => {
		const wrapper = mount(Prompt)
		editorOf(wrapper).element.textContent = 'hello editor'
		await editorOf(wrapper).trigger('input')
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('hello editor')
	})

	it('slices the value to counterConfig.maxLength', async () => {
		const wrapper = mount(Prompt, { props: { counterConfig: { maxLength: 3 } } })
		editorOf(wrapper).element.textContent = 'abcdef'
		await editorOf(wrapper).trigger('input')
		expect(editorOf(wrapper).element.textContent).toBe('abc')
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('abc')
	})

	it('shows the counter only when counterConfig is provided', () => {
		const withCounter = mount(Prompt, {
			props: { modelValue: 'abc', counterConfig: { maxLength: 5 } }
		})
		expect(withCounter.find('.px-prompt-count').text()).toContain('3')
		expect(withCounter.find('.px-prompt-count').text()).toContain('5')

		const withoutCounter = mount(Prompt, { props: { modelValue: 'abc' } })
		expect(withoutCounter.find('.px-prompt-count').exists()).toBe(false)
	})

	it('inserts only the plain text when pasting', async () => {
		const wrapper = mount(Prompt)
		const editor = editorOf(wrapper)
		const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
		Object.assign(pasteEvent, { clipboardData: { getData: () => 'pasted text' } })
		editor.element.dispatchEvent(pasteEvent)
		await flushPromises()
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('pasted text')
	})

	it('pastes only the plain text when the clipboard also carries html', async () => {
		const wrapper = mount(Prompt)
		const editor = editorOf(wrapper)
		const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
		Object.assign(pasteEvent, {
			clipboardData: {
				files: [],
				getData: (type: string) => (type === 'text/plain' ? 'plain text' : '<b>rich</b>')
			}
		})
		editor.element.dispatchEvent(pasteEvent)
		await flushPromises()
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('plain text')
	})

	it('ignores input while composing and syncs when the composition ends', async () => {
		const wrapper = mount(Prompt)
		const editor = editorOf(wrapper)
		await editor.trigger('compositionstart')
		editor.element.textContent = 'nihao'
		await editor.trigger('input')
		expect(wrapper.emitted('input')).toBeFalsy()

		editor.element.textContent = 'ni hao'
		await editor.trigger('compositionend')
		await flushPromises()
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('ni hao')
	})

	it('keeps a collapsed caret inside the editor after truncating', async () => {
		const wrapper = mount(Prompt, {
			props: { counterConfig: { maxLength: 3 } },
			attachTo: document.body
		})
		const editor = editorOf(wrapper)
		editor.element.textContent = 'abcdef'
		await editor.trigger('input')
		const selection = window.getSelection()
		expect(selection?.isCollapsed).toBe(true)
		expect(editor.element.contains(selection?.anchorNode ?? null)).toBe(true)
		wrapper.unmount()
	})

	it('submits on ctrl+enter by default and keeps enter as a newline', async () => {
		const submit = mount(Prompt, { props: { modelValue: 'hello' } })
		await editorOf(submit).trigger('keydown', {
			key: 'Enter',
			ctrlKey: true
		})
		expect(submit.emitted('submit')?.[0]?.[0]).toBe('hello')

		const newline = mount(Prompt, { props: { modelValue: 'hello' } })
		await editorOf(newline).trigger('keydown', { key: 'Enter' })
		expect(newline.emitted('submit')).toBeFalsy()
	})

	it('honours a custom submitKey', async () => {
		const chord = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'shift+enter' }
		})
		await editorOf(chord).trigger('keydown', {
			key: 'Enter',
			shiftKey: true
		})
		expect(chord.emitted('submit')?.[0]?.[0]).toBe('hello')

		const tokens = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'control+enter' }
		})
		await editorOf(tokens).trigger('keydown', {
			key: 'Enter',
			ctrlKey: true
		})
		expect(tokens.emitted('submit')?.[0]?.[0]).toBe('hello')

		const alias = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'command+enter' }
		})
		await editorOf(alias).trigger('keydown', {
			key: 'Enter',
			metaKey: true
		})
		expect(alias.emitted('submit')?.[0]?.[0]).toBe('hello')

		const combo = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'shift+ctrl+enter' }
		})
		await editorOf(combo).trigger('keydown', {
			key: 'Enter',
			ctrlKey: true,
			shiftKey: true
		})
		expect(combo.emitted('submit')?.[0]?.[0]).toBe('hello')

		const plain = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'enter', newlineKey: 'shift+enter' }
		})
		await editorOf(plain).trigger('keydown', { key: 'Enter' })
		expect(plain.emitted('submit')?.[0]?.[0]).toBe('hello')

		const exact = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'ctrl+enter' }
		})
		await editorOf(exact).trigger('keydown', {
			key: 'Enter',
			ctrlKey: true,
			shiftKey: true
		})
		expect(exact.emitted('submit')).toBeFalsy()
	})

	it('submits on enter and keeps shift+enter as the newline key', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'enter', newlineKey: 'shift+enter' }
		})
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		expect(wrapper.emitted('submit')?.[0]?.[0]).toBe('hello')

		await editorOf(wrapper).trigger('keydown', { key: 'Enter', shiftKey: true })
		expect(wrapper.emitted('submit')).toHaveLength(1)
		expect(editorOf(wrapper).element.textContent).toBe('hello\n')
	})

	it('gives an identical newlineKey priority over the submitKey', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello', submitKey: 'enter', newlineKey: 'enter' }
		})
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		expect(wrapper.emitted('submit')).toBeFalsy()
		expect(editorOf(wrapper).element.textContent).toBe('hello\n')
	})

	it('inserts a newline on enter instead of submitting by default', async () => {
		const wrapper = mount(Prompt, { props: { modelValue: 'hello' } })
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		expect(wrapper.emitted('submit')).toBeFalsy()
		expect(editorOf(wrapper).element.textContent).toBe('hello\n')
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('hello\n')
	})
})
