import type { ComputedRef, Ref } from 'vue'
import type { OptionListOption } from '../option-list/type'
import type { PopupEvents, PopupProps } from '../popup/type'
import type { EmitEvent, NumberOrPercentage } from '../share/type'
import type { UploadProviderProps, UploadProviderScope } from '../upload-provider/type'
import type { PromptSpeechProviderProps } from '../prompt-speech-provider/type'
import type { GROUP_OPTION_TYPE } from '../share/const'

export type PromptSubmitModifier =
	| 'ctrl'
	| 'control'
	| 'meta'
	| 'cmd'
	| 'command'
	| 'alt'
	| 'option'
	| 'shift'

type SubmitKeyPrefix =
	| PromptSubmitModifier
	| `${PromptSubmitModifier}+${PromptSubmitModifier}`
	| `${PromptSubmitModifier}+${PromptSubmitModifier}+${PromptSubmitModifier}`

export type PromptSubmitKey = 'enter' | `${SubmitKeyPrefix}+enter`

export type PromptCounterConfig = {
	/**
	 * @property {number} [maxLength]
	 * @version 0.2.1
	 */
	maxLength?: number
	/**
	 * @property {(value: string) => number} [countGraphemes]
	 * @version 0.2.1
	 */
	countGraphemes?: (value: string) => number
	/**
	 * @property {(value: string, limit: number) => string} [sliceGraphemes]
	 * @version 0.2.1
	 */
	sliceGraphemes?: (value: string, limit: number) => string
}

export type PromptUploadConfig = UploadProviderProps & {
	/**
	 * @property {boolean} [draggable=true]
	 * @version 0.2.1
	 */
	draggable?: boolean
	/**
	 * @property {boolean} [pasteable=true]
	 * @version 0.2.1
	 */
	pasteable?: boolean
}

export type PromptUploadScope = UploadProviderScope

export type PromptChip = {
	/**
	 * @property {number | string | symbol} id
	 * @version 0.2.1
	 */
	id: number | string | symbol
	/**
	 * @property {string} [type]
	 * @version 0.2.1
	 */
	type?: string
	/**
	 * @property {string} label
	 * @version 0.2.1
	 */
	label: string
	/**
	 * @property {string} [value]
	 * @version 0.2.1
	 */
	value?: string
	/**
	 * @property {Record<string, any>} [data]
	 * @version 0.2.1
	 */
	data?: Record<string, any>
}

export type PromptSegment = { type: 'text'; text: string } | { type: 'chip'; chip: PromptChip }

export type PromptContent = PromptSegment[]

export interface PromptOption extends Omit<OptionListOption, 'value'> {
	chipType?: string | ((option: PromptOption) => string)
}

export interface PromptGroupOption {
	label: string
	key: string | number | symbol
	children: (PromptOption | string)[]
	type: typeof GROUP_OPTION_TYPE
}

export type PromptChipConfig = {
	/**
	 * @property {string | string[]} [trigger]
	 * @version 0.2.1
	 */
	trigger?: string | string[]
	/**
	 * @property {(string | PromptOption | PromptGroupOption)[]} [options]
	 * @version 0.2.1
	 */
	options?: (string | PromptOption | PromptGroupOption)[]
	/**
	 * @property {(query: string, options: (string | PromptOption | PromptGroupOption)[]) => (string | PromptOption | PromptGroupOption)[]} [filter]
	 * @version 0.2.1
	 */
	filter?: (
		query: string,
		options: (string | PromptOption | PromptGroupOption)[]
	) => (string | PromptOption | PromptGroupOption)[]
	/**
	 * @property {Omit<PopupProps, 'visible' | 'content'> & EmitEvent<PopupEvents>} [dropdownProps]
	 * @version 0.2.1
	 */
	dropdownProps?: Omit<PopupProps, 'visible' | 'content'> & EmitEvent<PopupEvents>
}

export type PromptTriggerPayload = {
	/**
	 * @property {string} char
	 * @version 0.2.1
	 */
	char: string
	/**
	 * @property {string} query
	 * @version 0.2.1
	 */
	query: string
	/**
	 * @property {boolean} active
	 * @version 0.2.1
	 */
	active: boolean
	/**
	 * @property {DOMRect | undefined} [rect]
	 * @version 0.2.1
	 */
	rect?: DOMRect
}

