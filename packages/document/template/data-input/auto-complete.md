[[[zh
# 自动填充 AutoComplete

有提示的文本输入框。
]]]
[[[en
# Auto Complete

A text input field with suggestions.
]]]

[[[zh
## 基础使用

传入 `options` 作为选项。传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

Pass `options` as the list of choices. Provide `modelValue` for controlled mode.  
Omit it or set it to `undefined` for uncontrolled mode; in this case you can supply a `defaultValue` as the initial value.
]]]
<preview path="./auto-complete-basic.vue"></preview>

[[[zh
## 禁用选项

`options` 中，选项置 `disabled` 为 `true` 可禁用选项。

]]]
[[[en
## Disabled Options

Inside `options`, set `disabled: true` on any choice to disable it.
]]]
<preview path="./auto-complete-disabled-option.vue"></preview>

[[[zh
## 分组

`options` 中，也支持传入选项组。

]]]
[[[en
## Grouping

`options` also accepts option groups.
]]]
<preview path="./auto-complete-group.vue"></preview>

[[[zh
## 远程加载

设置 `loading`、`showPopoverEmpty` 属性和监听 `input` 事件，实现远程加载时的 UI 变化。

]]]
[[[en
## Remote Loading

Set the `loading` and `showPopoverEmpty` props and listen to the `input` event to reflect remote-loading UI states.

]]]
<preview path="./auto-complete-remote.vue"></preview>

[[[zh
## 追加模式

选中选项后添加到输入框而不是覆盖原内容，需要设置 `append` 属性开启，配合传入 `filter`、`shouldShowPopover` 函数控制弹出框的选项和展示。

]]]

[[[en
## Append Mode

After selecting an option, append it to the existing input instead of replacing the content by enabling the `append` prop.  
Use the `filter` and `shouldShowPopover` functions to control which options appear and when the popover is shown.
]]]
<preview path="./auto-complete-append.vue"></preview>


[[[zh
## 虚拟列表

`virtualScroll` 属性开启虚拟列表，选项数据量大时可以开启提高性能。

]]]
[[[en
## Virtual List

Enabling the `virtualScroll` property activates the virtual list, which can be turned on to improve performance when there is a large amount of option data.
]]]
<preview path="./auto-complete-virtual.vue"></preview>

[[[zh
## 自定义渲染

`option` 插槽自定义选项渲染，`group-label` 插槽自定义分组标签名渲染。

]]]
[[[en
## Custom Rendering
`option` slot customizes option rendering, `group-label` slot customizes group label rendering.
]]]
<preview path="./auto-complete-slot.vue"></preview>

[[[zh
## 更多配置
AutoComplete 还拥有 Input 组件的大部分功能。
]]]
[[[en
## More Options

This AutoComplete has most of Input component's features.
]]]
<preview path="./auto-complete-more.vue"></preview>
## API

[[[api zh
modelValue: 自动填充输入框的值（受控模式），支持 `v-model`。
defaultValue: 自动填充输入框的默认值（非受控模式）。
options: 选项列表。
placeholder: 占位符文本。
disabled: 是否禁用。
readonly: 是否只读。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
showPopoverEmpty: 是否在选项为空时展示弹出框。
shouldShowPopover: 判断输入时是否展示弹出框的函数。
filter: 筛选选项的函数。
append: 追加模式。
size: 自动填充输入框尺寸。
shape: 自动填充输入框形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
status: 表单验证状态。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
virtualScroll: 是否开启虚拟滚动。
virtualListProps: 虚拟列表属性。
optionsDestroyOnHide: 下拉选项是否会在隐藏时销毁。

events.input: 自动填充输入框输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
events.change: 输入内容变化时的回调。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.blur: 自动填充输入框失焦时的回调。
events.focus: 自动填充输入框聚焦时的回调。
events.select: 选中选项的回调。
slots.prefix: 前缀内容。
slots.suffix: 后缀内容。
slots.option: 选项内容。
slots.group-label: 选项组的标签名。
autoCompleteExpose.focus: 聚焦当前控件。
autoCompleteExpose.blur: 取消聚焦当前控件。
autoCompleteExpose.clear: 清空当前输入内容。
autoCompleteExpose.select: 选中当前输入内容。
]]]

[[[api en
modelValue: Value of the auto complete input (controlled mode), supports `v-model`.
defaultValue: Default value of the auto complete input (uncontrolled mode).
options: List of options.
placeholder: Placeholder text.
disabled: Whether the input is disabled.
readonly: Whether the input is read-only.
clearable: Whether to show a clear button.
loading: Whether to show a loading state.
showPopoverEmpty: Whether to display the popover when the options list is empty.
shouldShowPopover: Function to determine whether to show the popover while inputting.
filter: Function to filter the options.
append: Append mode.
size: Size of the auto complete input.
shape: Shape of the auto complete input.
borderRadius: Border-radius, takes precedence over `shape`. Follows CSS `border-radius` rules: single value or array of length 1 → all corners; length 2 → [top-left & bottom-right, top-right & bottom-left]; length 3 → [top-left, top-right & bottom-left, bottom-right]; length 4 → clockwise starting from top-left.
status: Form validation status.
virtualScroll: Whether render options with virtual list.
virtualListProps: Properties of virtual list.
autofocus: Native `<input>` `autofocus` attribute.
optionsDestroyOnHide: Whether the dropdown options will be destroyed when hidden.

events.input: Callback fired when the input value changes.
events.update:modelValue: Callback fired when `modelValue` is updated.
events.change: Callback fired when the input content changes.
events.clear: Callback fired when the clear button is clicked.
events.blur: Callback fired when the input loses focus.
events.focus: Callback fired when the input receives focus.
events.select: Callback fired when an option is selected.
slots.prefix: Prefix content.
slots.suffix: Suffix content.
slots.option: Custom option content.
slots.group-label: Label for option groups.
autoCompleteExpose.focus: Focus the control.
autoCompleteExpose.blur: Blur the control.
autoCompleteExpose.clear: Clear the current input.
autoCompleteExpose.select: Select all text in the input.
]]]

### AutoCompleteOption, AutoCompleteGroupOption

```ts
export interface Option<T = any> {
	value: T
	label: string
}

export interface GroupOption<T = any> {
	children: (Option<T> | string)[]
	type: typeof GROUP_OPTION_TYPE
}

export interface OptionListOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export interface OptionListGroupOption extends GroupOption {
	label: string
	key: string | number | symbol
	children: (OptionListOption | string)[]
}

export interface AutoCompleteOption extends OptionListOption<string> {
}

export interface AutoCompleteGroupOption extends OptionListGroupOption {
	children: (AutoCompleteOption | string)[]
}
```

### RestAttrs

```ts
export type VueClassValue = string | Record<string, any> | VueClassValue[]

export type RestAttrs = {
	style?: StyleValue | null
	class?: VueClassValue | null
	[x: string]: any
}
```