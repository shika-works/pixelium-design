[[[zh
# 多行文本 Textarea

这里可以输入很多很多很多很多很多很多的文本。
]]]
[[[en
# Textarea

A very, very, very, very, very large amount of text can be entered here.
]]]
[[[zh
## 基础使用

你可以在这里输入多行文本。传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

You can enter multiple lines of text here. Pass in `modelValue` to enable controlled mode. If not passed or set to `undefined`, it will be uncontrolled mode, in which case you can use the `defaultValue` property as the default value.
]]]
<preview path="./textarea-basic.vue"></preview>

[[[zh
## 行数

`rows` 属性控制默认行数，`minRows` 和 `maxRows` 分别设置行数的最值。当 `autoResize` 为 `true` 时，时将自动调整高度。
]]]
[[[en
## Rows

The `rows` property controls the default number of rows. `minRows` and `maxRows` set the minimum and maximum number of rows. When `autoResize` is `true`, the height will adjust automatically.
]]]
<preview path="./textarea-rows.vue"></preview>

[[[zh
## 手动调整高度

`resize` 控制是否展示手动调整高度控件，默认展示。
]]]
[[[en
## Manual Resize

The `resize` property controls whether the manual resize handle is shown. It is shown by default.
]]]
<preview path="./textarea-resize.vue"></preview>

[[[zh
## 更多配置
Textarea 还拥有 Input 组件的部分功能。
]]]
[[[en
## More Options

Textarea also has some features of the Input component.
]]]
<preview path="./textarea-more.vue"></preview>

## API

[[[api zh
modelValue: 多行文本框的值（受控模式），支持 `v-model`。
defaultValue: 多行文本框的默认值（非受控模式）。
placeholder: 占位符文本。
readonly: 是否只读。
disabled: 是否禁用。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
size: 输入框尺寸。
showCount: 是否展示字数统计。
maxLength: 最大输入长度。
resize: 可否手动调整高度。
autoResize: 可否自动调整高度。
maxRows: 最大行数。
minRows: 最小行数。
rows: 默认行数。
status: 表单验证状态。
countGraphemes: 自定义字数统计函数，如果只传入 `countGraphemes` 而没有 `sliceGraphemes`，`maxLength` 的长度限制不会生效。
sliceGraphemes: 自定义截取长度函数。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
events.change: 输入内容变化时的回调。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.focus: 输入框聚焦时的回调。
events.blur: 输入框失焦时的回调。
events.input: 输入框输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
slots.count: 展示字数统计的插槽。
textareaExpose.focus: 聚焦到当前输入框。
textareaExpose.blur: 取消聚焦当前输入框。
textareaExpose.clear: 清空当前输入框。
textareaExpose.select: 选中当前输入框内容。
]]]

[[[api en
modelValue: Value of the textarea (controlled mode), supports `v-model`.
defaultValue: Default value of the textarea (uncontrolled mode).
placeholder: Placeholder text.
readonly: Read-only state.
disabled: Disabled state.
clearable: Whether to show the clear button.
loading: Whether to show the loading state.
size: Input box size.
showCount: Whether to show character count.
maxLength: Maximum input length.
resize: Whether manual resizing is allowed.
autoResize: Whether automatic resizing is allowed.
maxRows: Maximum number of rows.
minRows: Minimum number of rows.
rows: Default number of rows.
status: Form validation status.
countGraphemes: Custom function for counting characters. If only `countGraphemes` is provided without `sliceGraphemes`, the `maxLength` limit will not take effect.
sliceGraphemes: Custom function for slicing the string.
autofocus: Native `<input>` `autofocus` attribute.
events.change: Callback when the input value changes.
events.clear: Callback when the clear button is clicked and the content is cleared.
events.focus: Callback when the textarea is focused.
events.blur: Callback when the textarea loses focus.
events.input: Callback when the textarea receives input.
events.update:modelValue: Callback to update `modelValue`.
slots.count: Slot for displaying character count.
textareaExpose.focus: Focus the current textarea.
textareaExpose.blur: Remove focus from the current textarea.
textareaExpose.clear: Clear the current textarea.
textareaExpose.select: Select the content of the current textarea.
]]]