export type PromptProps = {
	/**
	 * @property {string | null} [modelValue]
	 * @version 0.2.1
	 */
	modelValue?: string | null
	/**
	 * @property {string | null} [defaultValue]
	 * @version 0.2.1
	 */
	defaultValue?: string | null
	/**
	 * @property {PromptContent | null} [content]
	 * @version 0.2.1
	 */
	content?: PromptContent | null
	/**
	 * @property {PromptContent | null} [defaultContent]
	 * @version 0.2.1
	 */
	defaultContent?: PromptContent | null
	/**
	 * @property {'rect' | 'round'} [shape='round']
	 * @version 0.2.1
	 */
	shape?: 'rect' | 'round'
	/**
	 * @property {NumberOrPercentage | NumberOrPercentage[]} [borderRadius]
	 * @version 0.2.1
	 */
	borderRadius?: NumberOrPercentage | NumberOrPercentage[]
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.1
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [readonly=false]
	 * @version 0.2.1
	 */
	readonly?: boolean
	/**
	 * @property {boolean} [loading=false]
	 * @version 0.2.1
	 */
	loading?: boolean
	/**
	 * @property {boolean} [cancellable=true]
	 * @version 0.2.1
	 */
	cancellable?: boolean
	/**
	 * @property {string} [placeholder]
	 * @version 0.2.1
	 */
	placeholder?: string
	/**
	 * @property {boolean} [autoSize=true]
	 * @version 0.2.1
	 */
	autoSize?: boolean
	/**
	 * @property {number} [minRow=1]
	 * @version 0.2.1
	 */
	minRow?: number
	/**
	 * @property {number} [maxRow=Infinity]
	 * @version 0.2.1
	 */
	maxRow?: number
	/**
	 * @property {PromptCounterConfig} [counterConfig]
	 * @version 0.2.1
	 */
	counterConfig?: PromptCounterConfig
	/**
	 * @property {PromptSubmitKey} [submitKey='ctrl+enter']
	 * @version 0.2.1
	 */
	submitKey?: PromptSubmitKey
	/**
	 * @property {PromptSubmitKey} [newlineKey='enter']
	 * @version 0.2.1
	 */
	newlineKey?: PromptSubmitKey
	/**
	 * @property {boolean} [requireContent=true]
	 * @version 0.2.1
	 */
	requireContent?: boolean
	/**
	 * @property {boolean} [clearOnSubmit=false]
	 * @version 0.2.1
	 */
	clearOnSubmit?: boolean
	/**
	 * @property {PromptUploadConfig} [uploadConfig]
	 * @version 0.2.1
	 */
	uploadConfig?: PromptUploadConfig
	/**
	 * @property {PromptSpeechProviderProps} [speechConfig]
	 * @version 0.2.1
	 */
	speechConfig?: PromptSpeechProviderProps
	/**
	 * @property {PromptChipConfig} [chipConfig]
	 * @version 0.2.1
	 */
	chipConfig?: PromptChipConfig
}

export type PromptEvents = {
	/**
	 * @event update:modelValue
	 * @param {string} value
	 * @version 0.2.1
	 */
	'update:modelValue': [value: string]
	/**
	 * @event input
	 * @param {string} value
	 * @param {Event} e
	 * @version 0.2.1
	 */
	input: [value: string, e: Event]
	/**
	 * @event change
	 * @param {string} value
	 * @param {Event | undefined} e
	 * @version 0.2.1
	 */
	change: [value: string, e?: Event]
	/**
	 * @event submit
	 * @param {string} value
	 * @param {KeyboardEvent | MouseEvent | undefined} e
	 * @version 0.2.1
	 */
	submit: [value: string, e?: KeyboardEvent | MouseEvent]
	/**
	 * @event cancel
	 * @param {MouseEvent | undefined} e
	 * @version 0.2.1
	 */
	cancel: [e?: MouseEvent]
	/**
	 * @event clear
	 * @param {string} value
	 * @version 0.2.1
	 */
	clear: [value: string]
	/**
	 * @event focus
	 * @param {FocusEvent} e
	 * @version 0.2.1
	 */
	focus: [e: FocusEvent]
	/**
	 * @event blur
	 * @param {FocusEvent} e
	 * @version 0.2.1
	 */
	blur: [e: FocusEvent]
	/**
	 * @event keydown
	 * @param {KeyboardEvent} e
	 * @version 0.2.1
	 */
	keydown: [e: KeyboardEvent]
	/**
	 * @event paste
	 * @param {ClipboardEvent} e
	 * @version 0.2.1
	 */
	paste: [e: ClipboardEvent]
	/**
	 * @event update:content
	 * @param {PromptContent} content
	 * @version 0.2.1
	 */
	'update:content': [content: PromptContent]
	/**
	 * @event chipAdd
	 * @param {PromptChip} chip
	 * @version 0.2.1
	 */
	chipAdd: [chip: PromptChip]
	/**
	 * @event chipRemove
	 * @param {PromptChip} chip
	 * @version 0.2.1
	 */
	chipRemove: [chip: PromptChip]
	/**
	 * @event trigger
	 * @param {PromptTriggerPayload} payload
	 * @version 0.2.1
	 */
	trigger: [payload: PromptTriggerPayload]
	/**
	 * @event select
	 * @param {string | PromptOption} option
	 * @param {MouseEvent | KeyboardEvent} e
	 * @version 0.2.1
	 */
	select: [option: string | PromptOption, e: MouseEvent | KeyboardEvent]
}

