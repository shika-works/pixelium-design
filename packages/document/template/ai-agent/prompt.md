[[[zh
# 提示词输入 Prompt

面向 AI 对话场景的富文本输入组件，支持自适应多行输入、chip 提及、附件上传、语音输入与自定义工具栏。
]]]
[[[en
# Prompt

A rich input component for AI conversations, supporting adaptive multi-line input, chip mentions, attachment upload, speech input and a customizable toolbar.
]]]

[[[zh
## 完整示例

输入内容由 `modelValue` 与 `content` 分别维护文本与 chip 片段；`chipConfig` 配置提及的触发字符与候选列表，`uploadConfig` 启用附件上传并用 `attachment` 插槽放置 PromptAttachment，`speechConfig` 启用语音输入。工具栏通过 `start`、`end`、`send` 插槽组合，PromptAction、PromptSwitch、PromptSelect 与 PromptSend 分别提供动作、开关、下拉选择与发送入口。
]]]
[[[en
## Full Example

The input is kept by `modelValue` for the text and by `content` for the chips; `chipConfig` configures the mention triggers and candidates, `uploadConfig` enables the attachment upload with PromptAttachment placed in the `attachment` slot, and `speechConfig` enables the speech input. The toolbar is composed through the `start`, `end` and `send` slots, where PromptAction, PromptSwitch, PromptSelect and PromptSend provide the actions, the switches, the dropdown selection and the send entry.
]]]

<preview path="./prompt-all-features.vue"></preview>

## API

