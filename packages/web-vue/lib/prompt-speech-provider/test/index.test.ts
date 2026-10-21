import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, h, isRef, nextTick, ref, type Ref } from 'vue'
import PromptSpeechProvider from '../index.vue'
import PromptSpeechTrigger from '../../prompt-speech-trigger/index.vue'
import PromptSpeechPanel from '../../prompt-speech-panel/index.vue'
import { PROMPT_PROVIDE } from '../../share/const/provide-key'
import { createMocks } from '../../share/util/test'

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

type SpeechScope = {
	SpeechRecognition?: new () => any
	webkitSpeechRecognition?: new () => any
}

const speechScope = window as unknown as SpeechScope

const lastInstance = () =>
	MockSpeechRecognition.instances[MockSpeechRecognition.instances.length - 1]

const resultEvent = (transcript: string, isFinal: boolean) => ({
	resultIndex: 0,
	results: [{ isFinal, 0: { transcript } }]
})

const wrappers: any[] = []

const mountProvider = (
	providerProps: Record<string, any> = {},
	insertText = vi.fn(),
	disabled: boolean | Ref<boolean> = false,
	readonly: boolean | Ref<boolean> = false
) => {
	const disabledState = computed(() => (isRef(disabled) ? disabled.value : disabled))
	const readonlyState = computed(() => (isRef(readonly) ? readonly.value : readonly))
	const wrapper = mount(PromptSpeechProvider, {
		props: providerProps,
		global: {
			provide: {
				[PROMPT_PROVIDE]: {
					disabled: disabledState,
					readonly: readonlyState,
					insertText
				}
			}
		},
		slots: { default: () => [h(PromptSpeechTrigger), h(PromptSpeechPanel)] }
	})
	wrappers.push(wrapper)
	return wrapper
}

const triggerOf = (wrapper: any) => wrapper.findComponent(PromptSpeechTrigger)

const triggerButtonOf = (wrapper: any) => triggerOf(wrapper).find('button')

const panelOf = (wrapper: any) => wrapper.findComponent(PromptSpeechPanel)

const panelPartOf = (wrapper: any, name: string) =>
	panelOf(wrapper).find(`.px-prompt-speech-panel-${name}`)

const recordingStates = (wrapper: any) =>
	wrapper.emitted('update:recording')?.map((item: any[]) => item[0])

const panelTextOf = (wrapper: any) =>
	panelOf(wrapper).find('.px-prompt-speech-panel-text-value').text()

const panelCaretOf = (wrapper: any) => panelOf(wrapper).find('.px-prompt-speech-panel-caret')

const panelHoldTextOf = (wrapper: any) =>
	panelOf(wrapper).find('.px-prompt-speech-panel-hold-text').text()

const nextTicks = async () => {
	await nextTick()
	await nextTick()
}

const mountCustomProvider = () => {
	let session: any
	const wrapper = mountProvider({
		customRecognize: (options: any) => {
			session = options
		}
	})
	return { wrapper, session: () => session }
}

