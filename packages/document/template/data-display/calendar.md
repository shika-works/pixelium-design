[[[zh
# 日历 Calendar

日历组件，支持受控/非受控模式。
]]]
[[[en
# Calendar

A calendar component supporting both controlled and uncontrolled modes.

Pass `modelValue` for controlled mode. Not passing it or passing `undefined` puts it in uncontrolled mode, where you can pass the `defaultValue` property as the default value.
]]]

[[[zh
## 基础使用

`modelValue` 控制日历组件的值，`modelValue` 不传或为 `undefined` 时，组件为非受控模式，此时可用 `defaultValue` 设置默认值。
]]]
[[[en
## Basic Usage

`modelValue` controls the value of the calendar component. When `modelValue` is not passed or is `undefined`, the component operates in uncontrolled mode, in which case `defaultValue` can be used to set the default value
]]]
<preview path="./calendar-basic.vue"></preview>

[[[zh
## 自定义头部

通过 `header` 插槽自定义日历头部显示内容，接收 `year` 和 `monthIndex` 参数。
]]]
[[[en
## Custom Header

Use the `header` slot to customize the calendar header content. It receives `year` and `monthIndex` parameters.
]]]
<preview path="./calendar-header-slot.vue"></preview>

[[[zh
## 自定义单元格

通过 `cell` 插槽自定义每个日期单元格的渲染内容，接收 `item` 参数，类型为 `CalendarItem`。
]]]
[[[en
## Custom Cell

Use the `cell` slot to customize the rendering of each date cell. It receives an `item` parameter of type `CalendarItem`.
]]]
<preview path="./calendar-cell-slot.vue"></preview>

[[[zh
## 单元格属性

通过 `cellProps` 属性为特定日期添加额外的属性，如样式、类名或原生 HTML 属性。
]]]
[[[en
## Cell Props

Use the `cellProps` property to add extra attributes (such as styles, classes, or native HTML attributes) to specific date cells.
]]]
<preview path="./calendar-cell-props.vue"></preview>

## API

[[[api zh
modelValue: 日历组件绑定值（受控模式）。
defaultValue: 日历组件默认值（非受控模式）。
cellProps: 日期单元格属性处理函数。
events.update:modelValue: 更新 `modelValue` 的回调。
events.select: 日期选中时的回调。
slots.header: 自定义头部内容。
slots.cell: 自定义日期单元格内容。
]]]
[[[api en
modelValue: The bound value of the Calendar component (controlled mode).
defaultValue: The default value of the Calendar component (uncontrolled mode).
cellProps: A handler function for customizing date cell attributes.
events.update:modelValue: Callback for updating `modelValue`.
events.select: Callback when a date is selected.
slots.header: Custom header content.
slots.cell: Custom date cell content.
]]]