[[[api zh
draggable: 是否允许把文件拖入 Prompt 的输入区域。
pasteable: 是否允许把文件粘贴到 Prompt 的输入区域。

id: PromptChip 的唯一标识。
type: PromptChip 的类型。
label: PromptChip 展示的文本。
value: PromptChip 携带的文本值。
data: PromptChip 携带的自定义数据。

trigger: 唤起候选列表的触发字符。
options: 候选列表的数据。
filter: 候选列表的自定义过滤函数。
dropdownProps: 候选列表弹出层的属性与事件。

char: 触发提及的字符。
query: 触发字符之后已输入的关键词。
active: 候选列表是否展开。
rect: 触发字符所在位置的区域。

modelValue: Prompt 的输入文本。
defaultValue: 非受控模式下初始的输入文本。
content: Prompt 的输入内容，包含文本与 chip 片段。
defaultContent: 非受控模式下初始的输入内容。
shape: Prompt 的外观形状。
borderRadius: Prompt 的圆角，接受数字、百分比或分别设置四个角的数组。
disabled: Prompt 是否禁用。
readonly: Prompt 是否只读。
loading: Prompt 是否处于提交中。
cancellable: 提交中是否允许中断。
placeholder: 输入内容为空时展示的占位文字。
autoSize: 输入区域是否随内容自动增高。
minRow: 输入区域的最小行数。
maxRow: 输入区域的最大行数。
counterConfig: 字数统计的配置，传入后展示计数区域。
submitKey: 触发提交的按键组合。
newlineKey: 插入换行的按键组合。
requireContent: 输入内容为空时是否禁止提交。
clearOnSubmit: 提交后是否清空输入内容。
uploadConfig: 附件上传的配置，传入后启用附件能力。
speechConfig: 语音输入的配置，传入后启用语音能力。
chipConfig: chip 提及的配置。

events.update:modelValue: 输入文本变化时触发。
events.input: 在输入区域中输入时触发。
events.change: 输入区域失去焦点且内容发生变化时触发。
events.submit: 提交时触发，提交入口、提交按键与 `submit` 方法都会触发。
events.cancel: 提交中点击中断入口时触发。
events.clear: 输入内容被清空时触发。
events.focus: 输入区域获得焦点时触发。
events.blur: 输入区域失去焦点时触发。
events.keydown: 在输入区域中按下按键时触发。
events.paste: 在输入区域中粘贴时触发。
events.update:content: 输入内容中的文本或 chip 变化时触发。
events.chipAdd: chip 插入时触发。
events.chipRemove: chip 移除时触发。
events.trigger: 输入提及触发字符时触发。
events.select: 在候选列表中选择一项时触发。

slots.attachment: 附件区域，用于放置 PromptAttachment 等附件内容，作用域提供附件上传的操作，其中未指定文件的操作作用于全部对应文件。
slots.start: 工具栏的起始区域，作用域提供附件上传的操作，其中未指定文件的操作作用于全部对应文件。
slots.end: 工具栏的末尾区域，位于发送入口之前，作用域提供附件上传的操作，其中未指定文件的操作作用于全部对应文件。
slots.send: 发送入口区域，作用域提供附件上传的操作，其中未指定文件的操作作用于全部对应文件。
slots.count: 计数区域。
slots.chip-option: 候选列表中选项的内容。
slots.chip-group-label: 候选列表中分组标题的内容。
slots.speech-panel: 语音录制面板区域，替换内置的 PromptSpeechPanel。
slots.speech-cancel: 语音录制面板的取消入口。
slots.speech-visualizer: 语音录制面板的波形区域。
slots.speech-text: 语音识别的实时文本区域。
slots.speech-accept: 语音录制面板的确认入口。

promptExpose.focus: 让输入区域获得焦点。
promptExpose.blur: 让输入区域失去焦点。
promptExpose.clear: 清空输入内容。
promptExpose.submit: 提交当前的输入内容。
promptExpose.select: 选中输入区域中的全部内容。
promptExpose.insertChip: 在光标处插入 chip。
promptExpose.removeChip: 移除指定 id 的 chip。
promptExpose.insertText: 在光标处插入文本。
promptExpose.getContent: 读取当前的输入内容。
promptExpose.setContent: 覆盖当前的输入内容。
]]]
[[[api en
draggable: Whether files can be dropped into the input area of Prompt.
pasteable: Whether files can be pasted into the input area of Prompt.

id: The unique identifier of PromptChip.
type: The type of PromptChip.
label: The text shown by PromptChip.
value: The text value carried by PromptChip.
data: The custom data carried by PromptChip.

trigger: The characters that open the candidate list.
options: The data of the candidate list.
filter: The custom filter of the candidate list.
dropdownProps: The properties and events of the candidate list popup.

char: The character that triggers the mention.
query: The keyword typed after the trigger character.
active: Whether the candidate list is open.
rect: The area of the position where the trigger character sits.

modelValue: The input text of Prompt.
defaultValue: The initial input text in uncontrolled mode.
content: The input content of Prompt, holding both text and chip segments.
defaultContent: The initial input content in uncontrolled mode.
shape: The appearance shape of Prompt.
borderRadius: The corner radius of Prompt, accepting numbers, percentages or an array for the four corners.
disabled: Whether Prompt is disabled.
readonly: Whether Prompt is read only.
loading: Whether Prompt is submitting.
cancellable: Whether the submission can be aborted while Prompt is loading.
placeholder: The placeholder text shown while the input is empty.
autoSize: Whether the input area grows automatically with the content.
minRow: The minimum number of rows of the input area.
maxRow: The maximum number of rows of the input area.
counterConfig: The configuration of the word counter; the counter area is shown once it is given.
submitKey: The key combination that submits the content.
newlineKey: The key combination that inserts a new line.
requireContent: Whether submitting is forbidden while the input is empty.
clearOnSubmit: Whether the input is cleared after a submission.
uploadConfig: The configuration of the attachment upload; the attachment ability is enabled once it is given.
speechConfig: The configuration of the speech input; the speech ability is enabled once it is given.
chipConfig: The configuration of the chip mentions.

events.update:modelValue: Triggered when the input text changes.
events.input: Triggered while typing in the input area.
events.change: Triggered when the input area loses focus after the content changed.
events.submit: Triggered on submission, fired by the send entry, the submit key and the `submit` method alike.
events.cancel: Triggered when the abort entry is clicked while Prompt is loading.
events.clear: Triggered when the input is cleared.
events.focus: Triggered when the input area gains focus.
events.blur: Triggered when the input area loses focus.
events.keydown: Triggered when a key is pressed in the input area.
events.paste: Triggered when content is pasted into the input area.
events.update:content: Triggered when the text or the chips of the content change.
events.chipAdd: Triggered when a chip is inserted.
events.chipRemove: Triggered when a chip is removed.
events.trigger: Triggered when a mention trigger character is typed.
events.select: Triggered when an option is chosen from the candidate list.

slots.attachment: The attachment area, holding PromptAttachment and other attachment content; its scope provides the attachment actions, and the actions run on every matching file when no file is given.
slots.start: The leading area of the toolbar, whose scope provides the attachment actions, and the actions run on every matching file when no file is given.
slots.end: The trailing area of the toolbar, placed before the send entry, whose scope provides the attachment actions, and the actions run on every matching file when no file is given.
slots.send: The send entry area, whose scope provides the attachment actions, and the actions run on every matching file when no file is given.
slots.count: The counter area.
slots.chip-option: The content of an option in the candidate list.
slots.chip-group-label: The content of a group label in the candidate list.
slots.speech-panel: The speech recording panel area, replacing the internal PromptSpeechPanel.
slots.speech-cancel: The cancel entry of the speech recording panel.
slots.speech-visualizer: The visualizer area of the speech recording panel.
slots.speech-text: The live text area of the speech recognition.
slots.speech-accept: The confirm entry of the speech recording panel.

promptExpose.focus: Focuses the input area.
promptExpose.blur: Removes the focus from the input area.
promptExpose.clear: Clears the input.
promptExpose.submit: Submits the current input.
promptExpose.select: Selects everything inside the input area.
promptExpose.insertChip: Inserts a chip at the caret.
promptExpose.removeChip: Removes the chip with the given id.
promptExpose.insertText: Inserts text at the caret.
promptExpose.getContent: Reads the current input content.
promptExpose.setContent: Overwrites the current input content.
]]]

