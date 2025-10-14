[[[zh
# 遮罩层 Mask

用来覆盖什么东西，表示正在等待或者有更优先的事情。
]]]
[[[en
# Mask

Used to overlay something, indicating that it is waiting or that there is a higher-priority matter.
]]]


[[[zh
## 基础使用

该组件绝对定位，可以通过 `step` 和 `lineWidth` 属性来控制网格间隔和线条尺寸。
]]]
[[[en
## Basic Usage

The component is absolutely positioned. You can control the grid spacing and line size via the `step` and `lineWidth` properties.
]]]
<preview path="./mask-basic.vue"></preview>

[[[zh
## 背景颜色

通过 `color` 属性控制遮罩层颜色。
]]]
[[[en
## Background Color

Control the mask color through the `color` property.
]]]
<preview path="./mask-color.vue"></preview>

[[[zh
## 纯色背景

`grid` 置为 `false` 可以展示纯色背景。
]]]
[[[en
## Solid Background

Set `grid` to `false` to display a solid color background.
]]]
<preview path="./mask-grid.vue"></preview>

## API
[[[api zh
color: 遮罩层颜色。
step: 网格间隔。
lineWidth: 线条尺寸。
grid: 是否为网格背景。
zIndex: 遮罩层的 `z-index`。
]]]
[[[api en
color: Mask color.
step: Grid spacing.
lineWidth: Line size.
grid: Whether the background is a grid.
zIndex: The `z-index` of the mask.
]]]