[[[zh
# 操作列表 ActionList

用于展示 AI Agent 执行过程的组件，按顺序列出每一个操作及其状态，并支持展开详情与折叠。
]]]
[[[en
# ActionList

A component that presents how an AI Agent works, listing every action and its status in order, with expandable details and folding support.
]]]

[[[zh
## 基础使用

在 ActionList 的默认插槽中放置 ActionListItem 即可渲染每一行，为每一行设置 `index` 作为标识，再通过 `status`、`title` 和 `content` 描述这一步操作。
]]]
[[[en
## Basic Usage

Place ActionListItem inside the default slot of ActionList to render the rows. Give every row an `index` as its identifier, and describe the step with `status`, `title`, and `content`.
]]]

<preview path="./action-list-basic.vue"></preview>

[[[zh
## 状态

`status` 控制 ActionListItem 的状态，可选 `'pending'`（默认）、`'running'`、`'success'`、`'warning'`、`'error'` 和 `'skipped'`。节点图标与强调色都会跟随状态变化，其中 `'running'` 的图标会持续旋转。

也可以设置 `color` 传入自定义颜色，它会覆盖状态对应的颜色。
]]]
[[[en
## Status

`status` controls the state of ActionListItem and accepts `'pending'` (default), `'running'`, `'success'`, `'warning'`, `'error'`, and `'skipped'`. Both the node icon and the accent color follow the status, and the icon of `'running'` keeps spinning.

A custom color can be passed through `color`, which overrides the color of the status.
]]]

<preview path="./action-list-status.vue"></preview>

[[[zh
## 展开详情

当 ActionListItem 带有 `detail` 时，点击行标题即可展开详情。`expandable` 设为 `false` 可以让某一行始终保持收起，`defaultExpanded` 可以设置非受控模式下默认展开的行，`expanded` 则用于受控模式。

展开的行索引集合变化时会触发 `update:expanded` 与 `expandedChange` 事件，其中 `expandedChange` 携带的是该集合的副本；某一行的展开状态变化时会触发 `itemExpandedChange` 事件。

`animationDuration` 控制展开与收起动画的时长。
]]]
[[[en
## Expandable Detail

When an ActionListItem carries a `detail`, clicking its header expands the detail. Set `expandable` to `false` to keep a row collapsed, use `defaultExpanded` to expand rows in uncontrolled mode, and `expanded` for the controlled mode.

The `update:expanded` and `expandedChange` events are triggered when the set of expanded row indices changes, and `expandedChange` carries a copy of that set. The `itemExpandedChange` event is triggered when the expanded state of a row changes.

`animationDuration` controls the duration of the expand and collapse animation.
]]]

<preview path="./action-list-expandable.vue"></preview>

[[[zh
## 尺寸

通过 `size` 属性设置 ActionList 的尺寸，可选 `'small'`、`'medium'`（默认）和 `'large'`，节点的尺寸、字号和图标都会同步变化。
]]]
[[[en
## Size

Use the `size` prop to set the size of ActionList. It accepts `'small'`, `'medium'` (default), and `'large'`, and the size of the node, the font size, and the icon all scale with it.
]]]

<preview path="./action-list-size.vue"></preview>

[[[zh
## 间距

通过 `spacing` 属性设置 ActionList 中各行之间的间距，传入数字时以像素为单位，也可以传入字符串作为 CSS 长度值。

ActionListItem 也支持 `spacing` 属性，设置后会覆盖 ActionList 的间距；未设置时沿用 ActionList 的间距。最后一行不会保留间距。
]]]
[[[en
## Spacing

Use the `spacing` prop to set the spacing between the rows of ActionList. A number is treated as pixels, while a string is used as a CSS length value.

ActionListItem also supports the `spacing` prop, which overrides the spacing of ActionList. It inherits that spacing when it is not set. The last row keeps no spacing.
]]]

<preview path="./action-list-spacing.vue"></preview>

[[[zh
## 连接线

通过 `lineVariant` 属性设置各行之间连接线的样式，可选 `'solid'`（默认）与 `'dashed'`。连接线从节点向下延伸，最后一行不会绘制连接线。

ActionListItem 也支持 `lineVariant` 属性，设置后会覆盖 ActionList 设置的样式。
]]]
[[[en
## Connector Line

Use the `lineVariant` prop to set the style of the connector line between rows. It accepts `'solid'` (default) and `'dashed'`. The line runs downwards from the node, and the last row draws no line.

ActionListItem also supports the `lineVariant` prop, which overrides the style set by ActionList.
]]]