[[[api prompt-action zh
label: PromptAction 的文本。
disabled: PromptAction 是否禁用。

slots.default: PromptAction 的文本内容。
slots.icon: PromptAction 的图标。
slots.suffix: PromptAction 的尾部内容。
]]]
[[[api prompt-action en
label: The text of PromptAction.
disabled: Whether PromptAction is disabled.

slots.default: The text content of PromptAction.
slots.icon: The icon of PromptAction.
slots.suffix: The trailing content of PromptAction.
]]]

[[[api prompt-switch zh
label: PromptSwitch 的文本。
disabled: PromptSwitch 是否禁用。
modelValue: 受控模式下的激活状态。
defaultValue: 非受控模式下初始的激活状态。
showClose: 激活时是否展示关闭入口。

events.update:modelValue: 激活状态变化时触发。

slots.default: PromptSwitch 的文本内容。
slots.icon: PromptSwitch 的图标。
]]]
[[[api prompt-switch en
label: The text of PromptSwitch.
disabled: Whether PromptSwitch is disabled.
modelValue: The active state in controlled mode.
defaultValue: The initial active state in uncontrolled mode.
showClose: Whether the close entry is shown while it is active.

events.update:modelValue: Triggered when the active state changes.

slots.default: The text content of PromptSwitch.
slots.icon: The icon of PromptSwitch.
]]]

[[[api prompt-select zh
disabled: PromptSelect 是否禁用。
options: 下拉列表的数据。
modelValue: 受控模式下的选中值。
defaultValue: 非受控模式下初始的选中值。
caretDuration: 下拉指示箭头动画的时长。
dropdownProps: 下拉弹出层的属性与事件。

events.update:modelValue: 选中值变化时触发。
events.open: 下拉列表展开时触发。
events.close: 下拉列表关闭时触发。
events.select: 在下拉列表中选择一项时触发。

slots.default: PromptSelect 的文本内容。
slots.icon: PromptSelect 的图标。
slots.option: 下拉列表中选项的内容。
slots.group-label: 下拉列表中分组标题的内容。

promptSelectExpose.open: 展开下拉列表。
promptSelectExpose.close: 关闭下拉列表。
]]]
[[[api prompt-select en
disabled: Whether PromptSelect is disabled.
options: The data of the dropdown list.
modelValue: The selected value in controlled mode.
defaultValue: The initial selected value in uncontrolled mode.
caretDuration: The duration of the animation of the dropdown caret.
dropdownProps: The properties and events of the dropdown popup.

events.update:modelValue: Triggered when the selected value changes.
events.open: Triggered when the dropdown list opens.
events.close: Triggered when the dropdown list closes.
events.select: Triggered when an option is chosen from the dropdown list.

slots.default: The text content of PromptSelect.
slots.icon: The icon of PromptSelect.
slots.option: The content of an option in the dropdown list.
slots.group-label: The content of a group label in the dropdown list.

promptSelectExpose.open: Opens the dropdown list.
promptSelectExpose.close: Closes the dropdown list.
]]]

