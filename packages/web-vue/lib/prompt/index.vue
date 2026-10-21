<script setup lang="ts">
import { computed, nextTick, provide, ref, shallowRef, toRef, useId, useSlots } from 'vue'
import type {
	PromptEvents,
	PromptExpose,
	PromptProps,
	PromptProvide,
	PromptSendScope
} from './type'
import { useDraw } from './draw'
import { useEditor } from './use-editor'
import { useChipCandidates } from './use-chip-candidates'
import { useEditorRows } from './use-editor-rows'
import PromptSend from '../prompt-send/index.vue'
import PromptSpeechProvider from '../prompt-speech-provider/index.vue'
import PromptSpeechPanel from '../prompt-speech-panel/index.vue'
import UploadProvider from '../upload-provider/index.vue'
import type { UploadProviderExpose } from '../upload-provider/type'
import Popup from '../popup/index.vue'
import OptionList from '../option-list/index.vue'
import { PROMPT_PROVIDE } from '../share/const/provide-key'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { useDropZone } from '../share/hook/use-drop-zone'
import { useFocusMode } from '../share/hook/use-focus-mode'
import { isNullish } from 'parsnip-kit'
import PromptAttachment from '../prompt-attachment/index.vue'

defineOptions({
	name: 'Prompt',
	inheritAttrs: false
})

const props = withDefaults(defineProps<PromptProps>(), {
	shape: 'round',
	disabled: false,
	readonly: false,
	loading: false,
	cancellable: true,
	autoSize: true,
	minRow: 1,
	maxRow: Infinity,
	submitKey: 'ctrl+enter',
	newlineKey: 'enter',
	requireContent: true,
	clearOnSubmit: false
})

const emits = defineEmits<PromptEvents>()

const slots = useSlots()

const id = useId()

const uploadRef = shallowRef<UploadProviderExpose | null>(null)

const addFiles = (files: File[], e?: Event) => {
	if (!props.uploadConfig) {
		return
	}
	uploadRef.value?.addFiles(files, e)
}

const uploadDraggable = computed(
	() => !!props.uploadConfig && props.uploadConfig.draggable !== false
)

const uploadPasteable = computed(
	() => !!props.uploadConfig && props.uploadConfig.pasteable !== false
)

const [modelValue, updateModelValue] = useControlledMode('modelValue', props, emits, {
	defaultField: 'defaultValue',
	transform: (val?: string | null) => val ?? ''
})

const [content, updateContent, contentControlled] = useControlledMode('content', props, emits, {
	defaultField: 'defaultContent'
})

const disabledComputed = computed(() => !!props.disabled)
const readonlyComputed = computed(() => !!props.readonly)
const loadingComputed = computed(() => !!props.loading)
const cancellableComputed = computed(() => !!props.cancellable)

const {
	editorRef,
	editable: editorEditable,
	maxLength: counterMaxLength,
	inputHandler,
	keydownHandler,
	pasteHandler,
	compositionStartHandler,
	compositionEndHandler,
	insertText: insertTextAtCaret,
	sync,
	resetTrigger,
	setValue: setEditorValue,
	select: selectEditor,
	setCaret,
	placeCaretAtEnd,
	removeText,
	focus: focusEditor,
	blur: blurEditor,
	insertChip,
	removeChip,
	getContent,
	setContent
} = useEditor({
	modelValue,
	content,
	contentControlled,
	disabled: disabledComputed,
	readonly: readonlyComputed,
	counterConfig: toRef(props, 'counterConfig'),
	submitKey: toRef(props, 'submitKey'),
	newlineKey: toRef(props, 'newlineKey'),
	trigger: computed(() => props.chipConfig?.trigger),
	onUpdate: (value) => updateModelValue(value),
	onUpdateContent: (value) => updateContent(value),
	onInput: (value, e) => emits('input', value, e),
	onSubmit: (e) => submitHandler(e),
	onTrigger: (payload) => triggerHandler(payload),
	onKeydown: (e) => {
		emits('keydown', e)
		if (e.defaultPrevented) {
			return true
		}
		return panelKeydownHandler(e)
	},
	onPaste: (e) => emits('paste', e),
	onChipAdd: (chip) => emits('chipAdd', chip),
	onChipRemove: (chip) => emits('chipRemove', chip),
	onPasteFiles: (files, e) => {
		if (uploadPasteable.value) {
			addFiles(files, e)
		}
	}
})

const insertTextHandler = (text: string) => {
	if (!text) {
		return
	}
	insertTextAtCaret(text)
	sync()
}

const removeTextHandler = (length: number) => {
	removeText(length)
	sync()
}

const speechAcceptHandler = (value: string) => {
	// The surface remounts after the recording panel closes.
	nextTick(() => insertTextHandler(value))
}

