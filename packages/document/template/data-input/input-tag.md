[[[zh
# 标签输入 Input Tag

专门输入标签的输入框，如果需要输入一系列的文本，这可能有用。
]]]
[[[en
# Input Tag

An input box specifically for entering tags. If you need to input a series of texts, this might be useful.
]]]

[[[zh
## 基础使用

这个组件用于标签输入，输入完按键 Enter 录入标签。

对于标签列表，传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。

对于输入的文本，传入 `inputValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultInputValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

This component is used for tag input. Press Enter after typing to add a tag.

For the tag list, pass the `modelValue` prop to enable controlled mode. If not passed or set to `undefined`, it is uncontrolled mode, and you can use the `defaultValue` prop as the default value.

For the input text, pass the `inputValue` prop to enable controlled mode. If not passed or set to `undefined`, it is uncontrolled mode, and you can use the `defaultInputValue` prop as the default value.
]]]
<preview path="./input-tag-basic.vue"></preview>

[[[zh
## 折叠标签

设置 `collapseTags` 属性可开启折叠标签（默认为 `false`），`maxDisplayTags` 属性设置最大展示标签，`collapseTagsPopover` 设置折叠后是否通过弹出框展示被折叠的标签（默认为 `true`）。
]]]
[[[en
## Collapsed Tags

Set the `collapseTags` prop to enable collapsed tags (default is `false`). The `maxDisplayTags` prop sets the maximum number of tags to display. The `collapseTagsPopover` prop controls whether the collapsed tags are shown in a popover (default is `true`).
]]]
<preview path="./input-tag-collapse.vue"></preview>

[[[zh
## 数量限制

传入 `maxLength` 属性限制标签数量。
]]]
[[[en
## Tag Limit

Use the `maxLength` prop to limit the number of tags.
]]]
<preview path="./input-tag-max.vue"></preview>

[[[zh
## 标签样式

传入 `tagVariant` 属性设置标签样式变体，`tagTheme` 属性控制标签主题，`tagColor` 属性自定义标签主题颜色。
]]]
[[[en
## Tag Style

Use the `tagVariant` prop to set the tag style variant, `tagTheme` to control the tag theme, and `tagColor` to customize the tag theme color.
]]]
<preview path="./input-tag-tag.vue"></preview>

[[[zh
## 自定义标签内容

通过插槽 `tag` 自定义标签内容。
]]]
[[[en
## Custom Tag Content

Customize tag content via the `tag` slot.
]]]
<preview path="./input-tag-slot.vue"></preview>

[[[zh
## 更多配置
InputTag 还拥有 Input 组件的部分功能。
]]]
[[[en
## More Options

InputTag also has some features of the Input component.
]]]
<preview path="./input-tag-more.vue"></preview>

## API

[[[api zh
tagTheme: <Badge type="warning" text="Deprecated" /> 标签的 `theme` 属性，设置标签主题颜色。
tagVariant: <Badge type="warning" text="Deprecated" /> 标签的 `variant` 属性，设置标签样式变体。
tagColor: <Badge type="warning" text="Deprecated" /> 标签的 `color` 属性，自定义标签颜色。
tagProps: 标签的属性。
modelValue: 标签输入框的值（受控模式），支持 `v-model`。
defaultValue: 标签输入框的默认值（非受控模式）。
inputValue: 内部文本输入框的值（受控模式），支持 `v-model`。
defaultInputValue: 内部文本输入框的默认值（非受控模式）。
placeholder: 占位符文本。
readonly: 是否只读。
disabled: 是否禁用。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
size: 输入框尺寸。
shape: 输入框形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
maxLength: 最大输入长度。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
status: 表单验证状态。
collapseTags: 是否开启折叠标签。
maxDisplayTags: 展示标签的最大数量，开启 `collapseTags` 后生效。
collapseTagsPopover: 是否在弹出框中展示被折叠的标签，开启 `collapseTags` 后生效。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.focus: 输入框聚焦时的回调。
events.blur: 输入框失焦时的回调。
events.input: 输入框输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
slots.prefix: 前缀内容。
slots.suffix: 后缀内容。
events.change: 标签列表内容变化时的回调。
events.inputChange: 输入内容变化时的回调。
events.tagAdd: 添加标签时的回调。
events.tagClose: 关闭标签时的回调。
events.update:inputValue: 更新 `inputValue` 的回调。
slots.tag: 标签内容。
events.inputChange: 输入内容变化时的回调。
inputTagExpose.focus: 聚焦到当前输入框。
inputTagExpose.blur: 取消聚焦当前输入框。
inputTagExpose.clear: 清空当前输入框。
]]]

[[[api en
tagTheme: <Badge type="warning" text="Deprecated" /> `theme` properties for tags (color theme).
tagVariant: <Badge type="warning" text="Deprecated" /> `variant` properties for tags (style variant).
tagColor: <Badge type="warning" text="Deprecated" /> `color` properties for tags (custom color).
tagProps: Properties of tags.
modelValue: The value of the tag input box (controlled mode), supports `v-model`.
defaultValue: The default value of the tag input box (uncontrolled mode).
inputValue: The value of the internal text input box (controlled mode), supports `v-model`.
defaultInputValue: The default value of the internal text input box (uncontrolled mode).
placeholder: Placeholder text.
readonly: Read-only state.
disabled: Disabled state.
clearable: Whether to show the clear button.
loading: Whether to show the loading state.
size: Input box size.
shape: Input box shape.
borderRadius: Border radius, takes precedence over `shape`, same behavior as CSS `border-radius`; single value or array of length 1 → applies to all corners; array of length 2 → [top left & bottom right, top right & bottom left]; array of length 3 → [top left, top right & bottom left, bottom right]; array of length 4 → applies to each corner clockwise.
maxLength: Maximum input length.
autofocus: Native `<input>` `autofocus` attribute.
status: Form validation status.
collapseTags: Whether to enable collapsed tags.
maxDisplayTags: Maximum number of tags to display, effective when `collapseTags` is enabled.
collapseTagsPopover: Whether to show collapsed tags in a popover, effective when `collapseTags` is enabled.
events.clear: Callback when the clear button is clicked and the content is cleared.
events.focus: Callback when the input box is focused.
events.blur: Callback when the input box loses focus.
events.input: Callback when the input box receives input.
events.update:modelValue: Callback to update `modelValue`.
slots.prefix: Prefix content.
slots.suffix: Suffix content.
events.change: Callback when the tag list changes.
events.inputChange: Callback when the input content changes.
events.tagAdd: Callback when a tag is added.
events.tagClose: Callback when a tag is closed.
events.update:inputValue: Callback when `inputValue` is updated.
slots.tag: Tag content.
inputNumberExpose.focus: Focus the current input box.
inputNumberExpose.blur: Remove focus from the current input box.
inputNumberExpose.clear: Clear the current input box.
inputNumberExpose.select: Select the content of the current input box.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```

### EmitEvent
```ts
export type EmitEvent<T extends Record<string, any>> = {
	[K in keyof T as `on${Capitalize<K & string>}`]?: (...args: T[K]) => void
}
```