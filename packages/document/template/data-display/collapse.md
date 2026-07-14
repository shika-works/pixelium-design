[[[zh
# 折叠面板 Collapse

折叠面板组件用于将内容分组到可折叠的面板中。
]]]
[[[en
# Collapse

The Collapse component is used to group content into collapsible panels.
]]]

[[[zh
## 基础使用

Collapse 默认所有面板可独立展开 / 收起。

通过 `active` 属性和 `update:active` 事件可以实现受控模式，由父组件管理当前展开的面板。`active` 不传入或者为 `undefined` 时，为非受控模式，可以通过 `default-active` 设置默认展开的面板。
]]]
[[[en
## Basic Usage

By default, each panel can be independently expanded / collapsed.

Use the `active` prop together with the `update:active` event for controlled mode, where the parent component manages the active panels. When `active` is not passed or is `undefined`, the component operates in uncontrolled mode. Use `default-active` to set the initially expanded panels.
]]]

<preview path="./collapse-controlled.vue"></preview>

[[[zh
## 手风琴模式

设置 `accordion` 属性后，同一时间最多只能展开一个面板。点击已展开的面板会将其收起。
]]]
[[[en
## Accordion Mode

When the `accordion` prop is set, only one panel can be open at a time. Clicking an already open panel will close it.
]]]

<preview path="./collapse-accordion.vue"></preview>

[[[zh
## 变体样式

`variant` 属性支持三种变体：`'line'`、`'card'`（默认）、`'none'`。
]]]
[[[en
## Variants

The `variant` prop supports three styles: `'line'`, `'card'` (default), and `'none'`.
]]]

<preview path="./collapse-variant.vue"></preview>

[[[zh
## 展开图标

通过 `expand-icon-placement` 可控制展开箭头位置（`'left'` / `'right'`），`show-expand-icon` 可控制是否显示箭头。
]]]
[[[en
## Expand Icon

Use `expand-icon-placement` to control the arrow position (`'left'` / `'right'`). Use `show-expand-icon` to show or hide the arrow.
]]]

<preview path="./collapse-icon.vue"></preview>

[[[zh
## 禁用状态

在 `px-collapse-item` 上设置 `disabled` 属性可禁用该面板，禁止展开 / 收起。
]]]
[[[en
## Disabled State

Set the `disabled` prop on `px-collapse-item` to disable a panel, preventing it from being expanded or collapsed.
]]]

<preview path="./collapse-disabled.vue"></preview>

[[[zh
## 自定义插槽

`px-collapse-item` 支持 `title`、`prefix`、`suffix` 插槽，用于自定义标题区域的内容。
]]]
[[[en
## Custom Slots

`px-collapse-item` provides `title`, `prefix`, and `suffix` slots for customizing the header area.
]]]

<preview path="./collapse-slots.vue"></preview>

## API

[[[api zh
active: 当前展开的面板索引数组（受控模式）。
defaultActive: 默认展开的面板索引数组（非受控模式）。
variant: 变体样式。
accordion: 是否开启手风琴模式。
showExpandIcon: 是否显示展开箭头。
expandIconPlacement: 展开箭头位置。
animationDuration: 折叠动画时长（毫秒）。
destroyOnHide: 收起时是否销毁内容 DOM。
pollSizeChange: 是否轮询检测容器大小变化。
disabled: 是否禁用所有面板。

events.update:active: 受控模式下展开状态变化时触发，参数为当前展开的索引数组。
events.change: 展开状态变化时触发，参数为当前展开的索引数组。

slots.default: 默认插槽，用于放置 CollapseItem。
]]]
[[[api en
active: Array of currently active panel indices (controlled mode).
defaultActive: Default active panel indices (uncontrolled mode).
variant: Visual variant.
accordion: Whether to enable accordion mode.
showExpandIcon: Whether to show the expand arrow.
expandIconPlacement: Expand arrow placement.
animationDuration: Animation duration in milliseconds.
destroyOnHide: Whether to destroy content DOM when collapsed.
pollSizeChange: Whether to poll for container size changes.
disabled: Whether to disable all panels.

events.update:active: Emitted when active state changes in controlled mode, payload is the active indices array.
events.change: Emitted when active state changes, payload is the active indices array.

slots.default: Default slot for placing CollapseItem components.
]]]

[[[api collapse-item zh
index: 面板的唯一标识。
title: 面板标题文本。
disabled: 是否禁用面板。
destroyOnHide: 单独控制该面板收起时是否销毁内容 DOM。

slots.default: 面板内容。
slots.title: 自定义标题区域。
slots.prefix: 标题前缀内容。
slots.suffix: 标题后缀内容。
]]]
[[[api collapse-item en
index: Unique identifier for the panel.
title: Panel title text.
disabled: Whether to disable the panel.
destroyOnHide: Individually control whether to destroy content DOM when collapsed.

slots.default: Panel content.
slots.title: Custom title area.
slots.prefix: Content before the title.
slots.suffix: Content after the title.
]]]
