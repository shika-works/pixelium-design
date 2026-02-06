[[[zh
# 分页

数据之大不知其几千条也。
]]]

[[[en
# Pagination

The dataset is so large it could number in the thousands.
]]]

[[[zh
## 基础使用

使用 `page` 控制分页当前页码，支持 `v-model`（受控模式）。`page` 为 `undefined` 或者没有传入时，为非受控模式，可以通过 `defaultPage` 设置其默认值。

`total` 设置当前数据总数，和 `pageSize` 一起，计算出分页的总页数。

]]]

[[[zh
## 简单模式

`simple` 属性为 `true` 时，页码选择器变为简单模式。

]]]

[[[en
## Basic usage

When the `simple` property is set to true, the page selector switches to simple mode.

]]]

<preview path="./pagination-simple.vue"></preview>

[[[zh
## 页面槽位

使用 `pageSlot` 控制展示的页面选择按钮数量。设计这个属性主要是为了防止页面选择按钮数量发生变化导致的误操作，这在其他组件库的分页组件中是比较常见的问题。这个属性设计参考了 Naive UI。

]]]

[[[en
## Page slot

Use `pageSlot` to control how many page buttons are shown. This property is designed to prevent accidental changes caused by fluctuating button counts and is inspired by Naive UI.

]]]

<preview path="./pagination-page-slot.vue"></preview>

[[[zh
## 样式变体

分页组件有 `'ghost'`（默认）、`'text'`、`'solid'`、`'outline'` 四种样式变体，通过 `variant` 属性设置。

]]]
[[[en
## Variants

Pagination supports four variants: `'ghost'` (default), `'text'`, `'solid'`, and `'outline'`. Set via the `variant` prop.

]]]

<preview path="./pagination-variant.vue"></preview>


[[[zh
## 尺寸

分页组件有 `'medium'`（默认）、`'small'`、`'large'` 三种样式变体，通过 `size` 属性设置。

]]]
[[[en
## Sizes

Pagination supports three sizes: `'medium'` (default), `'small'`, and `'large'`. Set via the `size` prop.

]]]

<preview path="./pagination-size.vue"></preview>

[[[zh
## 页面容量

使用 `pageSize` 控制分页当前页面容量，支持 `v-model`（受控模式）。`pageSize` 为 `undefined` 或者没有传入时，为非受控模式，可以通过 `defaultPageSize` 设置其默认值。

通过 `showSize` 设置页面容量选择控件的显示。
]]]
[[[en
## Page size

Use `pageSize` to control the number of items per page (supports `v-model` — controlled mode). When `pageSize` is `undefined` or not provided, the component is uncontrolled; use `defaultPageSize` to set its initial value.

Use `showSize` to toggle the page size selector.

]]]

<preview path="./pagination-page-size.vue"></preview>

[[[zh
## 数据总数

`total` 设置当前数据总数。`showTotal` 设置是否展示数据总数。通过 `totalLabel` 属性或者 `total-label` 插槽，设置数据总数展示的文本。
]]]
[[[en
## Total

`total` sets the total number of items. `showTotal` toggles the display of the total. Use the `totalLabel` prop or the `total-label` slot to customize the total text.

]]]

<preview path="./pagination-total.vue"></preview>

[[[zh
## 页面跳转

`showJumper` 设置是否展示页面跳转控件。通过 `jumperLabel` 属性或者 `jumper-label` 插槽，设置页面跳转展示的文本。
]]]
[[[en
## Jumper

`showJumper` toggles the page jumper control. Use the `jumperLabel` prop or the `jumper-label` slot to customize its label.

]]]

<preview path="./pagination-jumper.vue"></preview>

## API

[[[api zh
page: 当前的页码（受控模式）。
defaultPage: 当前的页码默认值（非受控模式）。
pageSize: 当前的页面容量（受控模式）。
defaultPageSize: 当前的页面容量默认值（非受控模式）。
total: 数据的总数。
pageSlot: 页面槽位，选择页码按钮的数量，最小值为 5。
disabled: 组件是否禁用。
variant: 组件样式变体。
size: 组件尺寸。
simple: 页码选择控件是否为简单模式。
pageSizeOptions: 页面容量选择控件的选项。
showSize: 是否展示页面容量选择控件。
showTotal: 是否展示数据总数。
showJumper: 是否页面跳转控件。
jumperLabel: 页面跳转控件的标签文本。
totalLabel: 数据总数的标签文本。
itemsOrder: 组件各个部分的展示顺序。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。该属性将会作用于内部的 Input 和 Select 等子组件。

events.update:page: 更新 `page` 的回调。
events.pageChange: `page` 改变的回调。
events.movePrev: 点击左侧箭头按钮移动页码的回调。
events.moveNext: 点击右侧箭头按钮移动页码的回调。
events.pageSelect: 点击选择页码按钮的回调。
events.pageCommit: 简单模式下，修改输入框改变页码的回调。
events.update:pageSize: 更新 `pageSize` 的回调。
events.pageSizeChange: `pageSize` 改变的回调。
events.pageJump: 页面跳转控件，修改输入框改变页码的回调。

slots.total-label: 展示数据总数的标签文本。
slots.jumper-label: 页面跳转控件的标签文本。
]]]

[[[api en
page: Current page number (controlled mode).
defaultPage: Default value of current page number (uncontrolled mode).
pageSize: Current page size (controlled mode).
defaultPageSize: Default value of current page size (uncontrolled mode).
total: Total number of data.
pageSlot: Page slot, the number of page number buttons to display, minimum value is 5.
disabled: Whether the component is disabled.
variant: Component style variant.
size: Component size.
simple: Whether the page number selector is in simple mode.
pageSizeOptions: Options for page size selector.
showSize: Whether to display the page size selector.
showTotal: Whether to display the total data count.
showJumper: Whether to display the page jumper control.
jumperLabel: Label text for the page jumper control.
totalLabel: Label text for the total data count.
itemsOrder: Display order of the component parts.
pollSizeChange: Enable polling for component size changes, which may affect performance. Commonly used when the size is affected by container elements, leading to canvas drawing abnormalities. This property will affect internal subcomponents such as Input and Select.

events.update:page: Callback for updating `page`.
events.pageChange: Callback for `page` change.
events.movePrev: Callback for clicking the left arrow button to move to the previous page.
events.moveNext: Callback for clicking the right arrow button to move to the next page.
events.pageSelect: Callback for clicking a page number button to select a page.
events.pageCommit: Callback for changing the page number by modifying the input box in simple mode.
events.update:pageSize: Callback for updating `pageSize`.
events.pageSizeChange: Callback for `pageSize` change.
events.pageJump: Callback for changing the page number by modifying the input box in the page jumper control.

slots.total-label: Label text for displaying total data count.
slots.jumper-label: Label text for the page jumper control.
]]]

[[[slice option]]]

### PaginationOption
```ts
export interface PaginationOption extends Option<number> {
	disabled?: boolean
	key?: string | number | symbol
}
```