const showStop = computed(() => loadingComputed.value && cancellableComputed.value)

const hasContent = computed(
	() => !!modelValue.value?.trim() || (content.value ?? []).some((item) => item.type === 'chip')
)

const canSubmit = computed(
	() =>
		!disabledComputed.value &&
		!loadingComputed.value &&
		(!props.requireContent || hasContent.value)
)

const currentLength = computed(() => {
	const value = modelValue.value
	if (!value) {
		return 0
	}
	const countGraphemes = props.counterConfig?.countGraphemes
	return countGraphemes ? countGraphemes(value) : value.length
})

const counterVisible = computed(() => !!props.counterConfig)

const showPlaceholder = computed(() => !modelValue.value && !!props.placeholder)

const wrapperRef = shallowRef<HTMLDivElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const hoverFlag = ref(false)
const speechRecording = ref(false)
const speechLive = ref(false)

const SPEECH_PANEL_SLOTS = ['cancel', 'visualizer', 'text', 'accept'] as const

const speechPanelSlots = (SPEECH_PANEL_SLOTS as readonly string[]).filter(
	(name) => !!(slots as Record<string, unknown>)[`speech-${name}`]
)

const mouseenterHandler = () => {
	hoverFlag.value = true
}

const mouseleaveHandler = () => {
	hoverFlag.value = false
}

const { editorStyle } = useEditorRows({
	editorRef,
	modelValue,
	autoSize: toRef(props, 'autoSize'),
	minRow: toRef(props, 'minRow'),
	maxRow: toRef(props, 'maxRow')
})

const clearHandler = () => {
	setEditorValue('')
	updateModelValue('')
	updateContent([])
	resetTrigger()
	emits('clear', '')
}

const submitHandler = (e?: KeyboardEvent | MouseEvent) => {
	if (!canSubmit.value) {
		return
	}
	emits('submit', modelValue.value ?? '', e)
	if (props.clearOnSubmit) {
		clearHandler()
	}
}

const cancelHandler = (e?: MouseEvent) => {
	emits('cancel', e)
}

const sendDisabled = computed(() => {
	if (speechRecording.value || disabledComputed.value) {
		return true
	}
	if (loadingComputed.value) {
		return false
	}
	return props.requireContent && !hasContent.value
})

const send = computed<PromptSendScope>(() => ({
	cancel: cancelHandler,
	submit: submitHandler,
	disabled: sendDisabled.value,
	loading: loadingComputed.value,
	cancellable: cancellableComputed.value
}))

const popupRef = shallowRef<InstanceType<typeof Popup> | null>(null)

const {
	dropdownVisible,
	anchorStyle,
	optionListOptions,
	activeValues,
	triggerHandler,
	popupVisibleUpdateHandler,
	selectHandler,
	panelKeydownHandler
} = useChipCandidates({
	chipConfig: computed(() => props.chipConfig),
	wrapperRef,
	popupRef,
	insertChip,
	onSelect: (option, e) => emits('select', option, e),
	onTrigger: (payload) => emits('trigger', payload)
})

const { dragOver, dragOverHandler, dragLeaveHandler, dropHandler } = useDropZone({
	isEnabled: () => uploadDraggable.value && !disabledComputed.value && !readonlyComputed.value,
	onDrop: (files, e) => addFiles(files, e)
})

const { focusMode, focusHandler, blurHandler, popupMousedownHandler, wrapperMousedownHandler } =
	useFocusMode(
		{
			onFocus: (e, isFirstFocus) => {
				if (isFirstFocus) {
					emits('focus', e)
				}
			},
			onBlur: (e) => {
				emits('blur', e)
				emits('change', modelValue.value ?? '', e)
			},
			onWrapperMousedown: (e) => {
				const target = e.target as HTMLElement | null
				return !target?.closest('.px-prompt-toolbar')
			}
		},
		editorRef
	)

defineExpose<PromptExpose>({
	focus: () => focusEditor(),
	blur: () => blurEditor(),
	clear: () => clearHandler(),
	submit: () => submitHandler(),
	select: () => selectEditor(),
	setCaret: (position) => setCaret(position),
	placeCaretAtEnd: () => placeCaretAtEnd(),
	insertChip: (chip) => insertChip(chip),
	removeChip: (id) => removeChip(id),
	insertText: (text) => insertTextHandler(text),
	removeText: (length) => removeTextHandler(length),
	getContent: () => getContent(),
	setContent: (value) => setContent(value)
})

provide<PromptProvide>(PROMPT_PROVIDE, {
	disabled: disabledComputed,
	readonly: readonlyComputed,
	loading: loadingComputed,
	cancellable: cancellableComputed,
	focusMode,
	canSubmit,
	submit: () => submitHandler(),
	insertText: insertTextHandler,
	id
})

