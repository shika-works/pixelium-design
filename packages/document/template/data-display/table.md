[[[zh
# 表格 Table

这是一个表格，用于展示有行、列结构的内容。
]]]

[[[zh
## 基础使用
`data` 属性为表格当前数据，`columns` 属性设置表格列。

请为 `columns` 中的元素配置 `key` 属性作为行的唯一标识。

请为 `data` 中的元素配置 `key` 属性作为行的唯一标识，这个唯一标识字段可以通过 `rowKey` 控制。
]]]
<preview path="./table-basic.vue"></preview>

[[[zh
## 对齐方式

`columns[].align` 配置单元格文本的对齐方式，默认为 `'left'`。
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
<preview path="./table-cell.vue"></preview>


[[[zh
## 列宽度

`columns[].width` 和 `columns[].minWidth` 配置单元格宽度。

设置 `columns[].width` 时，请至少留下一列不设置，以自适应表格实际宽度。
]]]
<preview path="./table-width.vue"></preview>

[[[zh
## 边框和底纹
`bordered` 设置表格边框，默认展示所有边框。`variant` 设置表格背景样式变体，默认纯色背景（`'normal'`）。
]]]
<preview path="./table-style.vue"></preview>

[[[zh
## 滚动区域

`scroll.x` 配置滚动区域宽度。Table 组件会在内部根据列配置计算出一个最小的滚动区域宽度，当表格实际宽度小于它时，就会展示横向滚动条。`scroll.x` 没有明确指定列宽度时，开启横向滚动。
]]]
<preview path="./table-scroll.vue"></preview>

[[[zh
## 固定表头和固定列

Table 默认固定表头，可通过 `fixedHead` 属性配置。

在 `columns` 属性的子元素中设置 `fixed: 'left'` 或者 `fixed: 'right'` 进行固定列。

::: warning
固定的列在展示时，如果位于表格中间，会移动到相应的固定的两侧。

固定列配置在多级表头的情况下，只对根节点有效。
:::

]]]
<preview path="./table-fixed.vue"></preview>

[[[zh
## 多级表头

在 `columns` 属性的子元素中设置 `children` 开启多级表头。

> 多级表头情况下，表头区域会单元格边框。

]]]
<preview path="./table-hierarchy.vue"></preview>

[[[zh
## 行选择

通过 `selection` 配置行选择。`selectedKey` 控制选择项（受控模式），不传或为 `undefined` 时，为非受控模式，可通过 `defaultSelectedKey` 配置默认值。

设置 `columns[].disabled` 禁用该行的选择器。 

> 当存在左侧固定的列时，行选择列也会固定在左侧。

]]]
<preview path="./table-selection.vue"></preview>

[[[zh
## 展开行

通过 `expandable` 配置行选择。`expandedKey` 控制展开的行（受控模式），不传或为 `undefined` 时，为非受控模式，可通过 `defaultExpandedKey` 配置默认值。

展开行内容，通过 `columns[].expand` 或者 `expand` 插槽设置，为空时（设置了 `expand` 插槽情况下则为`false`）不展示展开按钮。 

> 当存在左侧固定的列时，展开按钮列也会固定在左侧。

]]]
<preview path="./table-expandable.vue"></preview>