export type PromptSendScope = {
	/**
	 * @property {(e?: MouseEvent) => void} cancel
	 * @version 0.2.1
	 */
	cancel: (e?: MouseEvent) => void
	/**
	 * @property {(e?: KeyboardEvent | MouseEvent) => void} submit
	 * @version 0.2.1
	 */
	submit: (e?: KeyboardEvent | MouseEvent) => void
	/**
	 * @property {boolean} disabled
	 * @version 0.2.1
	 */
	disabled: boolean
	/**
	 * @property {boolean} loading
	 * @version 0.2.1
	 */
	loading: boolean
	/**
	 * @property {boolean} cancellable
	 * @version 0.2.1
	 */
	cancellable: boolean
}

export type PromptSlots = {
	/**
	 * @slot attachment
	 * @param {PromptUploadScope | undefined} upload
	 * @version 0.2.1
	 */
	attachment: {}
	/**
	 * @slot start
	 * @param {PromptUploadScope | undefined} upload
	 * @param {PromptSendScope} send
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	start: {}
	/**
	 * @slot end
	 * @param {PromptUploadScope | undefined} upload
	 * @param {PromptSendScope} send
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	end: {}
	/**
	 * @slot send
	 * @param {PromptUploadScope | undefined} upload
	 * @param {PromptSendScope} send
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	send: {}
	/**
	 * @slot count
	 * @param {string} value
	 * @param {number} count
	 * @param {number | undefined} maxLength
	 * @version 0.2.1
	 */
	count: {}
	/**
	 * @slot chip-option
	 * @param {string | PromptOption} option
	 * @version 0.2.1
	 */
	'chip-option': {}
	/**
	 * @slot chip-group-label
	 * @param {PromptGroupOption} option
	 * @version 0.2.1
	 */
	'chip-group-label': {}
	/**
	 * @slot speech-panel
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	'speech-panel': {}
	/**
	 * @slot speech-cancel
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	'speech-cancel': {}
	/**
	 * @slot speech-visualizer
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	'speech-visualizer': {}
	/**
	 * @slot speech-text
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	'speech-text': {}
	/**
	 * @slot speech-accept
	 * @param {PromptSpeechPanelScope} speech
	 * @version 0.2.1
	 */
	'speech-accept': {}
}

export type PromptExpose = {
	/**
	 * @property {() => void} focus
	 * @version 0.2.1
	 */
	focus: () => void
	/**
	 * @property {() => void} blur
	 * @version 0.2.1
	 */
	blur: () => void
	/**
	 * @property {() => void} clear
	 * @version 0.2.1
	 */
	clear: () => void
	/**
	 * @property {() => void} submit
	 * @version 0.2.1
	 */
	submit: () => void
	/**
	 * @property {() => void} select
	 * @version 0.2.1
	 */
	select: () => void
	/**
	 * @property {(chip: PromptChip) => void} insertChip
	 * @version 0.2.1
	 */
	insertChip: (chip: PromptChip) => void
	/**
	 * @property {(id: number | string | symbol) => void} removeChip
	 * @version 0.2.1
	 */
	removeChip: (id: number | string | symbol) => void
	/**
	 * @property {(text: string) => void} insertText
	 * @version 0.2.1
	 */
	insertText: (text: string) => void
	/**
	 * @property {() => PromptContent} getContent
	 * @version 0.2.1
	 */
	getContent: () => PromptContent
	/**
	 * @property {(content: PromptContent) => void} setContent
	 * @version 0.2.1
	 */
	setContent: (content: PromptContent) => void
}

export type PromptProvide = {
	disabled: ComputedRef<boolean>
	readonly: ComputedRef<boolean>
	loading: ComputedRef<boolean>
	cancellable: ComputedRef<boolean>
	focusMode: Ref<boolean>
	canSubmit: ComputedRef<boolean>
	submit: () => void
	insertText: (text: string) => void
	id: string
}