<preview path="./action-list-line-variant.vue"></preview>

[[[zh
## 折叠

折叠入口依据 `items` 的行数出现，因此在默认插槽模式下不会渲染折叠入口。设置 `collapsible` 后，当 `items` 的行数超过 `maxDisplayItems`（默认为 3）时就会出现折叠入口；`defaultCollapsed` 与 `collapsed` 分别用于非受控和受控模式下的收起状态，`foldPlacement` 决定入口位于列表上方还是下方。

收起状态变化时会触发 `update:collapsed` 与 `collapsedChange` 事件。
]]]
[[[en
## Fold

The fold trigger is driven by the rows of `items`, so it is not rendered in slot mode. Once `collapsible` is set, a fold trigger appears when the number of rows in `items` exceeds `maxDisplayItems` (3 by default). `defaultCollapsed` and `collapsed` drive the folded state in uncontrolled and controlled mode respectively, and `foldPlacement` decides whether the trigger sits above or below the rows.

The `update:collapsed` and `collapsedChange` events are triggered when the folded state changes.
]]]

<preview path="./action-list-fold.vue"></preview>

[[[zh
## 自定义插槽

ActionListItem 提供 `title`、`content` 和 `detail` 插槽，分别用于自定义标题、补充内容与展开后的详情内容。

通过 ActionListItem 的 `icon` 插槽可以替换节点处的默认图标，插槽参数为当前的状态。

`fold` 插槽可以自定义折叠入口的内容，插槽参数为当前的收起状态、被隐藏的行数和总行数。
]]]
[[[en
## Custom Fold Content

ActionListItem provides the `title`, `content`, and `detail` slots for customizing the title, the supplementary content, and the expanded detail content respectively.

The `icon` slot of ActionListItem replaces the default icon at the node, and it receives the current status.

The `fold` slot customizes the content of the fold trigger and receives the current folded state, the number of hidden rows, and the total number of rows.
]]]

<preview path="./action-list-slot.vue"></preview>

[[[zh
## 文本省略

为 ActionListItem 设置 `ellipsis` 后，标题与内容会限制在一行内并以省略号截断。当标题本身已经超出一行时，内容会被隐藏，只保留标题。
]]]
[[[en
## Ellipsis

Once `ellipsis` is set on an ActionListItem, its title and content stay on a single line and are truncated with an ellipsis. When the title alone already overflows, the content is hidden and only the title remains.
]]]

<preview path="./action-list-ellipsis.vue"></preview>

[[[zh
## 数据驱动行

除了使用默认插槽，也可以通过 `items` 属性传入行数据，由 ActionList 批量渲染 ActionListItem。每一项支持 `index`、`status`、`title`、`content`、`detail`、`ellipsis`、`color`、`spacing`、`lineVariant` 和 `expandable`，未设置的字段使用 ActionListItem 的默认值；`items` 与默认插槽同时存在时以 `items` 为准。
]]]
[[[en
## Data-driven Rows

Besides the default slot, the row data can be passed through the `items` prop so that ActionList renders the ActionListItem components itself. Every entry supports `index`, `status`, `title`, `content`, `detail`, `ellipsis`, `color`, `spacing`, `lineVariant`, and `expandable`, and the defaults of ActionListItem are used for the fields that are not set. When both `items` and the default slot are provided, `items` wins.
]]]

<preview path="./action-list-items.vue"></preview>

## API

