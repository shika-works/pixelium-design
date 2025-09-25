[[[zh
# 分隔线 Divider

用来分隔不同内容区域的组件，能让你的页面各部分的边界更加清晰。
]]]
[[[en
# Divider

A component used to separate different content areas, making the boundaries of each part of your page clearer.
]]]
[[[zh
## 基础使用
分隔线分开不同内容区域。
]]]
[[[en
## Basic Usage
The divider separates different content areas.
]]]
<preview path="./divider-basic.vue"></preview>
[[[zh
## 分隔线方向
分隔线支持水平和垂直方向，通过 `direction` 属性设置。
]]]
[[[en
## Divider Direction
The divider supports both horizontal and vertical directions, which can be set via the `direction` property.
]]]
<preview path="./divider-direction.vue"></preview>
[[[zh
## 分隔线样式
分隔线支持多种基于 CSS `border-style`  实现的样式，通过 `variant` 属性设置。
]]]
[[[en
## Divider Style
The divider supports various styles based on CSS `border-style`, which can be set via the `variant` property.
]]]
<preview path="./divider-variant.vue"></preview>

## API
[[[api zh
direction: 分隔线方向。
margin: 分割线间距，水平时为上下间距，垂直时为左右间距。
size: 分隔线宽度。
variant: 基于 CSS `border-style`  实现的分隔线样式。
]]]
[[[api en 
direction: The direction of the divider.
margin: The spacing of the divider, which is the top and bottom spacing when horizontal, and the left and right spacing when vertical.
size: The width of the divider.
variant: The style of the divider based on CSS `border-style`.
]]]