[[[zh
# 卡片 Card

卡片组件用于将相关内容整合到一个容器中展示。
]]]
[[[en
# Card

The Card component is used to group related content together in a container.
]]]

[[[zh
## 基础使用

Card 组件默认显示标题和头部区域，不展示底部区域。可以通过 `title` 属性设置标题文本。
]]]
[[[en
## Basic Usage

The Card component shows the header area with a title by default, and does not show the footer. Use the `title` prop to set the header text.
]]]

<preview path="./card-basic.vue"></preview>

[[[zh
## 卡片形状与圆角

`shape` 属性控制卡片形状，默认 `'round'`（圆角），可选 `'rect'`（直角）。

`borderRadius` 可自定义圆角大小，优先级高于 `shape`。
]]]
[[[en
## Shape & Border Radius

The `shape` prop controls the card shape, defaulting to `'round'` (rounded corners). `'rect'` gives right-angle corners.

`borderRadius` sets a custom corner radius and has higher priority than `shape`.
]]]

<preview path="./card-shape.vue"></preview>

[[[zh
## 卡片边框

通过 `bordered` 属性可以控制是否显示边框。
]]]
[[[en
## Card Border

The `bordered` prop controls whether the card border is displayed.
]]]

<preview path="./card-bordered.vue"></preview>

[[[zh
## 关闭按钮

通过 `closable` 属性可以显示关闭按钮，点击后触发 `close` 事件。
]]]
[[[en
## Close Button

The `closable` prop shows a close button that triggers a `close` event when clicked.
]]]

<preview path="./card-closable.vue"></preview>

[[[zh
## 自定义头部和底部

使用 `header` 和 `footer` 插槽可以自定义内容。
]]]
[[[en
## Custom Header & Footer

Use the `header` and `footer` slots to customize content.
]]]

<preview path="./card-header-footer.vue"></preview>

## API

[[[api zh
title: 卡片标题文本。
shape: 卡片形状。
borderRadius: 自定义圆角大小，可选单个值或四个值的数组。
bordered: 是否显示卡片边框。
closable: 是否显示关闭按钮。
pollSizeChange: 是否在容器大小变化时重新绘制。
headerProps: 头部区域的附加属性。
bodyProps: 主体区域的附加属性。
footerProps: 底部区域的附加属性。

events.close: 点击关闭按钮时触发的回调。

slots.header: 头部区域自定义内容。
slots.default: 卡片主体内容。
slots.footer: 底部区域自定义内容。
]]]
[[[api en
title: The title text of the card.
shape: The card shape.
borderRadius: Custom border radius. Accepts a single value or an array of four values.
bordered: Whether to show the card border.
closable: Whether to show the close button.
pollSizeChange: Whether to redraw when the container size changes.
headerProps: Additional attributes for the header section.
bodyProps: Additional attributes for the body section.
footerProps: Additional attributes for the footer section.

events.close: Callback triggered when the close button is clicked.

slots.header: Custom content for the header section.
slots.default: The main body content of the card.
slots.footer: Custom content for the footer section.
]]]
