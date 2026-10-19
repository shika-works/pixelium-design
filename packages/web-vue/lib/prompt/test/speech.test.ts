import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Prompt from '../index.vue'
import PromptSpeechTrigger from '../../prompt-speech-trigger/index.vue'
import { createMocks } from '../../share/util/test'

class MockSpeechRecognition {
	static instances: MockSpeechRecognition[] = []

	lang = ''
	continuous = false
	interimResults = false

	onstart: (() => void) | null = null
	onend: (() => void) | null = null
	onerror: (() => void) | null = null
	onresult: ((event: any) => void) | null = null

	start = vi.fn()
	stop = vi.fn()
	abort = vi.fn()

	constructor() {
		MockSpeechRecognition.instances.push(this)
	}
}

const speechScope = window as unknown as {
	SpeechRecognition?: new () => any
	webkitSpeechRecognition?: new () => any
}

const wrappers: any[] = []

const mountPrompt = (
	speechConfig: Record<string, any> = {},
	extraSlots: Record<string, any> = {},
	props: Record<string, any> = {}
) => {
	const wrapper = mount(Prompt, {
		props: { modelValue: 'hello', ...props, speechConfig },
		slots: {
			start: () => h(PromptSpeechTrigger),
			...extraSlots
		}
	})
	wrappers.push(wrapper)
	return wrapper
}

const triggerButtonOf = (wrapper: any) =>
	wrapper.findComponent(PromptSpeechTrigger).find('button')

const sendOf = (wrapper: any) => wrapper.find('.px-prompt-send button')

describe('PromptSpeech', () => {
	const { pre, post } = createMocks()
	let originalSpeechRecognition: any
	let originalWebkitSpeechRecognition: any

	beforeEach(() => {
		pre()
		MockSpeechRecognition.instances = []
		originalSpeechRecognition = speechScope.SpeechRecognition
		originalWebkitSpeechRecognition = speechScope.webkitSpeechRecognition
		speechScope.SpeechRecognition = MockSpeechRecognition
	})

	afterEach(() => {
		wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
		speechScope.SpeechRecognition = originalSpeechRecognition
		speechScope.webkitSpeechRecognition = originalWebkitSpeechRecognition
		post()
	})

	it('disables the send button while the recording panel is open', async () => {
		const wrapper = mountPrompt({ mode: 'hold' })

		expect(sendOf(wrapper).classes()).not.toContain('px-button__disabled')

		await triggerButtonOf(wrapper).trigger('click')
		expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(true)
		expect(sendOf(wrapper).classes()).toContain('px-button__disabled')

		await triggerButtonOf(wrapper).trigger('click')
		expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(false)
		expect(sendOf(wrapper).classes()).not.toContain('px-button__disabled')
	})

	it('renders the panel from the forwarded speech slots', async () => {
		const wrapper = mountPrompt(
			{ mode: 'hold' },
			{
				'speech-visualizer': ({ speechPanel }: any) =>
					h(
						'i',
						{ class: 'custom-visualizer' },
						`${speechPanel.levels.length}-${speechPanel.mode}`
					)
			}
		)

		await triggerButtonOf(wrapper).trigger('click')
		await nextTick()
		expect(wrapper.find('.custom-visualizer').text()).toBe('36-hold')
		expect(wrapper.find('.px-prompt-speech-panel-visualizer').exists()).toBe(false)
		expect(wrapper.find('.px-prompt-speech-panel-hold').exists()).toBe(false)
	})

	it('closes the panel without touching the value when the speech mode switches', async () => {
		const wrapper = mountPrompt({ mode: 'click' })

		await triggerButtonOf(wrapper).trigger('click')
		expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(true)
		expect(sendOf(wrapper).classes()).toContain('px-button__disabled')

		await wrapper.setProps({ speechConfig: { mode: 'hold' } })
		await nextTick()

		expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(false)
		expect(sendOf(wrapper).classes()).not.toContain('px-button__disabled')
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	it('replaces the whole panel with the speech-panel slot', async () => {
		const wrapper = mountPrompt(
			{ mode: 'hold' },
			{
				'speech-panel': ({ speech }: any) => h('div', { class: 'custom-panel' }, speech.mode)
			}
		)

		await triggerButtonOf(wrapper).trigger('click')
		await nextTick()
		expect(wrapper.find('.custom-panel').text()).toBe('hold')
		expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(false)
	})

	it('exposes the panel scope to the send slot', async () => {
		const wrapper = mountPrompt(
			{ mode: 'hold' },
			{
				send: ({ speech }: any) =>
					h('i', { class: 'send-probe' }, `${speech.recording}-${speech.mode}`)
			}
		)

		expect(wrapper.find('.send-probe').text()).toBe('false-hold')

		await triggerButtonOf(wrapper).trigger('click')
		await nextTick()
		expect(wrapper.find('.send-probe').text()).toBe('true-hold')
	})

	it('exposes the panel scope to the end slot', async () => {
		const wrapper = mountPrompt(
			{ mode: 'hold' },
			{
				end: ({ speech }: any) =>
					h('i', { class: 'end-probe' }, `${speech.recording}-${speech.mode}`)
			}
		)

		expect(wrapper.find('.end-probe').text()).toBe('false-hold')

		await triggerButtonOf(wrapper).trigger('click')
		await nextTick()
		expect(wrapper.find('.end-probe').text()).toBe('true-hold')
	})

	it('exposes the panel scope to the start slot', async () => {
		const wrapper = mountPrompt(
			{ mode: 'hold' },
			{
				start: ({ speech }: any) =>
					h('i', { class: 'start-probe' }, `${speech.recording}-${speech.mode}`),
				end: () => h(PromptSpeechTrigger)
			}
		)

		expect(wrapper.find('.start-probe').text()).toBe('false-hold')

		await triggerButtonOf(wrapper).trigger('click')
		await nextTick()
		expect(wrapper.find('.start-probe').text()).toBe('true-hold')
	})

	it('disables the speech trigger when the prompt is read only', async () => {
		const wrapper = mountPrompt({}, {}, { readonly: true })

		expect(triggerButtonOf(wrapper).classes()).toContain('px-button__disabled')

		await triggerButtonOf(wrapper).trigger('click')
		expect(MockSpeechRecognition.instances).toHaveLength(0)
		expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(false)
	})

	it.each(['readonly', 'disabled'] as const)(
		'closes the speech mode when the prompt becomes %s',
		async (state) => {
			const wrapper = mountPrompt()

			await triggerButtonOf(wrapper).trigger('click')
			expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(true)
			expect(MockSpeechRecognition.instances).toHaveLength(1)

			await wrapper.setProps({ [state]: true })
			await nextTick()

			expect(wrapper.find('.px-prompt-speech-panel').exists()).toBe(false)
			expect(triggerButtonOf(wrapper).classes()).toContain('px-button__disabled')
			expect(MockSpeechRecognition.instances[0].abort).toHaveBeenCalledTimes(1)
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		}
	)
})
