[[[zh
# 文本输入 Input

输入文本。
]]]
[[[en
# Input

Enter text.
]]]

[[[zh
## 基础使用

你可以在这里输入文本。传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

You can enter text here. Pass in `modelValue` to enable controlled mode. If not passed or set to `undefined`, it will be uncontrolled mode, in which case you can use the `defaultValue` property as the default value.
]]]
<preview path="./input-basic.vue"></preview>

[[[zh
## 密码输入

这个组件也可以是密码输入框，只需要把 `password` 属性设置为 `true`。
]]]
[[[en
## Password Input

This component can also be a password input box, just set the `password` property to `true`.
]]]
<preview path="./input-password.vue"></preview>

[[[zh
## 只读 & 禁用

`readonly` 设置只读，`disabled` 设置禁用，此时内部 `<input>` 都会被设置 `disabled`。它们之间几乎只有样式不一样。
]]]
[[[en
## Readonly & Disabled

Set `readonly` for read-only, and `disabled` for disabled. In both cases, the internal `<input>` will be set to `disabled`. The difference is mostly in the styles.
]]]
<preview path="./input-disabled.vue"></preview>

[[[zh
## 清除文本

`clearable` 为 `true` 时，聚焦后展示清除文本的按钮。
]]]
[[[en
## Clear Text

When `clearable` is `true`, a clear button will be shown when focused.
]]]
<preview path="./input-clearable.vue"></preview>

[[[zh
## 加载状态

`loading` 设置加载状态，和平常没什么不一样，只是多了一个加载图标。
]]]
[[[en
## Loading State

Set `loading` for loading state. It works the same as usual, just with an extra loading icon.
]]]
<preview path="./input-loading.vue"></preview>

[[[zh
## 输入框尺寸

输入框可以有不同的大小。
]]]
[[[en
## Input Size

The input box can have different sizes.
]]]
<preview path="./input-size.vue"></preview>

[[[zh
## 圆角边框

输入框也可以有圆角。
> 精力和技术力不太充足，自定义圆角还有需要优化的地方，但整体不影响使用。
]]]
[[[en
## Rounded Borders

The input box can also have rounded borders.
> Due to limited time and technical resources, custom border-radius still needs optimization, but it does not affect overall usability.
]]]
<preview path="./input-shape.vue"></preview>

[[[zh
## 前缀 & 后缀

在前缀后缀添加附加内容。
]]]
[[[en
## Prefix & Suffix

Add extra content to the prefix or suffix.
]]]
<preview path="./input-prefix.vue"></preview>

[[[zh
## 复合输入框

借助 InputGroup 组件，我们可以把各种输入控件和按钮组合起来。
]]]
[[[en
## Composite Input

With the InputGroup component, you can combine various input controls and buttons together.
]]]
<preview path="./input-composite.vue"></preview>

[[[zh
## 字数统计 & 长度限制

`showCount` 属性设置展示字数统计，`maxLength` 设置最大长度。

Input 组件默认使用 `str.length` 计算长度，对于复合字符会存在计数错误的情况。我们推荐使用 grapheme-splitter 来解决这个问题。`countGraphemes` 属性用于设置统计长度的函数，`sliceGraphemes` 用于截取限制长度以内的字串，如果只传入 `countGraphemes` 而没有 `sliceGraphemes`，`maxLength` 的长度限制不会生效。
]]]
[[[en
## Character Count & Length Limit

The `showCount` property enables character count display, and `maxLength` sets the maximum length.

By default, the Input component uses `str.length` to calculate length, which may be inaccurate for compound characters. We recommend using grapheme-splitter to solve this issue. The `countGraphemes` property sets the function for counting characters, and `sliceGraphemes` is used to slice the string within the length limit. If only `countGraphemes` is provided without `sliceGraphemes`, the `maxLength` limit will not take effect.
]]]
<preview path="./input-count.vue"></preview>

[[[zh
## 手动操作

Input 组件导出了一些操作它本身的函数。
]]]
[[[en
## Manual Operations

The Input component exports some functions to operate on itself.
]]]
<preview path="./input-expose.vue"></preview>


[[[zh
## 表单验证状态

输入框支持四种表单验证状态：`'normal'`（默认）、`'success'`、`'warning'`、`'error'`。
]]]
[[[en
##  Form Validation Status

The input box supports four form validation statuses: `'normal'` (default), `'success'`, `'warning'`, and `'error'`.
]]]
<preview path="./input-status.vue"></preview>

## API

[[[api zh
modelValue: 文本输入框的值（受控模式），支持 `v-model`。
defaultValue: 文本输入框的默认值（非受控模式）。
placeholder: 占位符文本。
password: 是否为密码输入框。
readonly: 是否只读。
disabled: 是否禁用。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
size: 输入框尺寸。
shape: 输入框形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
showCount: 是否展示字数统计。
maxLength: 最大输入长度。
countGraphemes: 自定义字数统计函数，如果只传入 `countGraphemes` 而没有 `sliceGraphemes`，`maxLength` 的长度限制不会生效。
sliceGraphemes: 自定义截取长度函数。
nativeType: 原生 `<input>` 的 `type` 属性。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
status: 表单验证状态。

pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

events.change: 输入内容变化时的回调。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.focus: 输入框聚焦时的回调。
events.blur: 输入框失焦时的回调。
events.input: 输入框输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
slots.prefix: 前缀内容。
slots.suffix: 后缀内容。
slots.count: 展示字数统计的插槽。
inputExpose.focus: 聚焦到当前输入框。
inputExpose.blur: 取消聚焦当前输入框。
inputExpose.clear: 清空当前输入框。
inputExpose.select: 选中当前输入框内容。
]]]

[[[api en
modelValue: Value of the input box (controlled mode), supports `v-model`.
defaultValue: Default value of the input box (uncontrolled mode).
placeholder: Placeholder text.
password: Whether it is a password input box.
readonly: Whether it is read-only.
disabled: Whether it is disabled.
clearable: Whether to show the clear button.
loading: Whether to show the loading state.
size: Input box size.
shape: Input box shape.
status: Form validation status.
borderRadius: Border radius, takes precedence over `shape`, behaves like CSS `border-radius`; a single value or array of length 1 → all corners; length 2 → [top left & bottom right, top right & bottom left]; length 3 → [top left, top right & bottom left, bottom right]; length 4 → applies to each corner in clockwise order.
showCount: Whether to show character count.
maxLength: Maximum input length.
countGraphemes: Custom character count function. If only `countGraphemes` is provided without `sliceGraphemes`, the `maxLength` limit will not take effect.
sliceGraphemes: Custom function to slice the string to the specified length.
nativeType: Native `<input>` `type` attribute.
autofocus: Native `<input>` `autofocus` attribute.

pollSizeChange: Enables polling for component size changes. This also affects the property of the same name in data input components that are child components.

events.change: Callback when input content changes.
events.clear: Callback when the clear button is clicked and content is cleared.
events.focus: Callback when the input box is focused.
events.blur: Callback when the input box loses focus.
events.input: Callback when input is entered.
events.update:modelValue: Callback to update `modelValue`.
slots.prefix: Prefix content.
slots.suffix: Suffix content.
slots.count: Slot for displaying character count.
inputExpose.focus: Focus the current input box.
inputExpose.blur: Remove focus from the current input box.
inputExpose.clear: Clear the current input box.
inputExpose.select: Select the content of the current input box.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```