[[[api prompt-send zh
disabled: PromptSend 是否禁用。
loading: PromptSend 是否处于加载状态。

events.click: 点击发送入口时触发。

slots.trigger: 发送入口区域，替换内置的按钮。
slots.icon: 发送入口的图标。
]]]
[[[api prompt-send en
disabled: Whether PromptSend is disabled.
loading: Whether PromptSend is loading.

events.click: Triggered when the send entry is clicked.

slots.trigger: The send entry area, replacing the internal button.
slots.icon: The icon of the send entry.
]]]

[[[api prompt-attachment zh
abortable: 是否允许中断附件列表中进行中和排队中的上传。
showProgress: 是否展示附件列表的上传进度。
previewable: 是否允许预览附件列表中的图片。
]]]
[[[api prompt-attachment en
abortable: Whether the running and the queued uploads of the attachment list can be aborted.
showProgress: Whether the upload progress is shown in the attachment list.
previewable: Whether the images of the attachment list can be previewed.
]]]

[[[api prompt-speech-trigger zh
slots.trigger: 语音开关区域，替换内置的按钮。
slots.icon: 语音开关的图标。
]]]
[[[api prompt-speech-trigger en
slots.trigger: The speech toggle area, replacing the internal button.
slots.icon: The icon of the speech toggle.
]]]

[[[api prompt-speech-panel zh
slots.cancel: 语音录制面板的取消入口。
slots.visualizer: 语音录制面板的波形区域。
slots.text: 语音识别的实时文本区域。
slots.accept: 语音录制面板的确认入口。
]]]
[[[api prompt-speech-panel en
slots.cancel: The cancel entry of the speech recording panel.
slots.visualizer: The visualizer area of the speech recording panel.
slots.text: The live text area of the speech recognition.
slots.accept: The confirm entry of the speech recording panel.
]]]

[[[api prompt-speech-provider zh
minHz: 频谱分析的最低频率。
maxHz: 频谱分析的最高频率。
minDb: 映射为最小高度的分贝值。
maxDb: 映射为最大高度的分贝值。
smoothing: 频谱变化的平滑系数。
fftSize: 频谱分析使用的采样窗口大小。

count: 波形柱的数量。
minHeight: 波形柱的最小高度。
maxHeight: 波形柱的最大高度。

mode: 语音识别的交互方式。
lang: 语音识别的语言。
barConfig: 波形柱的配置。
spectrumConfig: 音频频谱的配置。
customRecognize: 自定义的识别过程，接管内置的语音识别。
acceptTimeout: 确认录制后等待识别结果的最长时间。

events.update:recording: 录制状态变化时触发。
events.update:live: 实时录制状态变化时触发。
events.accept: 识别结果被确认时触发。

slots.default: PromptSpeechProvider 的内容。
]]]
[[[api prompt-speech-provider en
minHz: The lowest frequency of the spectrum analysis.
maxHz: The highest frequency of the spectrum analysis.
minDb: The decibel value mapped to the minimum height.
maxDb: The decibel value mapped to the maximum height.
smoothing: The smoothing factor of the spectrum changes.
fftSize: The sampling window size used by the spectrum analysis.

count: The number of the visualizer bars.
minHeight: The minimum height of the visualizer bars.
maxHeight: The maximum height of the visualizer bars.

mode: The interaction mode of the speech recognition.
lang: The language of the speech recognition.
barConfig: The configuration of the visualizer bars.
spectrumConfig: The configuration of the audio spectrum.
customRecognize: The custom recognition process, taking over the internal speech recognition.
acceptTimeout: The longest waiting time for the recognition result after the recording is confirmed.

events.update:recording: Triggered when the recording state changes.
events.update:live: Triggered when the live recording state changes.
events.accept: Triggered when a recognition result is confirmed.

slots.default: The content of PromptSpeechProvider.
]]]

