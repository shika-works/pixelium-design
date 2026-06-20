[[[zh
# 标签页 Tab

标签切换，切换不同的内容区域。
]]]

[[[en
# Tab

Switch between different content areas via tabs.
]]]

[[[zh
## 受控模式和非受控模式

通过 `active` 控制当前激活的标签页，支持 `v-model`（受控模式）。`active` 为 `undefined` 或者没有传入时，为非受控模式，此时可以通过 `defaultActive` 设置默认值。
]]]

[[[en
## Controlled & Uncontrolled

Use `active` to control the currently active tab, which supports `v-model` (controlled mode). When `active` is `undefined` or not passed, it operates in uncontrolled mode, and the default value can be set via `defaultActive`.
]]]

<preview path="./tab-controlled.vue"></preview>

[[[zh
## 样式变体、位置 & 对齐

通过 `variant` 属性设置标签页的样式变体，支持 `"line"`（默认）和 `"card"` 两种样式。

通过 `placement` 属性设置标签页头的位置，支持 `"top"`（默认）、`"bottom"`、`"left"`、`"right"`。

通过 `justify` 属性设置标签页头的对齐方式，支持 `"start"`（默认）、`"center"`、`"end"`。
]]]

[[[en
## Variant, Placement & Justify

Use the `variant` prop to set the tab style, supporting `"line"` (default) and `"card"`.

Use the `placement` prop to set the tab header position, supporting `"top"` (default), `"bottom"`, `"left"`, and `"right"`.

Use the `justify` prop to set the tab header alignment, supporting `"start"` (default), `"center"`, and `"end"`.
]]]

<preview path="./tab-variant-placement.vue"></preview>

[[[zh
## 禁用

通过 TabPanel 的 `disabled` 属性禁用单个标签页，禁用的标签页不可点击切换，也不可关闭。
]]]

[[[en
## Disabled

Disable individual tabs via the `disabled` prop on TabPanel. Disabled tabs cannot be clicked to switch or closed.
]]]

<preview path="./tab-disabled.vue"></preview>

[[[zh
## 创建和关闭标签页

通过 `creatable` 属性开启新增标签页功能，点击新增按钮会触发 `create` 事件，配合 `onCreate` 回调实现新增逻辑。

通过 TabPanel 或 TabItem 上的 `closable` 属性开启标签页的关闭功能，点击关闭图标会触发 `close` 事件。
]]]

[[[en
## Create & Close Tabs

Enable the create tab functionality via the `creatable` prop. Clicking the add button triggers the `create` event. Use the `onCreate` callback to implement the creation logic.

Enable the close functionality on tabs via the `closable` prop on TabPanel or TabItem. Clicking the close icon triggers the `close` event.
]]]

<preview path="./tab-creatable.vue"></preview>

[[[zh
## 图标

通过 TabPanel 的 `icon` 插槽为标签页添加图标。
]]]

[[[en
## Icon

Use the `icon` slot on TabPanel to add icons to tabs.
]]]

<preview path="./tab-icon.vue"></preview>

[[[zh
## 前缀与后缀

通过 `prefix` 和 `suffix` 插槽，在标签页头的前后添加自定义内容。
]]]

[[[en
## Prefix & Suffix

Use the `prefix` and `suffix` slots to add custom content before and after the tab header.
]]]

<preview path="./tab-prefix-suffix.vue"></preview>

[[[zh
## 仅展示标签头

使用 TabItem 作为子组件，仅展示标签页头，不包含内容面板。
]]]

[[[en
## Header Only

Use TabItem as children to render only the tab headers without content panels.
]]]

<preview path="./tab-header-only.vue"></preview>

## API

[[[api zh
active: 当前激活的标签页索引，支持 `v-model` 受控模式。
defaultActive: 当前激活的标签页索引的默认值，非受控模式。
variant: 标签页样式变体。
creatable: 是否显示新增标签页按钮。
placement: 标签页头的位置。
justify: 标签页头对齐方式。
tabMaxWidth: 标签页标题最大宽度，仅在 `placement` 为 `left` 或 `right` 时有效。
tabMinWidth: 标签页标题最小宽度，仅在 `placement` 为 `left` 或 `right` 时有效。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

events.update:active: 更新 `active` 的回调。
events.select: 选中标签页的回调。
events.close: 关闭标签页的回调。
events.create: 新增标签页的回调。

slots.default: 标签页的子组件，可以是 TabPanel 或 TabItem。
slots.prefix: 标签页头前缀内容。
slots.suffix: 标签页头后缀内容。
]]]

[[[api en
active: The index of the currently active tab. Supports controlled mode via `v-model`.
defaultActive: Default value for the active tab index in uncontrolled mode.
variant: Tab style variant.
creatable: Whether to show the add tab button.
placement: Tab header position.
justify: Tab header alignment.
tabMaxWidth: Maximum width of the tab title. Only effective when `placement` is `left` or `right`.
tabMinWidth: Minimum width of the tab title. Only effective when `placement` is `left` or `right`.
pollSizeChange: Enable polling for component size changes, which may affect performance. Commonly used when the size is affected by container elements, leading to canvas drawing abnormalities.

events.update:active: Callback when `active` updates.
events.select: Callback when a tab is selected.
events.close: Callback when a tab is closed.
events.create: Callback when a tab is created.

slots.default: Child components of the tab, which can be TabPanel or TabItem.
slots.prefix: Content to display before the tab header.
slots.suffix: Content to display after the tab header.
]]]

[[[api tab-panel zh
index: 唯一标识，用于匹配激活的标签页。
title: 标签页标题。
disabled: 是否禁用。
closable: 是否显示关闭图标。

slots.default: 标签页内容。
slots.icon: 标签页图标。
]]]

[[[api tab-panel en
index: Unique identifier used to match the active tab.
title: Tab title.
disabled: Whether the tab is disabled.
closable: Whether to show the close icon.

slots.default: Tab content.
slots.icon: Tab icon.
]]]

[[[api tab-item zh
index: 唯一标识。
title: 标签页标题。
disabled: 是否禁用。
closable: 是否显示关闭图标。

slots.default: 标签页标题内容。
slots.icon: 标签页图标。
slots.title: 标签页标题，优先级高于 `title` 属性。
]]]

[[[api tab-item en
index: Unique identifier.
title: Tab title.
disabled: Whether the tab is disabled.
closable: Whether to show the close icon.

slots.default: Tab title content.
slots.icon: Tab icon.
slots.title: Tab title slot, has higher priority than the `title` prop.
]]]
