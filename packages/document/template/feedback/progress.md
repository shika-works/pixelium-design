[[[zh
# 进度条 Progress

一个用于展示任务完成进度的组件，虽然并不意味着实际上的进度。
]]]

[[[en
# Progress

This component represents task completion progress visually, though it is not indicative of real-world progress.
]]]


[[[en
## Progress Themes
The progress offers 5 themes: `'primary'` (default), `'success'`, `'warning'`, `'danger'` and `'sakura'`.
]]]
[[[zh
## 主题颜色
进度条有 `'primary'`（默认）、`'success'`、`'warning'`、`'danger'`、`'sakura'` 五种主题。
]]]
<preview path="./progress-theme.vue"></preview>

[[[en
## Progress Variants
There are two visual variants: `'solid'` (default) and `'checker'`.
]]]
[[[zh
## 样式变体
支持两种样式：`'solid'`（默认）和 `'checker'`（棋盘格）。
]]]
<preview path="./progress-variant.vue"></preview>

[[[en
## Indicator
Use the `indicator` slot to render a custom indicator (for example a label showing percentage). The component will position it automatically; `indicatorPlacement` prop controls whether it sits `'inside'` or `'outside'` the bar.
]]]
[[[zh
## 指示内容
通过 `indicator` 插槽可以自定义指示内容（例如显示百分比文本）。组件会自动定位，`indicatorPlacement` 属性用于控制指示内容位于条内（`'inside'`）或外侧（`'outside'`）。
]]]
<preview path="./progress-indicator.vue"></preview>

[[[en
## Sizes
Control height with the `size` prop. Accepts `'small'`, `'medium'` (default), `'large'` or a number (px).
]]]
[[[zh
## 进度条尺寸
通过 `size` 属性控制高度，可选 `'small'`、`'medium'`（默认）、`'large'` 或直接传入数字（像素）。
]]]
<preview path="./progress-size.vue"></preview>

[[[en
## Prepend / Append Slots
You can provide `prepend` and `append` slots to add content before or after the progress bar (e.g. labels or icons).
]]]
[[[zh
## 前 / 后 插槽
使用 `prepend` 与 `append` 插槽可以在进度条前后添加内容（如标签或图标）。
]]]
<preview path="./progress-prepend-append.vue"></preview>

[[[en
## Custom Color
Set a custom `color` string (CSS-like `rgb`/`rgba` or hex 3/4/6/8) to generate a palette used by the bar. `trackBackgroundColor` can override the track background.
]]]
[[[zh
## 自定义颜色
通过 `color` 传入自定义颜色（支持 `rgb`/`rgba` 字符串或 3/4/6/8 位十六进制），组件会基于该颜色生成色板。可使用 `trackBackgroundColor` 覆盖轨道背景色。
]]]
<preview path="./progress-color.vue"></preview>


## API
[[[api zh
percentage: 数值，表示完成进度（0-100）。
variant: 进度条的样式变体。
theme: 进度条的主题。
size: 进度条的尺寸，输入数字时单位为 px。
gap: 留白间隔（px），用于边框内间距。
indicatorPlacement: 提示内容的位置，位于进度条填充部分的内侧还是外侧。
color: 自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
trackColor: 进度条轨道背景色。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

slots.append: 在进度条后方的插槽。
slots.prepend: 在进度条前方的插槽。
slots.indicator: 进度条里面的提示内容插槽。
]]]
[[[api en
percentage: Numeric value indicating completion progress (0-100).
variant: The style variant of the progress bar.
theme: The theme of the progress bar.
size: The size of the progress bar, measured in px when a number is input.
gap: Gap spacing (px) inside the border.
indicatorPlacement: The position of the indicator content, located inside or outside the filled portion of the progress bar.
color: Custom primary color. A complete color palette is generated internally based on this, taking precedence over the preset palette provided by `theme`. Supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3, 4, 6, or 8-digit hexadecimal representations.
trackColor: The background color of the progress bar track.
pollSizeChange: Enables polling for component size changes, which may affect performance. Often used when the component's size is influenced by its container element, causing abnormal canvas rendering.

slots.append: Slot for content placed after the progress bar.
slots.prepend: Slot for content placed before the progress bar.
slots.indicator: Slot for indicator content inside the progress bar.
]]]