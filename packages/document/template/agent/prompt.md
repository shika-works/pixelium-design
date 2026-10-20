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

输入内容由 `modelValue` 与 `content` 分别维护文本与 chip 片段；`chipConfig` 配置提及的触发字符与候选列表（详见 [提示词标签](./prompt-chip)），`uploadConfig` 启用附件上传（详见 [提示词附件](./prompt-attachment)），`speechConfig` 启用语音输入（详见 [提示词语音输入](./prompt-speech)）。工具栏通过 `start`、`end`、`send` 插槽组合：PromptAction、PromptSwitch 与 PromptSelect 提供动作、开关与下拉选择（详见 [提示词操作](./prompt-action)），PromptSend 提供发送入口（详见 [提示词发送](./prompt-send)）。
]]]
[[[en
## Full Example

The input is kept by `modelValue` for the text and by `content` for the chips; `chipConfig` configures the mention triggers and candidates (see [PromptChip](./prompt-chip)), `uploadConfig` enables the attachment upload (see [PromptAttachment](./prompt-attachment)), and `speechConfig` enables the speech input (see [PromptSpeech](./prompt-speech)). The toolbar is composed through the `start`, `end` and `send` slots: PromptAction, PromptSwitch and PromptSelect provide the actions, the switches and the dropdown selection (see [PromptAction](./prompt-action)), and PromptSend provides the send entry (see [PromptSend](./prompt-send)).
]]]

<preview path="./prompt-all-features.vue"></preview>

[[[zh
## 光标与文本操作

除 `focus` 与 `blur` 外，ref 上还有一组直接操作输入区域的方法：`setCaret` 与 `placeCaretAtEnd` 定位光标，`select` 全选，`insertText` 在光标处插入文本，`removeText` 删除光标前的字符，`insertChip` 插入 chip（详见 [提示词标签](./prompt-chip)）。`disabled` 与 `readonly` 只拦截用户输入，这些方法仍然生效，和原生 `input` 的语义一致。下面的例子把这些方法都做成了按钮。
]]]
[[[en
## Caret and Text Operations

Beyond `focus` and `blur`, the ref exposes methods that operate on the input directly: `setCaret` and `placeCaretAtEnd` move the caret, `select` selects everything, `insertText` inserts text at the caret, `removeText` removes characters before it, and `insertChip` inserts a chip (see [PromptChip](./prompt-chip)). `disabled` and `readonly` only block user input; these methods still work, consistent with a native `input`. The following example turns them all into buttons.
]]]

<preview path="./prompt-selection.vue"></preview>

## API

[[[api zh
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
uploadConfig: 附件上传的配置，传入后启用附件能力，详见 [提示词附件](./prompt-attachment)。
speechConfig: 语音输入的配置，传入后启用语音能力，详见 [提示词语音输入](./prompt-speech)。
chipConfig: chip 提及的配置，详见 [提示词标签](./prompt-chip)。

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
promptExpose.setCaret: 将光标移动到指定位置：`start`、`end` 或字符偏移，chip 计为其 label 的长度，偏移落在 chip 内时移动到 chip 之前；`setContent` 之后调用需先 `await nextTick()`。
promptExpose.placeCaretAtEnd: 将光标移动到输入内容的末尾。
promptExpose.insertChip: 在光标处插入 chip。
promptExpose.removeChip: 移除指定 id 的 chip。
promptExpose.insertText: 在光标处插入文本。
promptExpose.removeText: 删除光标前的 `length` 个字符，区间覆盖到的 chip 整体删除。
promptExpose.getContent: 读取当前的输入内容。
promptExpose.setContent: 覆盖当前的输入内容。
promptCounterConfig.maxLength: 输入内容的最大长度。
promptCounterConfig.countGraphemes: 自定义的文本长度统计函数，用于计数与截断。
promptCounterConfig.sliceGraphemes: 自定义的文本截断函数，接收文本与长度上限。
]]]
[[[api en
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
uploadConfig: The configuration of the attachment upload; the attachment ability is enabled once it is given. See [PromptAttachment](./prompt-attachment).
speechConfig: The configuration of the speech input; the speech ability is enabled once it is given. See [PromptSpeech](./prompt-speech).
chipConfig: The configuration of the chip mentions; see [PromptChip](./prompt-chip).

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
promptExpose.setCaret: Moves the caret to the given position: `start`, `end` or a character offset. A chip counts as the length of its label, and an offset inside a chip moves before it. Wait for one `nextTick` before calling it after `setContent`.
promptExpose.placeCaretAtEnd: Moves the caret to the end of the input.
promptExpose.insertChip: Inserts a chip at the caret.
promptExpose.removeChip: Removes the chip with the given id.
promptExpose.insertText: Inserts text at the caret.
promptExpose.removeText: Removes `length` characters before the caret; a chip covered by the range is removed as a whole.
promptExpose.getContent: Reads the current input content.
promptExpose.setContent: Overwrites the current input content.
promptCounterConfig.maxLength: The maximum length of the input.
promptCounterConfig.countGraphemes: Custom function that counts the length of the text.
promptCounterConfig.sliceGraphemes: Custom function that slices the text with a length limit.
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

### PromptSegment

```ts
export type PromptSegment = { type: 'text'; text: string } | { type: 'chip'; chip: PromptChip }
```

### PromptContent

```ts
export type PromptContent = PromptSegment[]
```

### PromptCaretPosition

```ts
export type PromptCaretPosition = 'start' | 'end' | number
```

[[[slice emit-event]]]

[[[slice rest-attrs]]]
