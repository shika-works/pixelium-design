[[[zh
# 时间线 Timeline

按时间顺序展示一系列事件或步骤的组件。
]]]
[[[en
# Timeline

A component that displays a series of events or steps in chronological order.
]]]

[[[zh
## 基础使用

通过 TimelineItem 的 `theme` 属性设置时间点的主题色，使用 `color` 属性可以自定义颜色。使用 `lineVariant` 属性可以设置连接线的样式。
]]]
[[[en
## Basic Usage

Use the `theme` prop of TimelineItem to set the theme color of a time point, and the `color` prop to customize it. Use the `lineVariant` prop to set the style of the connector line.
]]]

<preview path="./timeline-theme.vue"></preview>

[[[zh
## 排列方向

通过 `direction` 属性设置 Timeline 的排列方向，支持垂直和水平两种方向。
]]]
[[[en
## Direction

Use the `direction` prop to set the arrangement direction of Timeline, supporting both vertical and horizontal orientations.
]]]

<preview path="./timeline-direction.vue"></preview>

[[[zh
## 内容位置

通过 `contentPlacement` 属性设置内容相对于 Timeline 的位置。
]]]
[[[en
## Content Placement

Use the `contentPlacement` prop to set the position of the content relative to the Timeline axis.
]]]

<preview path="./timeline-content-placement.vue"></preview>

[[[zh
## 尺寸

通过 `size` 属性调整 Timeline 的尺寸，在垂直或水平方向上都可以使用。
]]]
[[[en
## Size

Use the `size` prop to adjust the size of Timeline, available in both vertical and horizontal orientations.
]]]

<preview path="./timeline-size.vue"></preview>

[[[zh
## 标记

为 TimelineItem 设置 `mark` 属性可以在时间点一侧展示标记文本，也可以使用 `mark` 插槽自定义标记内容。
]]]
[[[en
## Mark

Set the `mark` prop on TimelineItem to display marker text beside the time point. The `mark` slot can be used to customize the marker content.
]]]

<preview path="./timeline-mark.vue"></preview>

[[[zh
## 自定义节点

通过 TimelineItem 的 `icon` 插槽可以自定义时间点处的节点内容。
]]]
[[[en
## Custom Node

Use the `icon` slot of TimelineItem to customize the content of the node at a time point.
]]]

<preview path="./timeline-icon.vue"></preview>

[[[zh
## 自定义内容

TimelineItem 提供了 `header`、`footer` 和 `default` 插槽，分别用于自定义头部、底部和主体内容。
]]]
[[[en
## Custom Content

TimelineItem provides the `header`, `footer`, and `default` slots for customizing the header, footer, and body content respectively.
]]]

<preview path="./timeline-slots.vue"></preview>

## API

[[[api zh
direction: Timeline 的排列方向。
contentPlacement: Timeline 内容相对轴线的位置。
size: Timeline 的尺寸。
pollSizeChange: 是否轮询检测 Timeline 的尺寸变化。
smooth: Timeline 节点是否使用平滑绘制。
contentSpan: content 区域在 mark 与 content 总宽度中的占比（0-100），支持响应式。

slots.default: Timeline 内容，用于放置 TimelineItem。
]]]
[[[api en
direction: The arrangement direction of Timeline.
contentPlacement: The position of the Timeline content relative to the axis.
size: The size of Timeline.
pollSizeChange: Whether to poll for size changes of Timeline.
smooth: Whether the Timeline nodes are drawn smoothly.
contentSpan: The proportion (0-100) of the content area within the combined mark and content width, supports responsive values.

slots.default: The content of Timeline, used to place TimelineItem.
]]]

[[[api timeline-item zh
color: TimelineItem 节点的自定义颜色。
content: TimelineItem 的主体内容。
footer: TimelineItem 的底部内容。
lineVariant: TimelineItem 连接线的样式。
mark: TimelineItem 的标记文本。
title: TimelineItem 的标题。
theme: TimelineItem 的主题色。

slots.default: TimelineItem 的主体内容。
slots.icon: TimelineItem 节点处的图标。
slots.mark: TimelineItem 的标记内容。
slots.footer: TimelineItem 的底部内容。
slots.header: TimelineItem 的头部内容。
]]]
[[[api timeline-item en
color: Custom color of the TimelineItem node.
content: The body content of TimelineItem.
footer: The footer content of TimelineItem.
lineVariant: The style of the TimelineItem connector line.
mark: The marker text of TimelineItem.
title: The title of TimelineItem.
theme: The theme color of TimelineItem.

slots.default: The body content of TimelineItem.
slots.icon: The icon at the node of TimelineItem.
slots.mark: The marker content of TimelineItem.
slots.footer: The footer content of TimelineItem.
slots.header: The header content of TimelineItem.
]]]

[[[slice value-with-device-width]]]