[[[api zh
items: ActionList 的行数据，未提供时渲染默认插槽。
size: ActionList 的尺寸。
actionListProps.spacing: ActionList 中各行之间的间距。
lineVariant: ActionList 中连接线的样式。
actionListProps.animationDuration: ActionList 展开与收起动画的时长。
expanded: 受控模式下展开的行索引集合。
defaultExpanded: 非受控模式下默认展开的行索引集合。
collapsible: 行数超过 `maxDisplayItems` 时是否提供折叠入口。
maxDisplayItems: 收起状态下显示的行数。
collapsed: 受控模式下的收起状态。
defaultCollapsed: 非受控模式下默认的收起状态。
foldPlacement: 折叠入口相对 ActionList 的位置。

events.update:expanded: 展开的行索引集合变化时触发。
events.expandedChange: 展开的行索引集合变化时触发，参数为该集合的副本。
events.itemExpandedChange: 某一行的展开状态变化时触发。
events.update:collapsed: 收起状态变化时触发。
events.collapsedChange: 收起状态变化时触发。

slots.default: ActionList 的行内容，用于放置 ActionListItem。
slots.fold: ActionList 折叠入口的自定义内容。

index: ActionListItem 的标识。
status: ActionListItem 的状态。
title: ActionListItem 的标题。
content: ActionListItem 的补充内容。
detail: ActionListItem 展开后显示的详情内容。
icon: ActionListItem 的图标。
ellipsis: ActionListItem 的文本是否在超出一行时省略。
color: ActionListItem 的自定义颜色。
spacing: ActionListItem 的间距，会覆盖 ActionList 设置的间距。
actionListItemData.lineVariant: ActionListItem 连接线的样式，会覆盖 ActionList 设置的样式。
expandable: ActionListItem 在带有详情内容时是否可展开。
]]]
[[[api en
items: The row data of ActionList, the default slot is rendered when it is not provided.
size: The size of ActionList.
actionListProps.spacing: The spacing between the rows of ActionList.
lineVariant: The style of the connector line in ActionList.
actionListProps.animationDuration: The duration of the expand and collapse animation of ActionList.
expanded: The set of expanded row indices in controlled mode.
defaultExpanded: The set of expanded row indices in uncontrolled mode.
collapsible: Whether the fold trigger is provided when the row count exceeds `maxDisplayItems`.
maxDisplayItems: The number of rows shown while folded.
collapsed: The folded state in controlled mode.
defaultCollapsed: The folded state in uncontrolled mode.
foldPlacement: The position of the fold trigger relative to ActionList.

events.update:expanded: Triggered when the set of expanded row indices changes.
events.expandedChange: Triggered when the set of expanded row indices changes, with a copy of that set.
events.itemExpandedChange: Triggered when the expanded state of a row changes.
events.update:collapsed: Triggered when the folded state changes.
events.collapsedChange: Triggered when the folded state changes.

slots.default: The row content of ActionList, used to place ActionListItem.
slots.fold: The custom content of the fold trigger of ActionList.

index: The identifier of ActionListItem.
status: The status of ActionListItem.
title: The title of ActionListItem.
content: The supplementary content of ActionListItem.
detail: The detail content shown after ActionListItem is expanded.
icon: The icon of ActionListItem.
ellipsis: Whether the text of ActionListItem is truncated with an ellipsis when it overflows a single line.
color: The custom color of ActionListItem.
spacing: The spacing of ActionListItem, which overrides the spacing set by ActionList.
actionListItemData.lineVariant: The style of the ActionListItem connector line, which overrides the style set by ActionList.
expandable: Whether ActionListItem can be expanded when it carries detail content.
]]]

[[[api action-list-item zh
index: ActionListItem 的标识。
status: ActionListItem 的状态。
title: ActionListItem 的标题。
content: ActionListItem 的补充内容。
detail: ActionListItem 展开后显示的详情内容。
ellipsis: ActionListItem 的文本是否在超出一行时省略。
spacing: ActionListItem 的间距，会覆盖 ActionList 设置的间距。
lineVariant: ActionListItem 连接线的样式，会覆盖 ActionList 设置的样式。
color: ActionListItem 的自定义颜色。
expandable: ActionListItem 在带有详情内容时是否可展开。
animationDuration: ActionListItem 展开与收起动画的时长。

events.expandedChange: ActionListItem 的展开状态变化时触发。

slots.detail: ActionListItem 展开后显示的详情内容。
slots.title: ActionListItem 的标题。
slots.content: ActionListItem 的补充内容。
slots.icon: ActionListItem 节点处的图标。
]]]
[[[api action-list-item en
index: The identifier of ActionListItem.
status: The status of ActionListItem.
title: The title of ActionListItem.
content: The supplementary content of ActionListItem.
detail: The detail content shown after ActionListItem is expanded.
ellipsis: Whether the text of ActionListItem is truncated with an ellipsis when it overflows a single line.
spacing: The spacing of ActionListItem, which overrides the spacing set by ActionList.
lineVariant: The style of the ActionListItem connector line, which overrides the style set by ActionList.
color: The custom color of ActionListItem.
expandable: Whether ActionListItem can be expanded when it carries detail content.
animationDuration: The duration of the expand and collapse animation of ActionListItem.

events.expandedChange: Triggered when the expanded state of ActionListItem changes.

slots.detail: The detail content shown after ActionListItem is expanded.
slots.title: The title of ActionListItem.
slots.content: The supplementary content of ActionListItem.
slots.icon: The icon at the node of ActionListItem.
]]]
