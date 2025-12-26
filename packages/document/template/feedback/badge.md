[[[zh
# 角标 Badge

一个用于显示计数、状态或提醒的小角标，附加到其他元素上（如按钮或图标）。
]]]
[[[en
# Badge

A small badge component used to display counts, status, or indicators attached to other elements (for example, buttons or icons).
]]]

[[[en
## Basic
Use Badge to attach a small indicator to other elements.
]]]
[[[zh
## 基础用法
将 Badge 附加到其他元素上以显示小角标。
]]]
<preview path="./badge-basic.vue"></preview>

[[[zh
## 最大值
`max` 设置角标的最大值，超过时以 `${max}+` 展示。
]]]
[[[zh
## Maximum
`max` sets the maximum value for the badge. When exceeded, it will be displayed as `${max}+`.
]]]
<preview path="./badge-max.vue"></preview>

[[[en
## Dot Mode
Show a small dot only by setting `dot` to `true`.
]]]
[[[zh
## 点模式
通过设置 `dot` 为 `true` 只显示小圆点。
]]]
<preview path="./badge-dot.vue"></preview>

[[[en
## Themes
Badge supports multiple themes: `'primary'`, `'sakura'`, `'success'`, `'warning'`, and `'danger'`.
]]]
[[[zh
## 主题
Badge 支持主题：`'primary'`、`'sakura'`、`'success'`、`'warning'`、`'danger'`。
]]]
<preview path="./badge-theme.vue"></preview>

[[[en
## Offset
Use `offset` to adjust the badge position. Accepts a number, a tuple `[x: number, y: number]`, or an object `{ x: number, y: number }`.
]]]
[[[zh
## 角标偏移
通过 `offset` 调整角标位置。支持数字、数组 `[x: number, y: number]` 或对象 `{ x: number, y: number }`。
]]]
<preview path="./badge-offset.vue"></preview>

[[[en
## Custom Color
Set `color` to customize the badge background; set `borderColor` to change the badge border color.
]]]
[[[zh
## 自定义颜色
通过 `color` 设置角标背景色；通过 `borderColor` 设置角标边框颜色。
]]]
<preview path="./badge-color.vue"></preview>

[[[en
## Visibility
Control whether the badge is visible with the `visible` prop.
]]]
[[[zh
## 显示和隐藏
通过 `visible` 属性控制角标显示与否。
]]]
<preview path="./badge-visibility.vue"></preview>

[[[en
## Content Slot
Use the `content` slot to fully customize the badge content when `dot` is `false`.
]]]
[[[zh
## 内容插槽
当 `dot` 为 `false` 时，可使用 `content` 插槽自定义角标内容。
]]]
<preview path="./badge-content.vue"></preview>

## API
[[[api zh
value: 角标显示的数值或字符串。
max: 数值上限，超出显示为 `${max}+`。
dot: 是否以小圆点显示。
theme: 主题，`'primary' | 'sakura' | 'success' | 'warning' | 'danger'`。
visible: 是否可见。
offset: 角标标记的偏移。
color: 自定义背景色，支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
borderColor: 自定义边框颜色。
contentProps: 透传给角标内容容器 DOM 的额外属性。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

slots.default: 包裹的附着元素插槽。
slots.content: 角标内容插槽（在 `dot` 为 `false` 时生效）。
]]]
[[[api en
value: The value or string displayed on the badge.
max: The maximum value. If exceeded, it displays as `${max}+`.
dot: Whether to display as a small dot.
theme: Theme, `'primary' | 'sakura' | 'success' | 'warning' | 'danger'`.
visible: Whether it is visible.
offset: The offset of the badge marker.
color: Custom background color, supporting CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, and hexadecimal numbers with lengths of 3, 4, 6, or 8 digits.
borderColor: Custom border color.
contentProps: Additional properties passed through to the badge content container DOM.
pollSizeChange: Enable polling for component size changes, which may affect performance. Commonly used when the size is affected by container elements, leading to abnormal canvas rendering.
slots.default: The slot for the wrapped attached element.
slots.content: The slot for badge content (effective when `dot` is `false`).
]]]
