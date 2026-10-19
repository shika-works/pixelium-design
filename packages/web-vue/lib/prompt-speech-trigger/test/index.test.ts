import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, h } from 'vue'
import PromptSpeechTrigger from '../index.vue'
import PromptSpeechProvider from '../../prompt-speech-provider/index.vue'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'

type SpeechScope = {
	SpeechRecognition?: new () => any
	webkitSpeechRecognition?: new () => any
}

const speechScope = window as unknown as SpeechScope

class MockSpeechRecognition {
	static instances: MockSpeechRecognition[] = []

	lang = ''
	continuous = false
	interimResults = false

	onstart: (() => void) | null = null
	onend: (() => void) | null = null
	onerror: ((event: any) => void) | null = null
	onresult: ((event: any) => void) | null = null

	start = vi.fn()
	stop = vi.fn()
	abort = vi.fn()

	constructor() {
		MockSpeechRecognition.instances.push(this)
	}
}

const lastInstance = () =>
	MockSpeechRecognition.instances[MockSpeechRecognition.instances.length - 1]

const wrappers: any[] = []

const mountTrigger = (
	options: {
		providerProps?: Record<string, any>
		disabled?: boolean
		slots?: Record<string, any>
	} = {}
) => {
	const wrapper = mount(PromptSpeechProvider, {
		props: options.providerProps ?? {},
		global: {
			provide: {
				[PROMPT_PROVIDE]: {
					disabled: computed(() => !!options.disabled),
					insertText: vi.fn()
				}
			}
		},
		slots: { default: () => h(PromptSpeechTrigger, null, options.slots) }
	})
	wrappers.push(wrapper)
	return wrapper
}

const triggerOf = (wrapper: any) => wrapper.findComponent(PromptSpeechTrigger)

const rootOf = (wrapper: any) => triggerOf(wrapper).find('.px-prompt-speech-trigger')

const buttonOf = (wrapper: any) => rootOf(wrapper).find('button')

const recordingStates = (wrapper: any) =>
	wrapper.emitted('update:recording')?.map((item: any[]) => item[0])

describe('PromptSpeechTrigger', () => {
	const { pre, post } = createMocks()
	let originalSpeechRecognition: SpeechScope['SpeechRecognition']
	let originalWebkitSpeechRecognition: SpeechScope['webkitSpeechRecognition']

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

	it('enters and cancels the recording mode on click', async () => {
		const wrapper = mountTrigger()

		await buttonOf(wrapper).trigger('click')
		expect(recordingStates(wrapper)).toEqual([true])
		expect(lastInstance().start).toHaveBeenCalledTimes(1)
		expect(rootOf(wrapper).classes()).toContain('px-prompt-speech-trigger__active')
		expect(buttonOf(wrapper).classes()).toContain('px-button__info')

		await buttonOf(wrapper).trigger('click')
		expect(recordingStates(wrapper)).toEqual([true, false])
		expect(lastInstance().abort).toHaveBeenCalledTimes(1)
		expect(rootOf(wrapper).classes()).not.toContain('px-prompt-speech-trigger__active')
		expect(buttonOf(wrapper).classes()).not.toContain('px-button__info')
	})

	it('is disabled and inert when the prompt disables it', async () => {
		const wrapper = mountTrigger({ disabled: true })
		expect(buttonOf(wrapper).classes()).toContain('px-button__disabled')

		await buttonOf(wrapper).trigger('click')
		expect(wrapper.emitted('update:recording')).toBeUndefined()
		expect(MockSpeechRecognition.instances).toHaveLength(0)
	})

	it('is disabled and inert without a speech provider', async () => {
		const wrapper = mount(PromptSpeechTrigger)
		wrappers.push(wrapper)

		expect(wrapper.classes()).toContain('px-prompt-speech-trigger__disabled')
		await wrapper.find('button').trigger('click')
		expect(MockSpeechRecognition.instances).toHaveLength(0)
	})

	it('is disabled when the browser has no speech recognition', async () => {
		delete speechScope.SpeechRecognition
		delete speechScope.webkitSpeechRecognition

		const wrapper = mountTrigger()
		expect(buttonOf(wrapper).classes()).toContain('px-button__disabled')

		await buttonOf(wrapper).trigger('click')
		expect(wrapper.emitted('update:recording')).toBeUndefined()
	})

	it('renders the icon slot', () => {
		const wrapper = mountTrigger({
			slots: { icon: () => h('span', { class: 'icon-slot' }) }
		})

		expect(wrapper.find('.icon-slot').exists()).toBe(true)
	})

	it('replaces the default button with the trigger slot', async () => {
		const wrapper = mountTrigger({
			slots: {
				trigger: (scope: any) => h('i', { class: 'custom-trigger', onClick: scope.toggle })
			}
		})

		expect(buttonOf(wrapper).exists()).toBe(false)

		await triggerOf(wrapper).find('.custom-trigger').trigger('click')
		expect(recordingStates(wrapper)).toEqual([true])
	})
})
