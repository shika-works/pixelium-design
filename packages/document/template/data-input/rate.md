[[[zh
# 评分 Rate

好像大家都喜欢用星星打分。
]]]
[[[en
# Rate

It seems like everyone likes to rate with stars.
]]]

[[[zh
## 基础使用

评分 Rate，传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

The Rate component enters controlled mode when the `modelValue` is passed. If `modelValue` is not passed or is `undefined`, it is in uncontrolled mode, in which case a `defaultValue` can be provided as the initial value.
]]]
<preview path="./rate-basic.vue"></preview>

[[[zh
## 半颗星星

`allowHalf` 控制是否允许选择半颗星星。
]]]
[[[en
## Half Stars

The `allowHalf` prop controls whether half-star selections are allowed.
]]]
<preview path="./rate-half.vue"></preview>

[[[zh
## 只读、禁用
]]]
[[[en
## Readonly and Disabled
]]]
<preview path="./rate-disabled.vue"></preview>

[[[zh
## 清空

`clearable` 为 `true` 时，点击当前值对应的位置，Rate 值会被清空，设置为 0。
]]]
[[[en
## Clearable

When `clearable` is set to `true`, clicking on the position corresponding to the current value will clear the Rate value and set it to 0.
]]]
<preview path="./rate-clearable.vue"></preview>

[[[zh
## 自定义颜色

`activeColor` 设置激活时的颜色。
]]]
[[[en
## Custom Color

`activeColor` sets the color when the star is active.
]]]
<preview path="./rate-color.vue"></preview>

## API
[[[api zh
modelValue: 评分组件 Rate 的值（受控模式）。
defaultValue: 评分组件 Rate 的默认值（非受控模式）。
disabled: 是否禁用。
readonly: 是否只读。
clearable: 是否可清除。
count: 可选择图案的数量。
allowHalf: 是否可选择半颗星。
activeColor: 激活时的颜色。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

events.update:modelValue: 更新 `modelValue` 的回调。
events.change: 评分的值改变的回调。
events.select: 选择评分图案的回调。
events.clear: 清除评分的回调。
events.focus: 聚焦时的回调。
events.blur: 失焦时的回调。
]]]

[[[api en
modelValue: The value of the Rate component (controlled mode).
defaultValue: The default value of the Rate component (uncontrolled mode).
disabled: Whether the component is disabled.
readonly: Whether the component is read-only.
clearable: Whether the value can be cleared.
count: The number of selectable icons.
allowHalf: Whether half-star selection is allowed.
activeColor: The color when active. Supports CSS-like `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'` strings and 3, 4, 6, 8-digit hexadecimal representations.
pollSizeChange: Enables polling for component size changes. This may impact performance. It is typically used to resolve abnormal canvas rendering that occurs when the component's size is affected by its container element.

events.update:modelValue: Callback fired when `modelValue` needs to be updated.
events.change: Callback fired when the rating value changes.
events.select: Callback fired when a rating icon is selected.
events.clear: Callback fired when the rating is cleared.
events.focus: Callback fired when the component receives focus.
events.blur: Callback fired when the component loses focus.
]]]