const activeFlag = computed(() => focusMode.value || dragOver.value)

useDraw(wrapperRef, canvasRef, {
	shape: toRef(props, 'shape'),
	borderRadius: toRef(props, 'borderRadius'),
	disabled: disabledComputed,
	readonly: readonlyComputed,
	hoverFlag,
	focusMode: activeFlag
})
</script>

<template>
	<UploadProvider
		ref="uploadRef"
		v-bind="props.uploadConfig ?? {}"
		:disabled="disabledComputed || readonlyComputed"
	>
		<template #default="{ upload }">
			<div
				class="pixelium px-prompt"
				v-bind="$attrs"
				ref="wrapperRef"
				:class="[
					`px-prompt__${props.shape}`,
					{
						'px-prompt__focus': focusMode,
						'px-prompt__dragover': dragOver,
						'px-prompt__disabled': disabledComputed,
						'px-prompt__readonly': readonlyComputed
					}
				]"
				@mousedown="wrapperMousedownHandler"
				@mouseenter="mouseenterHandler"
				@mouseleave="mouseleaveHandler"
				@focusin="focusHandler"
				@focusout="blurHandler"
				@dragover.prevent="dragOverHandler"
				@dragleave="dragLeaveHandler"
				@drop.prevent="dropHandler"
			>
				<Popup
					ref="popupRef"
					placement="bottom-start"
					:offset="4"
					:arrow="false"
					trigger="click"
					:visible="dropdownVisible"
					@update:visible="popupVisibleUpdateHandler"
					:content-props="{ onMousedown: popupMousedownHandler }"
					esc-to-close
					v-bind="props.chipConfig?.dropdownProps ?? {}"
				>
					<span class="px-prompt-anchor" :style="anchorStyle"></span>
					<template #content>
						<OptionList
							:options="optionListOptions"
							:active-values="activeValues"
							@select="selectHandler"
						>
							<template v-if="slots['chip-option']" #option="{ option }">
								<slot name="chip-option" :option="option"></slot>
							</template>
							<template v-if="slots['chip-group-label']" #group-label="{ option }">
								<slot name="chip-group-label" :option="option"></slot>
							</template>
						</OptionList>
					</template>
				</Popup>
				<canvas ref="canvasRef" class="px-prompt-canvas"></canvas>
				<PromptSpeechProvider
					v-bind="props.speechConfig ?? {}"
					v-slot="{ speech }"
					@update:recording="speechRecording = $event"
					@update:live="speechLive = $event"
					@accept="speechAcceptHandler"
				>
					<div class="px-prompt-surface">
						<div
							v-if="upload.fileList.length && !speechRecording"
							class="px-prompt-attachment-area"
						>
							<slot name="attachment" :upload="upload">
								<PromptAttachment></PromptAttachment>
							</slot>
						</div>
						<slot v-if="speechRecording" name="speech-panel" :speech="speech">
							<PromptSpeechPanel>
								<template v-for="name in speechPanelSlots" #[name]>
									<slot :name="`speech-${name}`" :speech="speech"></slot>
								</template>
							</PromptSpeechPanel>
						</slot>
						<div v-else class="px-prompt-editor" :style="editorStyle">
							<div
								ref="editorRef"
								class="px-prompt-editor-inner"
								:contenteditable="editorEditable"
								spellcheck="false"
								@input="inputHandler"
								@keydown="keydownHandler"
								@paste="pasteHandler"
								@compositionstart="compositionStartHandler"
								@compositionend="compositionEndHandler"
							></div>
							<div v-if="showPlaceholder" class="px-prompt-placeholder">
								{{ props.placeholder }}
							</div>
						</div>
						<div v-show="!speechLive" class="px-prompt-toolbar">
							<div class="px-prompt-toolbar-start">
								<slot name="start" :upload="upload" :send="send" :speech="speech"></slot>
							</div>
							<div class="px-prompt-toolbar-end">
								<div v-if="counterVisible" class="px-prompt-count">
									<slot
										name="count"
										:value="modelValue ?? ''"
										:count="currentLength"
										:max-length="counterMaxLength"
									>
										<span>
											{{ currentLength
											}}{{ isNullish(counterMaxLength) ? '' : ' / ' + counterMaxLength }}
										</span>
									</slot>
								</div>
								<slot name="end" :upload="upload" :send="send" :speech="speech"></slot>
								<slot name="send" :upload="upload" :send="send" :speech="speech">
									<PromptSend
										:disabled="sendDisabled"
										@click="showStop ? cancelHandler() : submitHandler()"
									></PromptSend>
								</slot>
							</div>
						</div>
					</div>
				</PromptSpeechProvider>
			</div>
		</template>
	</UploadProvider>
</template>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
