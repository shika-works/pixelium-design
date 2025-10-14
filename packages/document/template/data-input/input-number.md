[[[zh
# 数字输入 Input Number

专门输入数字的输入框。它和 Input 非常类似，拥有 Input 大部分功能。
]]]
[[[en
# Input Number

A dedicated input box for entering numbers. Apart from that, it is very similar to Input and has most of Input's features.
]]]

[[[zh
## 基础使用

这个组件用于数字输入。传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

This component is used for numeric input. Pass in `modelValue` to enter controlled mode. If not passed or set to `undefined`, it is in uncontrolled mode. In this case, you can use the `defaultValue` property as the default value.
]]]
<preview path="./input-number-basic.vue"></preview>

[[[zh
## 值域

通过 `max` 和 `min` 属性设置取值范围，左右都是闭区间。
]]]
[[[en
## Value Range

Set the value range using the `max` and `min` properties. Both ends are inclusive.
]]]
<preview path="./input-number-range.vue"></preview>

[[[zh
## 步长

通过 `step` 属性设置加减按钮的步长。`strickStep` 属性为 `true` 时，限制值必须为 `step` 的整数倍。
]]]
[[[en
## Step

Set the increment/decrement step using the `step` property. When the `strickStep` property is `true`, the value must be an integer multiple of `step`.
]]]
<preview path="./input-number-step.vue"></preview>

[[[zh
## 精度

通过 `precision` 属性设置精度，该属性会设置值精确到的小数位。
]]]
[[[en
## Precision

Set the precision using the `precision` property, which specifies the number of decimal places.
]]]
<preview path="./input-number-precision.vue"></preview>

[[[zh
## 自定义模板

通过同时传入 `format`、`allowInput`、`parse` 三个属性设置数字展示模板，例如实现展示附带单位，千分位数。
]]]
[[[en
## Custom Template

Set the number display template by passing the `format`, `allowInput`, and `parse` properties together. For example, you can display units or use thousands separators.
]]]
<preview path="./input-number-template.vue"></preview>


[[[zh
## 按钮位置

加减按钮的位置也是可以配置的，通过 `buttonPlacement` 属性设置。
]]]
[[[en
## Button Placement

The position of the increment/decrement buttons can also be configured using the `buttonPlacement` property.
]]]
<preview path="./input-number-button-placement.vue"></preview>

[[[zh
## 更多配置
InputNumber 还拥有 Input 组件的大部分功能。
]]]
[[[en
## More Options

This InputNumber has most of Input component's features.
]]]
<preview path="./input-number-more.vue"></preview>

## API

[[[api zh
modelValue: 数字输入框的值（受控模式），支持 `v-model`。
defaultValue: 数字输入框的默认值（非受控模式）。
placeholder: 占位符文本。
readonly: 是否只读。
disabled: 是否禁用。
max: 最大值（闭区间）。
min: 最小值（闭区间）。
step: 加减按钮的步长。
strickStep: 严格步长，限制值必须为 `step` 的整数倍。
precision: 精确到小数位，取值为 [0, 100] 的整数。
format: 将数字值转换为字符串展示的函数。
allowInput: 检查数字输入框的文本是否允许输入的函数。
parse: 将数字输入框的文本转换为数字值的函数。
buttonPlacement: 加减按钮的位置。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
size: 数字输入框尺寸。
shape: 数字输入框形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
maxLength: 最大输入长度。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
status: 表单验证状态。
events.change: 输入内容变化时的回调。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.focus: 数字输入框聚焦时的回调。
events.blur: 数字输入框失焦时的回调。
events.input: 数字输入框输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
slots.prefix: 前缀内容。
slots.suffix: 后缀内容。
inputNumberExpose.focus: 聚焦到当前数字输入框。
inputNumberExpose.blur: 取消聚焦当前数字输入框。
inputNumberExpose.clear: 清空当前数字输入框。
inputNumberExpose.select: 选中当前数字输入框内容。
]]]

[[[api en
modelValue: Value of the number input (controlled mode), supports `v-model`.
defaultValue: Default value of the number input (uncontrolled mode).
placeholder: Placeholder text.
readonly: Whether the input is read-only.
disabled: Whether the input is disabled.
max: Maximum value (inclusive).
min: Minimum value (inclusive).
step: Increment/decrement step for the spin buttons.
strictStep: Enforces that the value must be an integer multiple of `step`.
precision: Number of decimal places, must be an integer between 0 and 100.
format: Function to convert the numeric value to a display string.
allowInput: Function to validate whether the typed text is allowed.
parse: Function to convert the input text to a numeric value.
buttonPlacement: Position of the increment/decrement buttons.
clearable: Whether to show a clear button.
loading: Whether to show a loading state.
size: Size of the number input.
shape: Shape of the number input.
borderRadius: Border-radius, takes precedence over `shape`. Follows CSS `border-radius` rules: single value or array of length 1 → all corners; length 2 → [top-left & bottom-right, top-right & bottom-left]; length 3 → [top-left, top-right & bottom-left, bottom-right]; length 4 → clockwise starting from top-left.
maxLength: Maximum input length.
autofocus: Native `<input>` `autofocus` attribute.
status: Form validation status.
events.change: Callback fired when the value changes.
events.clear: Callback fired when the clear button is clicked.
events.focus: Callback fired when the input receives focus.
events.blur: Callback fired when the input loses focus.
events.input: Callback fired on input.
events.update:modelValue: Callback fired when `modelValue` is updated.
slots.prefix: Prefix content.
slots.suffix: Suffix content.
inputNumberExpose.focus: Focus the number input.
inputNumberExpose.blur: Blur the number input.
inputNumberExpose.clear: Clear the number input.
inputNumberExpose.select: Select all text in the number input.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```