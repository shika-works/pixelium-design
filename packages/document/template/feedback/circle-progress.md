[[[zh
# 环形进度条 CircleProgress

感觉这个像素风环形进度条好难画呀。
]]]
[[[en
# CircleProgress

I feel like this pixel‑style circular progress bar is really hard to draw.
]]]


[[[zh
## 基础用法

通过 `percentage` 属性设置 CircleProgress 的进度（0 - 100），超出范围的值会被自动限制在 `0` 到 `100` 之间。
]]]
[[[en
## Basic Usage

Set the progress of CircleProgress with the `percentage` prop (0 - 100). Values outside this range are automatically clamped between `0` and `100`.
]]]
<preview path="./circle-progress-basic.vue"></preview>

[[[en
## Themes
CircleProgress offers various themes: `'primary'` (default), `'sakura'`, `'success'`, `'warning'`, `'danger'` and `'notice'`.
]]]
[[[zh
## 主题颜色
CircleProgress 支持 `'primary'`（默认）、`'sakura'`、`'success'`、`'warning'`、`'danger'` 和 `'notice'` 多种主题。
]]]
<preview path="./circle-progress-theme.vue"></preview>

[[[en
## Sizes
Control the size of CircleProgress with the `size` prop (px). The default is `128`.
]]]
[[[zh
## 尺寸
通过 `size` 属性控制 CircleProgress 的尺寸（像素），默认值为 `128`。
]]]
<preview path="./circle-progress-size.vue"></preview>

[[[en
## Stroke Width
The `strokeWidth` prop controls the thickness of the ring of CircleProgress. The default is `12`.
]]]
[[[zh
## 环形粗细
`strokeWidth` 属性控制 CircleProgress 环形部分的粗细，默认值为 `12`。
]]]
<preview path="./circle-progress-stroke-width.vue"></preview>

[[[en
## Custom Color
Pass a custom `color` string to CircleProgress to generate a palette used by the ring. The supported color formats are detailed in [Supported Color Parsing](../config/supported-color-parsing). Use `trackColor` to override the track background color.
]]]
[[[zh
## 自定义颜色
通过 `color` 为 CircleProgress 传入自定义颜色，支持的颜色格式详见 [支持的颜色解析](../config/supported-color-parsing)。可使用 `trackColor` 覆盖轨道背景色。
]]]
<preview path="./circle-progress-color.vue"></preview>

[[[en
## Text & Custom Content
The percentage text is shown in the center of CircleProgress by default. Set `showText` to `false` to hide it, or use the default slot to render custom content. The slot exposes a `percentage` parameter.
]]]
[[[zh
## 文本与自定义内容
默认会在 CircleProgress 圆心显示百分比文本。设置 `showText` 为 `false` 可隐藏文本，也可以使用默认插槽渲染自定义内容，插槽会暴露 `percentage` 参数。
]]]
<preview path="./circle-progress-show-text.vue"></preview>


## API
[[[api zh
percentage: CircleProgress 的完成进度（0-100），超出范围会被自动限制。
theme: CircleProgress 的主题。
size: CircleProgress 的尺寸。
strokeWidth: CircleProgress 环形部分的粗细。
color: CircleProgress 的自定义主色，详见 [支持的颜色解析](../config/supported-color-parsing)。
trackColor: CircleProgress 环形轨道背景色。
showText: 是否在 CircleProgress 圆心显示百分比文本。
pollSizeChange: 是否轮询检测 CircleProgress 的尺寸变化。

slots.default: CircleProgress 圆心的默认插槽，用于自定义内容。
]]]
[[[api en
percentage: The completion progress (0-100) of CircleProgress, clamped automatically when out of range.
theme: The theme of CircleProgress.
size: The size of CircleProgress.
strokeWidth: The thickness of the ring of CircleProgress.
color: Custom primary color of CircleProgress. See [Supported Color Parsing](../config/supported-color-parsing).
trackColor: The background color of the ring track of CircleProgress.
showText: Whether to show the percentage text in the center of CircleProgress.
pollSizeChange: Whether to poll for size changes of CircleProgress.

slots.default: The default slot in the center of CircleProgress, used for custom content.
]]]
