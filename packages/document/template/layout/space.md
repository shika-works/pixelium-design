[[[zh
# 间隔 Space

为多个排列在一起的元素添加间隔。
]]]
[[[en
# Space

A component for adding spacing between multiple elements arranged together.
]]]

[[[zh
## 基础使用
让元素们不要贴在一起。
]]]
[[[en
## Basic Usage
Prevent elements from sticking together.
]]]
<preview path="./space-basic.vue"></preview>

[[[zh
## 间隔大小
通过 `margin` 属性设置间隔大小，支持 `small`、`medium`、`large`，也可以自定义数值或对象。
]]]
[[[en
## Spacing Size
Set the spacing size via the `margin` property. Supports `small`, `medium`, `large`, or custom values and objects.
]]]
<preview path="./space-margin.vue"></preview>

[[[zh
## 排列方向
通过 `direction` 属性设置排列方向，支持 `horizontal` 和 `vertical`。
]]]
[[[en
## Spacing Direction
Set the arrangement direction via the `direction` property. Supports `horizontal` and `vertical`.
]]]
<preview path="./space-direction.vue"></preview>

[[[zh
## 主轴排列
Space 的 `justify` 属性设置主轴排列方式。
]]]
[[[en
## Main-axis Alignment
The `justify` property of Space sets the main-axis alignment.
]]]
<preview path="./space-justify.vue"></preview>
[[[zh
## 交叉轴排列
Space 的 `align` 属性设置交叉轴排列方式。
]]]
[[[en
## Cross-axis Alignment
The `align` property of Space sets the cross-axis alignment.
]]]
<preview path="./space-align.vue"></preview>

## API
[[[api zh
margin: 间隔大小，也可以是数值或对象。
direction: 间隔排列方向。
justify: 主轴排列方式，基于 CSS `justify-content` 属性。
align: 交叉轴排列方式，基于 CSS `align-items` 属性。`direction` 为 `'horizontal'` 时默认为 `'center'`，为 `'vertical'` 时默认为 `'stretch'`。
wrap: 是否自动换行。
inline: 是否为行内布局。
slots.default: Space 的内容。
]]]
[[[api en
margin: Spacing size, can also be a number or object.
direction: Direction of spacing arrangement, `horizontal` or `vertical`.
justify: Main-axis alignment, based on CSS `justify-content` properties.
align: Cross-axis alignment, based on the CSS `align-items` property. Defaults to `'center'` when `direction` is `'horizontal'`, and to `'stretch'` when `direction` is `'vertical'`.
wrap: Whether to wrap automatically.
inline: Whether to use inline layout.
slots.default: The Space's content.
]]]