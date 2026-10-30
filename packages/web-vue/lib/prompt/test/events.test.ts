import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Prompt from '../index.vue'
import { createMocks } from '../../share/util/test'

const editorOf = (wrapper: any) => wrapper.find('.px-prompt-editor-inner')

const pasteEvent = (text: string) => {
	const event = new Event('paste', { bubbles: true, cancelable: true })
	Object.assign(event, { clipboardData: { files: [], getData: () => text } })
	return event
}

describe('Prompt keydown and paste events', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('emits keydown with the native keyboard event', async () => {
		const wrapper = mount(Prompt, { props: { modelValue: 'hello' } })

		await editorOf(wrapper).trigger('keydown', { key: 'a' })

		const payload = wrapper.emitted('keydown')?.[0]?.[0] as KeyboardEvent
		expect(payload).toBeInstanceOf(KeyboardEvent)
		expect(payload.key).toBe('a')
	})

	it('lets a keydown listener veto the default submit', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello' },
			attrs: { onKeydown: (e: KeyboardEvent) => e.preventDefault() }
		})

		await editorOf(wrapper).trigger('keydown', { key: 'Enter', ctrlKey: true })

		expect(wrapper.emitted('submit')).toBeFalsy()
	})

	it('lets a keydown listener veto the newline', async () => {
		const wrapper = mount(Prompt, {
			props: { modelValue: 'hello' },
			attrs: { onKeydown: (e: KeyboardEvent) => e.preventDefault() }
		})

		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })

		expect(editorOf(wrapper).element.textContent).toBe('hello')
		expect(wrapper.emitted('input')).toBeFalsy()
	})

	it('emits paste and lets a listener veto the plain text insertion', async () => {
		const wrapper = mount(Prompt, {
			attrs: { onPaste: (e: ClipboardEvent) => e.preventDefault() }
		})

		editorOf(wrapper).element.dispatchEvent(pasteEvent('pasted'))
		await flushPromises()

		expect(wrapper.emitted('paste')).toBeTruthy()
		expect(wrapper.emitted('input')).toBeFalsy()
	})

	it('inserts the plain text on paste when the listener does not veto', async () => {
		const wrapper = mount(Prompt)

		editorOf(wrapper).element.dispatchEvent(pasteEvent('pasted'))
		await flushPromises()

		expect(wrapper.emitted('paste')).toBeTruthy()
		expect(wrapper.emitted('input')?.[0]?.[0]).toBe('pasted')
	})
})
