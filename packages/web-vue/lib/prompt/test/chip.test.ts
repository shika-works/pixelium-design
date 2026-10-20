import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Prompt from '../index.vue'
import PopupWrapper from '../../popup-wrapper/index.vue'
import { createMocks } from '../../share/util/test'
import type { PromptOption } from '../type'

const chip = (id: string, label: string) => ({ id, label })

const editorOf = (wrapper: any) => wrapper.find('.px-prompt-editor-inner')

const placeCaret = (element: HTMLElement, offset: number) => {
	const range = document.createRange()
	range.setStart(element.firstChild as Text, offset)
	range.collapse(true)
	const selection = window.getSelection()
	selection?.removeAllRanges()
	selection?.addRange(range)
}

const typeAndTrigger = async (wrapper: any, text: string) => {
	const editor = editorOf(wrapper)
	editor.element.textContent = text
	placeCaret(editor.element as HTMLElement, text.length)
	await editor.trigger('input')
}

describe('Prompt chip', () => {
	const { pre, post } = createMocks()

	beforeEach(() => {
		pre()
	})

	afterEach(() => {
		post()
	})

	it('renders the inline chips carried by the content model', () => {
		const wrapper = mount(Prompt, {
			props: { defaultContent: [{ type: 'chip', chip: chip('a', '@alice') }] }
		})
		const node = wrapper.find('.px-prompt-chip')
		expect(node.exists()).toBe(true)
		expect(node.text()).toBe('@alice')
		expect(node.attributes('contenteditable')).toBe('false')
	})

	it('keeps the plain value in sync with the chip labels', () => {
		const wrapper = mount(Prompt, {
			props: {
				defaultContent: [
					{ type: 'text', text: 'hi ' },
					{ type: 'chip', chip: chip('a', '@alice') }
				]
			}
		})
		expect(editorOf(wrapper).element.textContent).toBe('hi @alice')
		expect((wrapper.vm as any).getContent()).toEqual([
			{ type: 'text', text: 'hi ' },
			{ type: 'chip', chip: chip('a', '@alice') }
		])
	})

	it('removes a chip through the exposed method and emits chipRemove', async () => {
		const wrapper = mount(Prompt, {
			props: { defaultContent: [{ type: 'chip', chip: chip('a', '@alice') }] }
		})
		;(wrapper.vm as any).removeChip('a')
		await flushPromises()
		expect(wrapper.find('.px-prompt-chip').exists()).toBe(false)
		expect(wrapper.emitted('chipRemove')?.[0]?.[0]).toEqual(chip('a', '@alice'))
	})

	it('re-renders the editor when the controlled content changes', async () => {
		const wrapper = mount(Prompt, {
			props: { content: [{ type: 'chip', chip: chip('a', '@alice') }] }
		})
		expect(wrapper.find('.px-prompt-chip').exists()).toBe(true)
		await wrapper.setProps({ content: [] })
		expect(wrapper.find('.px-prompt-chip').exists()).toBe(false)
	})

	it('reports the active trigger while typing after the trigger character', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@' } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@al')
		const payload = wrapper.emitted('trigger')?.[0]?.[0] as any
		expect(payload).toMatchObject({ char: '@', query: 'al', active: true })
		wrapper.unmount()
	})

	it('replaces the typed trigger query when the chip is inserted', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@' } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@al')
		;(wrapper.vm as any).insertChip(chip('a', '@alice'))
		await flushPromises()
		expect(editorOf(wrapper).element.textContent).toBe('@alice')
		expect(wrapper.findAll('.px-prompt-chip')).toHaveLength(1)
		wrapper.unmount()
	})

	it('selects the first candidate on enter', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice', 'bob'] } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		expect(editorOf(wrapper).element.textContent).toBe('alice')
		expect(wrapper.findAll('.px-prompt-chip')).toHaveLength(1)
		expect(wrapper.emitted('select')?.[0]?.[0]).toBe('alice')
		wrapper.unmount()
	})

	it('moves the active candidate with the arrow keys', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice', 'bob'] } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await editorOf(wrapper).trigger('keydown', { key: 'ArrowDown' })
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		expect(editorOf(wrapper).element.textContent).toBe('bob')
		wrapper.unmount()
	})

	it('filters the candidates by the typed query', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice', 'bob'] } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@b')
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		expect(editorOf(wrapper).element.textContent).toBe('bob')
		wrapper.unmount()
	})

	it('closes the candidates on escape so enter is not captured', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice', 'bob'] } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await editorOf(wrapper).trigger('keydown', { key: 'Escape' })
		await flushPromises()
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		expect(wrapper.findAll('.px-prompt-chip')).toHaveLength(0)
		expect(editorOf(wrapper).element.textContent).toBe('@\n')
		wrapper.unmount()
	})

	it('closes the candidates when clearOnSubmit empties the editor', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice', 'bob'] }, clearOnSubmit: true },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await flushPromises()
		;(wrapper.vm as any).submit()
		await flushPromises()
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		expect(wrapper.emitted('select')).toBeFalsy()
		expect(wrapper.findAll('.px-prompt-chip')).toHaveLength(0)
		expect(editorOf(wrapper).element.textContent).toBe('\n')
		wrapper.unmount()
	})

	it('reopens the candidates after the editor was cleared', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice', 'bob'] }, clearOnSubmit: true },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await flushPromises()
		;(wrapper.vm as any).submit()
		await flushPromises()
		await typeAndTrigger(wrapper, '@')
		const triggers = wrapper.emitted('trigger') ?? []
		expect(triggers[triggers.length - 1]?.[0]).toMatchObject({ active: true })
		wrapper.unmount()
	})

	it('selects an object option using its key, label and chipType', async () => {
		const wrapper = mount(Prompt, {
			props: {
				chipConfig: { trigger: '@', options: [{ key: 1, label: 'Alice', chipType: 'user' }] }
			},
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		const node = wrapper.find('.px-prompt-chip')
		expect(node.text()).toBe('Alice')
		expect(node.classes()).toContain('px-prompt-chip__user')
		expect(node.attributes('data-chip-type')).toBe('user')
		expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({
			key: 1,
			label: 'Alice',
			chipType: 'user'
		})
		wrapper.unmount()
	})

	it('calls a functional chipType with the option itself', async () => {
		const seen: PromptOption[] = []
		const option = {
			key: 'alice',
			label: 'Alice',
			chipType: (target: PromptOption) => {
				seen.push(target)
				return `type-${String(target.key)}`
			}
		} as PromptOption
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: [option] } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		expect(wrapper.find('.px-prompt-chip').classes()).toContain('px-prompt-chip__type-alice')
		expect(seen[0]).toMatchObject({ key: 'alice', label: 'Alice' })
		expect('value' in seen[0]).toBe(false)
		wrapper.unmount()
	})

	it('leaves a string candidate without a chip type', async () => {
		const wrapper = mount(Prompt, {
			props: { chipConfig: { trigger: '@', options: ['alice'] } },
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await editorOf(wrapper).trigger('keydown', { key: 'Enter' })
		await flushPromises()
		const node = wrapper.find('.px-prompt-chip')
		expect(node.classes()).toEqual(['px-prompt-chip'])
		expect(node.attributes('data-chip-type')).toBe('')
		wrapper.unmount()
	})

	it('gives every candidate the key ?? label value', async () => {
		const wrapper = mount(Prompt, {
			props: {
				chipConfig: {
					trigger: '@',
					options: [
						{ key: 'alice-key', label: 'Alice', chipType: 'user' },
						{ label: 'Bob', chipType: 'user' }
					]
				}
			},
			slots: {
				'chip-option': (slotProps: any) =>
					h('span', { class: 'probe' }, String(slotProps.option.value))
			},
			attachTo: document.body
		})
		await typeAndTrigger(wrapper, '@')
		await nextTick()
		const popup = wrapper.findComponent(PopupWrapper)
		expect(popup.findAll('.probe').map((node) => node.text())).toEqual(['alice-key', 'Bob'])
		expect(popup.find('.px-option-list-item__active').text()).toBe('alice-key')
		wrapper.unmount()
	})
})