describe('PromptSpeechProvider', () => {
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

	it('inserts the transcript once the engine ends', async () => {
		const wrapper = mountProvider()

		await triggerButtonOf(wrapper).trigger('click')
		expect(lastInstance().start).toHaveBeenCalledTimes(1)

		lastInstance().onresult?.(resultEvent('hello', true))
		await nextTick()
		expect(wrapper.emitted('accept')).toBeUndefined()

		lastInstance().onend?.()
		await nextTick()
		expect(wrapper.emitted('accept')).toEqual([['hello']])
		expect(recordingStates(wrapper)).toEqual([true, false])
		expect(wrapper.emitted('update:live')).toEqual([[true], [false]])
	})

	it('ends right away when the engine had nothing left to finalize', async () => {
		const wrapper = mountProvider()

		await triggerButtonOf(wrapper).trigger('click')
		lastInstance().onresult?.(resultEvent('hello', true))
		await nextTick()

		await panelPartOf(wrapper, 'accept').trigger('click')
		await nextTick()

		expect(wrapper.emitted('accept')).toEqual([['hello']])
		expect(recordingStates(wrapper)).toEqual([true, false])
	})

	it('ends on the final result the engine returns after the accept', async () => {
		const wrapper = mountProvider()

		await triggerButtonOf(wrapper).trigger('click')
		lastInstance().onresult?.(resultEvent('hello wor', false))
		await nextTick()

		await panelPartOf(wrapper, 'accept').trigger('click')
		expect(recordingStates(wrapper)).toEqual([true])
		expect(wrapper.emitted('accept')).toBeUndefined()
		expect(lastInstance().stop).not.toHaveBeenCalled()

		lastInstance().onresult?.(resultEvent('hello world', true))
		await nextTick()

		expect(wrapper.emitted('accept')).toEqual([['hello world']])
		expect(recordingStates(wrapper)).toEqual([true, false])
	})

	it('inserts the visible text when the accept times out', async () => {
		vi.useFakeTimers()
		try {
			const wrapper = mountProvider()

			await triggerButtonOf(wrapper).trigger('click')
			lastInstance().onresult?.(resultEvent('hello wor', false))
			await nextTick()

			await panelPartOf(wrapper, 'accept').trigger('click')
			expect(wrapper.emitted('accept')).toBeUndefined()

			vi.advanceTimersByTime(3000)
			await nextTick()

			expect(wrapper.emitted('accept')).toEqual([['hello wor']])
			expect(recordingStates(wrapper)).toEqual([true, false])
			expect(lastInstance().abort).toHaveBeenCalled()
		} finally {
			vi.useRealTimers()
		}
	})

	it('discards the transcript when cancelled', async () => {
		const wrapper = mountProvider()

		await triggerButtonOf(wrapper).trigger('click')
		lastInstance().onresult?.(resultEvent('hello', true))
		await nextTick()

		await panelPartOf(wrapper, 'cancel').trigger('click')
		lastInstance().onend?.()
		await nextTick()

		expect(wrapper.emitted('accept')).toBeUndefined()
		expect(recordingStates(wrapper)).toEqual([true, false])
		expect(lastInstance().abort).toHaveBeenCalled()
	})

	it('shows the transcript with a caret until it is finalized', async () => {
		const wrapper = mountProvider()

		await triggerButtonOf(wrapper).trigger('click')
		lastInstance().onresult?.(resultEvent('wor', false))
		await nextTick()

		expect(panelTextOf(wrapper)).toBe('wor')
		expect(panelCaretOf(wrapper).exists()).toBe(true)

		lastInstance().onresult?.(resultEvent('world', true))
		await nextTick()

		expect(panelTextOf(wrapper)).toBe('world')
		expect(panelCaretOf(wrapper).exists()).toBe(false)
	})

	it('records while held and accepts on release in hold mode', async () => {
		const wrapper = mountProvider({ mode: 'hold' })

		await triggerButtonOf(wrapper).trigger('click')
		expect(MockSpeechRecognition.instances).toHaveLength(0)
		expect(panelPartOf(wrapper, 'hold').exists()).toBe(true)
		expect(panelPartOf(wrapper, 'hold').find('button').exists()).toBe(false)
		expect(panelPartOf(wrapper, 'hold').find('.px-prompt-speech-panel-icon').exists()).toBe(
			true
		)
		expect(panelHoldTextOf(wrapper)).toBe('Press and hold to talk')

		await panelOf(wrapper).trigger('pointerdown')
		expect(lastInstance().start).toHaveBeenCalledTimes(1)
		expect(panelPartOf(wrapper, 'hold').exists()).toBe(false)
		expect(panelOf(wrapper).find('.px-prompt-speech-panel-visualizer').exists()).toBe(true)

		lastInstance().onresult?.(resultEvent('hello', true))
		await nextTick()

		await panelOf(wrapper).trigger('pointerup')
		await nextTick()
		expect(wrapper.emitted('accept')).toEqual([['hello']])
		expect(recordingStates(wrapper)).toEqual([true, false])
		expect(wrapper.emitted('update:live')).toEqual([[true], [false]])
	})

	it.each([
		['click', 'hold'],
		['hold', 'click']
	] as const)(
		'abandons the running session when the mode switches from %s to %s',
		async (from, to) => {
			const wrapper = mountProvider({ mode: from })

			await triggerButtonOf(wrapper).trigger('click')
			if (from === 'hold') {
				await panelOf(wrapper).trigger('pointerdown')
			}
			expect(lastInstance().start).toHaveBeenCalledTimes(1)

			lastInstance().onresult?.(resultEvent('hello', true))
			await nextTick()

			await wrapper.setProps({ mode: to })
			await nextTick()

			expect(lastInstance().abort).toHaveBeenCalledTimes(1)
			expect(recordingStates(wrapper)).toEqual([true, false])
			expect(wrapper.emitted('update:live')).toEqual([[true], [false]])
			expect(wrapper.emitted('accept')).toBeUndefined()
			expect(panelOf(wrapper).find('.px-prompt-speech-panel-text-value').exists()).toBe(false)

			if (to === 'hold') {
				await panelOf(wrapper).trigger('pointerdown')
			} else {
				await triggerButtonOf(wrapper).trigger('click')
			}
			await nextTick()

			expect(MockSpeechRecognition.instances).toHaveLength(2)
			expect(lastInstance().start).toHaveBeenCalledTimes(1)
		}
	)

	it('closes the idle hold panel when the mode switches', async () => {
		const wrapper = mountProvider({ mode: 'hold' })

		await triggerButtonOf(wrapper).trigger('click')
		expect(recordingStates(wrapper)).toEqual([true])
		expect(panelPartOf(wrapper, 'hold').exists()).toBe(true)

		await wrapper.setProps({ mode: 'click' })
		await nextTick()

		expect(recordingStates(wrapper)).toEqual([true, false])
		expect(wrapper.emitted('accept')).toBeUndefined()
		expect(panelPartOf(wrapper, 'cancel').exists()).toBe(true)
		expect(MockSpeechRecognition.instances).toHaveLength(0)
	})

	it('inserts the transcript a custom recognizer ends with', async () => {
		const { wrapper, session } = mountCustomProvider()

		await triggerButtonOf(wrapper).trigger('click')
		await nextTicks()
		expect(typeof session()?.setText).toBe('function')

		session().setText('hello')
		await nextTick()
		expect(wrapper.emitted('accept')).toBeUndefined()

		session().end()
		await nextTick()
		expect(wrapper.emitted('accept')).toEqual([['hello']])
		expect(recordingStates(wrapper)).toEqual([true, false])

		session().setText('hello again')
		await nextTick()
		expect(wrapper.emitted('accept')).toEqual([['hello']])
	})

	it('notifies a custom recognizer when the recording is accepted', async () => {
		const { wrapper, session } = mountCustomProvider()
		let accepted = false

		await triggerButtonOf(wrapper).trigger('click')
		await nextTicks()
		session().setText('hello')
		session().onAccept(() => {
			accepted = true
			session().end()
		})

		await panelPartOf(wrapper, 'accept').trigger('click')
		await nextTick()

		expect(accepted).toBe(true)
		expect(wrapper.emitted('accept')).toEqual([['hello']])
		expect(recordingStates(wrapper)).toEqual([true, false])
	})

	it('resolves the recorded audio once the recording is accepted', async () => {
		const { wrapper, session } = mountCustomProvider()

		await triggerButtonOf(wrapper).trigger('click')
		await nextTicks()
		const audio = session().audio()

		await panelPartOf(wrapper, 'accept').trigger('click')
		await expect(audio).resolves.toBeNull()
	})

	it('discards the transcript a cancelled custom recognizer pushes', async () => {
		const { wrapper, session } = mountCustomProvider()
		const closes: boolean[] = []

		await triggerButtonOf(wrapper).trigger('click')
		await nextTicks()
		session().onClose((committed: boolean) => {
			closes.push(committed)
		})

		await panelPartOf(wrapper, 'cancel').trigger('click')
		expect(closes).toEqual([false])
		expect(recordingStates(wrapper)).toEqual([true, false])

		session().setText('hello')
		await nextTick()
		expect(wrapper.emitted('accept')).toBeUndefined()
	})

	it('renders the bars from the bar config', async () => {
		const wrapper = mountProvider({ barConfig: { count: 3, minHeight: 2, maxHeight: 10 } })

		await triggerButtonOf(wrapper).trigger('click')
		await nextTick()

		const visualizer = panelOf(wrapper).find('.px-prompt-speech-panel-visualizer')
		expect((visualizer.element as HTMLElement).style.height).toBe('10px')

		const bars = panelOf(wrapper).findAll('.px-prompt-speech-panel-bar')
		expect(bars).toHaveLength(3)
		bars.forEach((bar: any) => {
			const height = Number.parseFloat((bar.element as HTMLElement).style.height)
			expect(height).toBeGreaterThanOrEqual(2)
			expect(height).toBeLessThanOrEqual(10)
		})
	})

	it('does not enter the recording mode when disabled', async () => {
		const insertText = vi.fn()
		const wrapper = mountProvider({}, insertText, true)

		await triggerButtonOf(wrapper).trigger('click')
		expect(wrapper.emitted('update:recording')).toBeUndefined()
		expect(MockSpeechRecognition.instances).toHaveLength(0)
	})

	it('does not enter the recording mode when read only', async () => {
		const wrapper = mountProvider({}, vi.fn(), false, true)

		expect(triggerButtonOf(wrapper).classes()).toContain('px-button__disabled')

		await triggerButtonOf(wrapper).trigger('click')
		expect(wrapper.emitted('update:recording')).toBeUndefined()
		expect(MockSpeechRecognition.instances).toHaveLength(0)
	})

	it.each(['disabled', 'readonly'] as const)(
		'closes the recording when the prompt becomes %s',
		async (state) => {
			const flag = ref(false)
			const wrapper = mountProvider(
				{},
				vi.fn(),
				state === 'disabled' ? flag : false,
				state === 'readonly' ? flag : false
			)

			await triggerButtonOf(wrapper).trigger('click')
			expect(recordingStates(wrapper)).toEqual([true])
			expect(lastInstance().start).toHaveBeenCalledTimes(1)

			flag.value = true
			await nextTick()

			expect(recordingStates(wrapper)).toEqual([true, false])
			expect(lastInstance().abort).toHaveBeenCalledTimes(1)
			expect(wrapper.emitted('accept')).toBeUndefined()
			expect(triggerButtonOf(wrapper).classes()).toContain('px-button__disabled')
		}
	)

	it('applies the language option when starting', async () => {
		const wrapper = mountProvider({ lang: 'en-US' })

		await triggerButtonOf(wrapper).trigger('click')
		expect(lastInstance().lang).toBe('en-US')
		expect(lastInstance().continuous).toBe(true)
		expect(lastInstance().interimResults).toBe(true)
	})
})