### PromptSubmitModifier

```ts
export type PromptSubmitModifier =
	| 'ctrl'
	| 'control'
	| 'meta'
	| 'cmd'
	| 'command'
	| 'alt'
	| 'option'
	| 'shift'
```

### PromptSubmitKey

```ts
type SubmitKeyPrefix =
	| PromptSubmitModifier
	| `${PromptSubmitModifier}+${PromptSubmitModifier}`
	| `${PromptSubmitModifier}+${PromptSubmitModifier}+${PromptSubmitModifier}`

export type PromptSubmitKey = 'enter' | `${SubmitKeyPrefix}+enter`
```

### PromptCounterConfig

```ts
export type PromptCounterConfig = {
	maxLength?: number
	countGraphemes?: (value: string) => number
	sliceGraphemes?: (value: string, limit: number) => string
}
```

### PromptSegment

```ts
export type PromptSegment = { type: 'text'; text: string } | { type: 'chip'; chip: PromptChip }
```

### PromptContent

```ts
export type PromptContent = PromptSegment[]
```

### PromptOption

```ts
export interface PromptOption extends Omit<OptionListOption, 'value'> {
	chipType?: string | ((option: PromptOption) => string)
}
```

### PromptGroupOption

```ts
export interface PromptGroupOption {
	label: string
	key: string | number | symbol
	children: (PromptOption | string)[]
	type: typeof GROUP_OPTION_TYPE
}
```

### PromptUploadScope

```ts
export type UploadProviderScope = {
	fileList: FileInfo[]
	mode: UploadProviderProps['mode']
	size: UploadProviderProps['size']
	disabled: boolean | undefined
	abortable: boolean | undefined
	download: (file: FileInfo) => void
	open: () => void
	addFiles: (files: File[], e?: Event) => void
	submit: (fileId?: string) => void
	retry: (fileId?: string) => void
	abort: (id?: string) => void
	remove: (id: string, e?: MouseEvent) => Promise<void>
	clear: () => void
}

export type PromptUploadScope = UploadProviderScope
```

### FileInfo

```ts
export interface FileInfo {
	id: string
	name: string
	type?: string
	file?: File
	state: 'pending' | 'queueing' | 'uploading' | 'finished' | 'error'
	progress: number
	url?: string
	thumbnailUrl?: string
	response?: any
}
```

### PromptSpeechMode

```ts
export type PromptSpeechMode = 'click' | 'hold'
```

### PromptSpeechPanelScope

```ts
export type PromptSpeechPanelScope = {
	mode: PromptSpeechMode
	recording: boolean
	live: boolean
	committing: boolean
	disabled: boolean
	supported: boolean
	text: string
	pending: boolean
	levels: number[]
	source: 'microphone' | 'simulated' | null
	barConfig: Required<PromptSpeechBarConfig>
	enter: () => void
	cancel: () => void
	accept: () => void
	press: () => void
	release: () => void
}
```

### PromptSelectOption

```ts
export interface PromptSelectOption extends OptionListOption {}

export interface PromptSelectGroupOption extends OptionListGroupOption {
	children: (PromptSelectOption | string)[]
}
```

### CustomRecognizeOptions

```ts
export interface CustomRecognizeOptions {
	stream: MediaStream | null
	audio: () => Promise<Blob | null>
	setText: (text: string, final?: boolean) => void
	end: () => void
	onAccept: (handler: () => void) => void
	onClose: (handler: (committed: boolean) => void) => void
}

export type CustomRecognize = (options: CustomRecognizeOptions) => void
```

[[[slice option-list]]]

[[[slice group-option]]]

[[[slice emit-event]]]

[[[slice rest-attrs]]]
