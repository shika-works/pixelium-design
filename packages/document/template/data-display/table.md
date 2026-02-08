[[[zh
# 表格 Table

这是一个表格，用于展示有行、列结构的内容。

::: warning
为确保行展开和选择行功能正常工作，需要这些功能时，请务必确保 `data` 数组中的每个数据项都包含与 `rowKey`（默认为 `'key'`）参数值同名的字段，且该字段的值在所有数据中保持唯一。

如果需要进行后端分页，请参考 [异步分页](#异步分页)。

如果需要进行跨页全选，请参考 [跨页全选](#跨页全选)。
:::
]]]
[[[en
# Table

This is a table used to display content with rows and columns.

::: warning
To ensure the row expansion and row selection functions work properly, when these functions are needed, you must ensure that each data item in the `data` array contains a field with the same name as the `rowKey` parameter (default is `'key'`), and the value of this field is unique across all data.

If backend pagination is needed, please refer to [Server-side Pagination](#server-side-pagination).

If cross-page selection is needed, please refer to [Cross-page Select all](#cross-page-select-all).
:::
]]]

[[[zh
## 基础使用
`data` 属性为表格当前数据，`columns` 属性设置表格列。

请为 `columns` 中的元素配置 `key` 属性作为行的唯一标识。

请为 `data` 中的元素配置 `key` 属性作为行的唯一标识，这个唯一标识字段可以通过 `rowKey` 控制。
]]]
[[[en
## Basic Usage
The `data` prop is the current data of the table, and the `columns` prop sets the table columns.

Please configure the `key` property for elements in `columns` as the unique identifier for rows.

Please configure the `key` property for elements in `data` as the unique identifier for rows; this unique identifier field can be controlled by `rowKey`.
]]]
<preview path="./table-basic.vue"></preview>

[[[zh
## 对齐方式

`columns[].align` 配置单元格文本的对齐方式，默认为 `'left'`。
]]]
[[[en
## Alignment

`columns[].align` configures the text alignment of cells; the default is `'left'`.
]]]
<preview path="./table-align.vue"></preview>

[[[zh
## 自定义单元格

可以用以下方式自定义单元格：
- `columns[].slotName` 配置单元格内容插槽。
- `columns[].labelSlotName` 配置表头单元格内容插槽。
- `columns[].render` 配置单元格内容渲染函数。
- `columns[].labelRender` 配置表头单元格内容渲染函数。
- `columns[].cellProps` 配置单元格属性。
- `columns[].labelCellProps` 配置表头单元格属性。
- `columns[].contentProps` 配置单元格属性。
- `columns[].labelContentProps` 配置表头单元格属性。
]]]
[[[en
## Custom Cells

You can customize cells in the following ways:
- Use `columns[].slotName` to configure a cell content slot.
- Use `columns[].labelSlotName` to configure a header cell content slot.
- Use `columns[].render` to configure a cell content render function.
- Use `columns[].labelRender` to configure a header cell render function.
- Use `columns[].cellProps` to configure cell properties.
- Use `columns[].labelCellProps` to configure header cell properties.
- Use `columns[].contentProps` to configure cell content properties.
- Use `columns[].labelContentProps` to configure header content properties.
]]]
<preview path="./table-cell.vue"></preview>


[[[zh
## 列宽度

`columns[].width` 和 `columns[].minWidth` 配置单元格宽度。

设置 `columns[].width` 时，请至少留下一列不设置，以自适应表格实际宽度。
]]]
[[[en
## Column Width

`columns[].width` and `columns[].minWidth` configure cell width.

When setting `columns[].width`, please leave at least one column unset so the table can adapt to its actual width.
]]]
<preview path="./table-width.vue"></preview>

[[[zh
## 边框和底纹
`bordered` 设置表格边框，默认展示所有边框。`variant` 设置表格背景样式变体，默认纯色背景（`'normal'`）。
]]]
[[[en
## Borders and Background

`bordered` enables table borders; by default all borders are shown. `variant` sets the table background style variant; the default is a solid background (`'normal'`).
]]]
<preview path="./table-style.vue"></preview>

[[[zh
## 表格高度

由于 `display: table` 的特性，当为该 Table 组件最外层元素设置较小的 `height` 或者 `max-height` 时，会得到预期外的效果，`<table>` 的高度仍然会被子元素撑开。

我们推荐使用 `tableAreaProps` 属性，设置固定或者动态的表格高度，例如 `:table-area-props="{ style: 'max-height: 400px' }"`。
]]]
[[[en
Due to the features of `display: table`, unexpected results may occur when setting a small `height` or `max-height` on the outermost element of the Table component. The `<table>` height will still be expanded by its child elements.

We recommend using the `tableAreaProps` property to set a fixed or dynamic table height, for example: `:table-area-props="{ style: 'max-height: 400px' }"`.
]]]
<preview path="./table-height.vue"></preview>

[[[zh
## 滚动区域

`scroll.x` 配置滚动区域宽度。Table 组件会在内部根据列配置计算出一个最小的滚动区域宽度，当表格实际宽度小于它和 `scroll.x` 的最大值时，就会展示横向滚动条。
]]]
[[[en
## Scroll Area

`scroll.x` configures the scroll area's width. The Table component internally computes a minimum scroll width based on column configuration; when the table's actual width is less than the greater of that computed minimum and `scroll.x`, a horizontal scrollbar will appear.
]]]
<preview path="./table-scroll.vue"></preview>

[[[zh
## 合并单元格

通过 `spanMethod` 属性配置合并单元格。
]]]
[[[en
## Cell Merging

Configure merged cells using the `spanMethod` property.
]]]
<preview path="./table-span.vue"></preview>

[[[zh
## 固定表头和固定列

Table 默认固定表头，可通过 `fixedHead` 属性配置。

在 `columns` 属性的子元素中设置 `fixed: 'left'` 或者 `fixed: 'right'` 进行固定列。

::: warning
固定的列在展示时，如果位于表格中间，会移动到相应的固定的两侧。

固定列配置在多级表头的情况下，只对根节点有效。
:::

]]]
[[[en
## Fixed Header and Fixed Columns

The table header is fixed by default; it can be configured with the `fixedHead` prop.

Set `fixed: 'left'` or `fixed: 'right'` on child elements of the `columns` prop to fix columns.

::: warning
Fixed columns, when rendered, will move to the corresponding fixed side if they are in the middle of the table.

Fixed column configuration only applies to root nodes in the case of multi-level headers.
:::
]]]
<preview path="./table-fixed.vue"></preview>

[[[zh
## 多级表头

在 `columns` 属性的子元素中设置 `children` 开启多级表头。

> 多级表头情况下，表头区域会展示单元格边框。

]]]
[[[en
## Multi-level Headers

Set `children` on child elements of the `columns` prop to enable multi-level headers.

> In multi-level header cases, the header area shows cell borders.
]]]
<preview path="./table-hierarchy.vue"></preview>

[[[zh
## 行选择

通过 `selection` 配置行选择。`selectedKey` 控制选择项（受控模式），不传或为 `undefined` 时，为非受控模式，可通过 `defaultSelectedKey` 配置默认值。

设置 `columns[].disabled` 禁用该行的选择器。 

> 当存在左侧固定的列时，行选择列也会固定在左侧。

]]]

[[[en
## Row Selection

Configure row selection via the `selection` prop. `selectedKey` controls selected items (controlled mode). If omitted or `undefined`, the component is uncontrolled; use `defaultSelectedKey` to provide a default.

Set `columns[].disabled` to disable the selector for a row.

> When there are left-fixed columns, the row selection column is also fixed to the left.
]]]
<preview path="./table-selection.vue"></preview>

[[[zh
## 展开行

通过 `expandable` 配置行选择。`expandedKey` 控制展开的行（受控模式），不传或为 `undefined` 时，为非受控模式，可通过 `defaultExpandedKey` 配置默认值。

展开行内容，通过 `columns[].expand` 或者 `expand` 插槽设置，为空时（设置了 `expand` 插槽情况下则为 `false`）不展示展开按钮。 

> 当存在左侧固定的列时，展开按钮列也会固定在左侧。

]]]
[[[en
## Expandable Rows

Configure expandable rows via the `expandable` prop. `expandedKey` controls expanded rows (controlled mode). If omitted or `undefined`, the component is uncontrolled; use `defaultExpandedKey` to set a default.

Row expansion content is provided via `columns[].expand` or the `expand` slot. If empty (or when the `expand` slot is set, it is considered `false`), no expand button is shown.

> When there are left-fixed columns, the expand button column is also fixed to the left.
]]]
<preview path="./table-expandable.vue"></preview>

[[[zh
## 排序

通过 `columns[].sortable` 配置排序。`sortOrder` 控制每列排序状态（受控模式），不传或为 `undefined` 时，为非受控模式，可通过 `defaultSortOrder` 配置默认值。

`columns[].sortable` 中的 `defaultSortOrder` 属性也可以配置该列的默认值。

其中，`sortMethod` 属性设置为 `'custom'` 时，没有排序效果。可以通过监听 `sortOrderChange` 事件进行后端排序。

不配置 `sortMethod` 属性时将使用默认的比较器，基于 JS 原生的大于小于运算逻辑。
]]]
[[[en
## Sorting

Configure sorting using `columns[].sortable`. `sortOrder` controls the sorting state of each column (controlled mode). If omitted or `undefined`, the component is uncontrolled; use `defaultSortOrder` to provide a default.

The `defaultSortOrder` property inside `columns[].sortable` can also set the default for that column.

When `sortMethod` is set to `'custom'`, there is no sorting behavior. Backend sorting can be implemented by listening to the `sortOrderChange` event.

If `sortMethod` is not provided, the default comparator is used, based on JavaScript's native greater-than/less-than logic.
]]]
<preview path="./table-sortable.vue"></preview>

[[[zh
## 多级排序

`columns[].sortable` 的 `sortMethod` 设置属性 `multiple` 为 `true`，开启多级排序，此时可以通过 `priority` 属性设置列的优先级，数值越大越优先。

::: warning
多级排序和单级排序是互斥的，触发其中一种排序方式的时候，会清空另一种排序方式的选择。
:::
]]]
[[[en
## Multi-column Sorting

Enable multi-column sorting by setting `multiple: true` in `columns[].sortable`'s `sortMethod`. Use the `priority` property to set a column's priority; higher values take precedence.

::: warning
Multi-column sorting and single-column sorting are mutually exclusive. Triggering one will clear the selection of the other.
:::
]]]
<preview path="./table-multiple-sort.vue"></preview>

[[[zh
## 筛选

`columns[].filterable` 配置筛选。`filterValue` 控制每列排序状态（受控模式），不传或为 `undefined` 时，为非受控模式，可通过 `defaultFilterValue` 配置默认值。

`columns[].filterable` 中的 `defaultFilterValue` 属性也可以配置该列的默认值。

不配置 `filterMethod` 属性时将使用默认的比较器，基于 JS 原生的 `===` 运算逻辑。
]]]
[[[en
## Filtering

Configure filtering with `columns[].filterable`. `filterValue` controls the filter state of each column (controlled mode). If omitted or `undefined`, the component is uncontrolled; use `defaultFilterValue` to provide a default.

The `defaultFilterValue` inside `columns[].filterable` can also set the default for that column.

If `filterMethod` is not provided, the default comparator is used, based on JavaScript's native `===` equality.
]]]
<preview path="./table-filter.vue"></preview>

[[[zh
## 总结行

`summary` 属性配置总结行。
- `summary.data` 设置总结行内容。
- `summary.summaryText` 可以设置总结行第一列的文本。
- `summary.placement` 用于调整总结行的位置，可选 `'start'` 和 `'end'`（默认），让总结行位于数据区域头部或者脚部。
- `summary.fixed` 配置总结行是否固定，默认固定总结行。
- `summary.spanMethod` 配置总结行区域的单元格合并。

::: warning
总结行位于数据区域头部时，固定总结行需要固定表头生效方可生效。
:::
]]]
[[[en
## Summary Row

Configure summary rows with the `summary` prop.
- `summary.data` sets the content of the summary row.
- `summary.summaryText` sets the text for the first column of the summary row.
- `summary.placement` adjusts the placement of the summary row; choose `'start'` or `'end'` (default) to place the summary at the top or bottom of the data area.
- `summary.fixed` configures whether the summary row is fixed; the summary row is fixed by default.
- `summary.spanMethod` configures cell merging within the summary row area.

::: warning
When the summary row is placed at the start of the data area, a fixed summary row requires a fixed header to take effect.
:::
]]]
<preview path="./table-summary.vue"></preview>

[[[zh
## 加载状态

通过设置 `loading` 配置表格的加载状态。
]]]
[[[en
## Loading State

Configure the loading state of the table by setting the `loading` property.
]]]
<preview path="./table-loading.vue"></preview>

[[[zh
## 前端分页

表格组件默认支持对传入的数据自动分页，可以通过 `pagination` 属性设置分页配置。
]]]
[[[en
## Client-side Pagination

The table component supports automatic pagination of the passed data by default. The pagination configuration can be set via the `pagination` property.
]]]
<preview path="./table-pagination.vue"></preview>

[[[zh
## 异步分页

设置 `pagination.paginateMethod` 为 `'custom` 时，表格不会进行自动排序，常用于后端分页的情况。通过 `pagination.total` 设置数据总数。
]]]
[[[en
## Server-side Pagination

When the `pagination.paginateMethod` is set to `'custom'`, the table will not perform automatic sorting. This is often used for server-side pagination. The total number of data items can be set via `pagination.total`.
]]]
<preview path="./table-pagination-async.vue"></preview>

[[[zh
## 单页时隐藏分页

设置 `pagination.hideWhenSinglePage` 设置单页时隐藏分页。
]]]
[[[en
## Hide Pagination on Single Page

Set `pagination.hideWhenSinglePage` to hide pagination when there is only a single page.
]]]
<preview path="./table-pagination-hide.vue"></preview>

[[[zh
## 实例方法

需要注意的是，为了受控模式下的状态同步，选中、展开、筛选、排序等实例方法均采用异步设计，每次调用后可能需要等待一个微任务的时间才能生效。
]]]
[[[en
## Instance Methods

It is important to note that, for the purpose of state synchronization in controlled mode, instance methods such as selection, expansion, filtering, and sorting are designed asynchronously. Each invocation may require waiting for a microtask delay to take effect.
]]]

<preview path="./table-method.vue"></preview>

[[[zh
## 跨页全选

`selection.selectAllMethod` 可以异步地自定义全选时更新的 `selectedKeys` 值。

`selection.universalSetSelectAllRef` 配置全选复选框选中状态所参考的全集：`'current'`（当前页数据，默认）、`'all'`（所有页的数据）。
]]]
[[[en
## Cross-Page Select All

`selection.selectAllMethod` can asynchronously customize the `selectedKeys` value updated during a select-all operation.

`selection.universalSetSelectAllRef` configures the universal set referenced for the select-all checkbox's checked status: `'current'` (data on the current page, default) or `'all'` (data across all pages).
]]]
<preview path="./table-select-all-cross-page.vue"></preview>

## API

[[[api zh
data: 表格的数据源。
columns: 表格的列配置集合。
bordered: 是否显示表格边框及其相关样式。
variant: 表格的展示风格。
fixedHead: 是否固定表头。
spanMethod: 用于合并行或列的计算方法。
rowKey: 用于标识行数据的唯一键名。
scroll: 表格的滚动配置（如横向滚动设置）。
selection: 是否启用行选择及其配置。
selectedKeys: 当前选中的行键集合（受控）。
defaultSelectedKeys: 默认选中的行键集合（非受控）。
expandable: 是否启用可展开行及其配置。
expandedKeys: 当前展开的行键集合（受控）。
defaultExpandedKeys: 默认展开的行键集合（非受控）。
summary: 表格汇总行的配置项。
filterValue: 当前的筛选值（受控）。
defaultFilterValue: 默认的筛选值（非受控）。
sortOrder: 当前的排序信息（受控）。
defaultSortOrder: 默认的排序信息（非受控）。
borderRadius: 表格的圆角设置。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。该属也会作用域内部单选框、多选框、分页子组件。
page: 当前的页码（受控模式）。
defaultPage: 当前的页码默认值（非受控模式）。
pageSize: 当前的页面容量（受控模式）。
defaultPageSize: 当前的页面容量默认值（非受控模式）。
pagination: 表格分页配置。
tableAreaProps: 表格区域属性对象，作用的元素你可以通过 `.px-table-area` 找到。
loading: 表格是否处于加载状态。

events.update:selectedKey: 更新 `selectedKeys` 的回调。
events.select: 选择某一行的回调。
events.selectAll: 全选的回调。
events.selectedChange: 选择的行变化的回调。
events.update:expandedKeys: 更新 `expandedKeys` 的回调。
events.expand: 展开某一行的回调。
events.expandedChange: 展开的行变化的回调。
events.update:filterValue: 更新 `filterValue` 的回调。
events.filterSelect: 选择筛选器中选项时的回调。
events.filterConfirm: 确认筛选器选择时的回调。
events.filterReset: 重置筛选器选择时的回调。
events.filterChange: 筛选器选择改变时的回调。
events.update:sortOrder: 更新 `sortOrder` 的回调。
events.sortOrderChange: 排序改变时的回调。
events.sortSelect: 选择排序方向时的回调。
events.cellMouseenter: 鼠标移入单元格的回调。
events.cellMouseleave: 鼠标移出单元格的回调。
events.cellClick: 点击数据区域单元格的回调。
events.cellDblclick: 双击数据区域单元格的回调。
events.cellContextmenu: 右键点击数据区域单元格的回调。
events.headCellClick: 点击表头单元格的回调。
events.headCellDblclick: 双击表头单元格的回调。
events.headCellContextmenu: 右键点击表头单元格的回调。
events.rowClick: 点击数据区域行的回调。
events.rowDblclick: 双击数据区域行的回调。
events.rowContextmenu: 右键点击数据区域行的回调。

slots.\[columns\[\].labelSlotName\]:表格头部单元格自定义内容的插槽。
slots.\[columns\[\].slotName\]:表格单元格自定义内容的插槽。
slots.expand:表格展开行内容的插槽。
events.update:page: 更新 `page` 的回调。
events.update:pageSize: 更新 `pageSize` 的回调。

tableExpose.getCurrentData: 获取表格经过排序和筛选的当前展示的数据。
tableExpose.getPaginatedData: 获取表格分页后的当前展示的数据。
tableExpose.select: 操作表格行选择状态。
tableExpose.selectAll: 全选 / 全不选表格行，`crossPage` 表示跨页选择，默认 `false`，`ignoreDisabled` 控制是否忽略 `disabled` 状态的行，默认 `true`。
tableExpose.clearSelect: 清除所有行的选择状态。
tableExpose.expand: 操作表格行展开状态。
tableExpose.clearExpand: 清除所有行的展开状态。
tableExpose.filter: 操作列的筛选状态。
tableExpose.clearFilter: 清除所有列的筛选状态。
tableExpose.sort: 操作列的排序状态。
tableExpose.clearSort: 清除所有列的排序状态。

tableData.expand: 展开行内容配置。
tableData.disabled: 是否禁用行选择。
tableData.\[x: string | number | symbol\]: 其他属性。

tableColumn.key: 列的唯一标识。
tableColumn.label: 表头显示文本。
tableColumn.field: 单元格对应的数据字段名。
tableColumn.width: 列宽设置。
tableColumn.minWidth: 列的最小宽度设置。
tableColumn.align: 单元格文本对齐方式。
tableColumn.fixed: 列的固定位置设置。
tableColumn.slotName: 单元格内容插槽名。
tableColumn.render: 单元格内容渲染函数或名称。
tableColumn.labelSlotName: 表头单元格内容插槽名。
tableColumn.labelRender: 表头单元格内容渲染函数或名称。
tableColumn.children: 子列集合，用于多级表头。
tableColumn.filterable: 列的筛选配置。
tableColumn.sortable: 列的排序配置。
tableColumn.cellProps: 单元格属性对象。
tableColumn.labelCellProps: 表头单元格属性对象。
tableColumn.contentProps: 单元格内容属性对象。
tableColumn.labelContentProps: 表头内容属性对象。

tableBordered.table: 表格外围边框。
tableBordered.row: 表格行水平边框。
tableBordered.col: 表格列竖直边框。
tableBordered.head: 表头区域和内容区域之间的边框。
tableBordered.side: 表格左右两侧的边框，仅 `bordered.table` 或 `bordered` 为 `true` 时生效。

tableSelection.multiple: 是否为多选。
tableSelection.showSelectAll: 是否为展示全选按钮，仅 `selection.multiple` 为 `true` 时生效。
tableSelection.label: 行选择器列的表头文本。
tableSelection.width: 行选择器列宽度。
tableSelection.minWidth: 行选择器列最小宽度。
tableSelection.fixed: 行选择器列是否固定，存在左侧固定列时，强制左侧固定。
tableSelection.onlyCurrent: 已选中行中，是否只包含当前 `data` 属性中的行。
tableSelection.cellProps: 列单元格属性对象。
tableSelection.labelCellProps: 列表头单元格属性对象。
tableSelection.contentProps: 列单元格内容属性对象。
tableSelection.labelContentProps: 列表头内容属性对象。
tableSelection.selectAllMethod: 自定义全选时更新的 `selectedKeys` 值。
tableSelection.universalSetSelectAllRef: 配置全选复选框选中状态所参考的全集。

tableExpandable.defaultExpandAllRows: 是否默认展开所有行。
tableExpandable.label: 展开按钮列的表头文本。
tableExpandable.width: 展开按钮列宽度。
tableExpandable.minWidth: 展开按钮列最小宽度。
tableExpandable.fixed: 展开按钮列是否固定，存在左侧固定列时，强制左侧固定。
tableExpandable.cellProps: 列单元格属性对象。
tableExpandable.labelCellProps: 列表头单元格属性对象。
tableExpandable.contentProps: 列单元格内容属性对象。
tableExpandable.labelContentProps: 列表头内容属性对象。

tableSummary.data: 总结行数据。
tableSummary.summaryText: 总结行首列的文本，为数组时，作用于对应下标的总结行，为字符串值时作用于所有总结行。
tableSummary.placement: 总结行位置。
tableSummary.fixed: 总结行是否固定，当总结行位于数据区域头部时，总结行固定需要 `fixedHead` 为 `true` 才生效。
tableSummary.spanMethod: 总结行合并单元格方法。

tableFilterable.filterOptions: 列的筛选选项。
tableFilterable.filterMethod: 用于判断记录是否匹配所选筛选项的函数。
tableFilterable.defaultFilterValue: 默认筛选值。
tableFilterable.multiple: 是否允许选择多选。
tableFilterable.popoverProps: 筛选弹出框的属性。

tableSortable.orders: 列的可供选择的的排序方向。
tableSortable.sortMethod: 列的排序方法。
tableSortable.defaultSortOrder: 列的排序方向的默认值。
tableSortable.multiple: 是否为多级排序。
tableSortable.priority: 多级排序的优先级，数值较大者优先。
]]]

[[[api en
data: The table's data source.
columns: The table's column configuration collection.
bordered: Whether to display table borders and related styles.
variant: The table's display variant/style.
fixedHead: Whether the header is fixed.
spanMethod: The method used to merge rows or columns.
rowKey: The key name used to uniquely identify row data.
scroll: Table scroll configuration (e.g., horizontal scroll settings).
selection: Whether row selection is enabled and its configuration.
selectedKeys: Currently selected row keys (controlled).
defaultSelectedKeys: Default selected row keys (uncontrolled).
expandable: Whether expandable rows are enabled and its configuration.
expandedKeys: Currently expanded row keys (controlled).
defaultExpandedKeys: Default expanded row keys (uncontrolled).
summary: Configuration for the table's summary row.
filterValue: Current filter values (controlled).
defaultFilterValue: Default filter values (uncontrolled).
sortOrder: Current sorting information (controlled).
defaultSortOrder: Default sorting information (uncontrolled).
borderRadius: Table border-radius settings.
pollSizeChange: Enable polling for component size changes. This may affect performance and is commonly used when a container element affects the component's size, causing canvas rendering issues. This prop also applies to internal Radio, Checkbox and Pagination child components.
page: Current page number (controlled mode).
defaultPage: Default value of current page number (uncontrolled mode).
pageSize: Current page size (controlled mode).
defaultPageSize: Default value of current page size (uncontrolled mode).
pagination: Configuration for table pagination.
tableAreaProps: A table area property object. The element it acts on can be found via `.px-table-area`.
loading: Whether table is loading.

events.update:selectedKey: Callback when `selectedKeys` is updated.
events.select: Callback when a row is selected.
events.selectAll: Callback when select-all is triggered.
events.update:selectedChange: Callback when the selected rows change.
events.update:expandedKeys: Callback when `expandedKeys` is updated.
events.expand: Callback when a row is expanded.
events.expandedChange: Callback when the expanded rows change.
events.update:filterValue: Callback when `filterValue` is updated.
events.filterSelect: Callback when an option in the filter is selected.
events.filterConfirm: Callback when filter selection is confirmed.
events.filterReset: Callback when filter selection is reset.
events.filterChange: Callback when the filter selection changes.
events.update:sortOrder: Callback when `sortOrder` is updated.
events.sortOrderChange: Callback when the sort order changes.
events.sortSelect: Callback when a sort direction is selected.
events.cellMouseenter: Callback when the mouse enters a cell.
events.cellMouseleave: Callback when the mouse leaves a cell.
events.cellClick: Callback when a cell in the data area is clicked.
events.cellDblclick: Callback when a cell in the data area is double-clicked.
events.cellContextmenu: Callback when a cell in the data area is right-clicked (context menu).
events.headCellClick: Callback when a header cell is clicked.
events.headCellDblclick: Callback when a header cell is double-clicked.
events.headCellContextmenu: Callback when a header cell is right-clicked (context menu).
events.rowClick: Callback when a row in the data area is clicked.
events.rowDblclick: Callback when a row in the data area is double-clicked.
events.rowContextmenu: Callback when a row in the data area is right-clicked (context menu).
events.update:page: Callback for updating `page`.
events.update:pageSize: Callback for updating `pageSize`.

slots.\[columns\[\].labelSlotName\]: Slot for custom content in header cells.
slots.\[columns\[\].slotName\]: Slot for custom content in table cells.
slots.expand: Slot for expanded row content.

tableExpose.getCurrentData: Get the currently displayed data of the table after sorting and filtering.
tableExpose.getPaginatedData: Get the currently displayed data of the table after pagination.
tableExpose.select: Handle the selection state of table rows.
tableExpose.selectAll: Select all/deselect all table rows. `crossPage` indicates cross-page selection, default is `false`. `ignoreDisabled` controls whether to ignore rows with a `disabled` state, default is `true`.
tableExpose.clearSelect: Clear the selection state of all rows.
tableExpose.expand: Handle the expand/collapse state of table rows.
tableExpose.clearExpand: Clear the expanded/collapsed state of all rows.
tableExpose.filter: Handle the filter state of table columns.
tableExpose.clearFilter: Clear the filter state of all columns.
tableExpose.sort: Handle the sort state of table columns.
tableExpose.clearSort: Clear the sort state of all columns.

tableData.expand: Configuration for expanded row content.
tableData.disabled: Whether row selection is disabled.
tableData.\[x: string | number | symbol\]: Other properties.

tableColumn.key: Unique identifier for the column.
tableColumn.label: Text displayed in the column header.
tableColumn.field: The data field name corresponding to the cell.
tableColumn.width: Column width setting.
tableColumn.minWidth: Minimum width setting for the column.
tableColumn.align: Cell text alignment.
tableColumn.fixed: Column fixed position setting.
tableColumn.slotName: Slot name for cell content.
tableColumn.render: Cell content render function or name.
tableColumn.labelSlotName: Slot name for header cell content.
tableColumn.labelRender: Header cell content render function or name.
tableColumn.children: Collection of child columns, used for multi-level headers.
tableColumn.filterable: Filter configuration for the column.
tableColumn.sortable: Sort configuration for the column.
tableColumn.cellProps: Cell attributes object.
tableColumn.labelCellProps: Header cell attributes object.
tableColumn.contentProps: Cell content attributes object.
tableColumn.labelContentProps: Header content attributes object.

tableBordered.table: Table outer border.
tableBordered.row: Table row horizontal border.
tableBordered.col: Table column vertical border.
tableBordered.head: Border between the header area and the content area.
tableBordered.side: Borders on the left and right sides of the table; only takes effect when `bordered.table` or `bordered` is `true`.

tableSelection.multiple: Whether multiple selection is enabled.
tableSelection.showSelectAll: Whether to show the select-all button; only effective when `selection.multiple` is `true`.
tableSelection.label: Header text for the row selection column.
tableSelection.width: Width of the row selection column.
tableSelection.minWidth: Minimum width of the row selection column.
tableSelection.fixed: Whether the row selection column is fixed; forced to the left when there are left-fixed columns.
tableSelection.onlyCurrent: Whether selected rows should only include rows in the current `data` prop.
tableSelection.cellProps: Column cell properties object.
tableSelection.labelCellProps: Column header cell properties object.
tableSelection.contentProps: Column cell content properties object.
tableSelection.labelContentProps: Column header content properties object.
tableSelection.selectAllMethod: Customizes the `selectedKeys` value updated during a select‑all operation.
tableSelection.universalSetSelectAllRef: Configures the universal set referenced for the select‑all checkbox’s checked status.

tableExpandable.defaultExpandAllRows: Whether all rows are expanded by default.
tableExpandable.label: Header text for the expand-button column.
tableExpandable.width: Width of the expand-button column.
tableExpandable.minWidth: Minimum width of the expand-button column.
tableExpandable.fixed: Whether the expand-button column is fixed; forced to the left when there are left-fixed columns.
tableExpandable.cellProps: Column cell properties object.
tableExpandable.labelCellProps: Column header cell properties object.
tableExpandable.contentProps: Column cell content properties object.
tableExpandable.labelContentProps: Column header content properties object.

tableSummary.data: Summary row data.
tableSummary.summaryText: Text for the first column of the summary row; if an array, applies to the corresponding indexed summary row; if a string, applies to all summary rows.
tableSummary.placement: Placement of the summary row.
tableSummary.fixed: Whether the summary row is fixed; when the summary row is placed at the start of the data area, fixing the summary row requires `fixedHead` to be `true`.
tableSummary.spanMethod: Method for merging cells in the summary row.

tableFilterable.filterOptions: Filter options for the column.
tableFilterable.filterMethod: Function to determine whether a record matches the selected filters.
tableFilterable.defaultFilterValue: Default filter values.
tableFilterable.multiple: Whether multiple filter options can be selected.
tableFilterable.popoverProps: Additional popover properties for the filter.

tableSortable.orders: Sort directions available for the column.
tableSortable.sortMethod: Sort method for the column.
tableSortable.defaultSortOrder: Default sort direction for the column.
tableSortable.multiple: Whether multi-column sorting is enabled.
tableSortable.priority: Priority for multi-column sorting; higher values take precedence.
]]]

### TablePagination

[[[zh
`paginateMethod` 字段控制表格组件内部的分页方法，`'auto'` 时，表格会根据页面容量对数据进行分页。为 `'custom'` 则不会有此类行为，这个配置常用于后端分页。
]]]
[[[en
The `paginateMethod` field controls the pagination method inside the table component. When set to `'auto'`, the table will paginate the data based on the page capacity. When set to `'custom'`, no such behavior will occur; this configuration is often used for backend pagination.
]]]

```ts
export type TablePagination = {
	paginateMethod?: 'custom' | 'auto'
} & PaginationProps &
	EmitEvent<PaginationEvents> &
	RestAttrs
```

### TableOptionsArg
```ts
export type TableOptionsArg = {
	rowIndex: number
	colIndex: number
	record: TableData
	column: TableColumn
}
```

[[[slice option]]]
### TableFilterOption
```ts
export interface TableFilterOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}
```

### SortOrder, FilterValue
``` ts
export type SortOrder = {
	[key: string | number | symbol]: 'asc' | 'desc' | 'none' | null | undefined
}

export type FilterValue = {
	[key: string | number | symbol]: any[] | null | undefined
}
```

[[[slice rest-attrs]]]
[[[slice emit-event]]]