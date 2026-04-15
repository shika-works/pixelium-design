[[[zh
# 日期时间选择器 DateTimePicker

选择日期时间的控件。

>悄悄告诉你，DatePicker、TimePicker、DateTimePicker 里面很可能是很可能是同一个组件。
]]]
[[[en
# DateTimePicker

A control for selecting a date.

> PS: DatePicker, TimePicker, and DateTimePicker are likely the same component internally.
]]]

[[[zh
## 基础使用

传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

Pass `modelValue` to enter controlled mode. If not passed or `undefined`, it will be uncontrolled mode, and you can pass the `defaultValue` prop as the default value.
]]]
<preview path="./date-time-picker-basic.vue"></preview>

[[[zh
## 范围选择

]]]
[[[en
## Range Selection

]]]
<preview path="./date-time-picker-range.vue"></preview>

[[[zh
## 自定义分隔符

]]]
[[[en
## Custom Separator

]]]
<preview path="./date-time-picker-splitter.vue"></preview>

[[[zh
## 自定义格式化

通过 `template` 设置格式化模板。除此以外，还可以通过 `format` 和 `parse` 设置格式化和转化函数。当时间字符串解析失败时，组件将会保持输入之前的值。
]]]
[[[en
## Custom Formatting

Set the formatting template via `template`. Additionally, you can use `format` and `parse` to customize formatting and parsing functions. When the date string fails to parse, the component will keep the previous input value.
]]]
<preview path="./date-time-picker-format.vue"></preview>

[[[zh
## 更多配置
DateTimePicker 还拥有 Input 组件的大部分功能。
]]]
[[[en
## More Options
DateTimePicker also supports most of the features of the Input component.
]]]
<preview path="./date-time-picker-more.vue"></preview>

[[[slice date-format]]]

## API

[[[api zh
modelValue: 日期时间选择器的值（受控模式），支持 `v-model`。
defaultValue: 日期时间选择器的默认值（非受控模式）。
mode: 日期时间选择的模式。
placeholder: 占位符文本。
placeholderStart: 开始时间的占位符文本。
placeholderEnd: 结束时间的占位符文本。
disabled: 是否禁用。
readonly: 是否只读。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
template: 日期格式化模板。
format: 日期格式化函数，优先于 `template`。
parse: 转化格式化字符串到时间的函数，优先于 `template`。
size: 日期时间选择器输入框尺寸。
shape: 日期时间选择器输入框形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
status: 表单验证状态。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
autofocusStart: 开始日期的原生 `<input>` 的 `autofocus` 属性。
autofocusEnd: 结束日期的原生 `<input>` 的 `autofocus` 属性。
dropdownDestroyOnHide: 下拉选择面板是否会在隐藏时销毁。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。
dropdownProps: 下拉选择面板的属性。
needDropdown: 是否需要展示下拉选择面板。
use12hours: 一天是否为十二小时。

events.input: 日期时间选择器输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
events.change: 日期时间选择器值变化时的回调。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.blur: 日期时间选择器失焦时的回调。
events.focus: 日期时间选择器聚焦时的回调。
events.select: 通过下拉面板修改日期时间选择器值时的回调。
events.monthPrev: 日期选择面板中，月份向前移动的回调。
events.monthNext: 日期选择面板中，月份向后移动的回调。
events.yearPrev: 日期选择面板中，年份向前移动的回调。
events.yearNext: 日期选择面板中，年份向后移动的回调。
events.referredDateSelect: 日期选择面板中，通过年月的下拉选项选择年月时的回调。
events.referredDateChange: 日期选择面板中，年月改变的回调。

slots.prefix: 前缀内容。
slots.suffix: 后缀内容。
slots.splitter: 范围选择时，分隔符的内容。

datePickerExpose.focus: 聚焦当前控件，范围选择时不传 `placement` 默认作用于开始时间。
datePickerExpose.blur: 取消聚焦当前控件，范围选择时不传 `placement` 默认作用于开始时间。
datePickerExpose.clear: 清空当前输入内容。
datePickerExpose.select: 选中当前输入内容，范围选择时不传 `placement` 默认作用于开始时间。
]]]

[[[api en
modelValue: The value of the date-time picker (controlled mode), supports `v-model`.
defaultValue: The default value of the date-time picker (uncontrolled mode).
mode: The mode of date selection.
placeholder: Placeholder text.
placeholderStart: Placeholder text for the start time.
placeholderEnd: Placeholder text for the end time.
disabled: Whether to disable.
readonly: Whether to be read-only.
clearable: Whether to show the clear button.
loading: Whether to show loading state.
template: Date formatting template.
format: Date formatting function, takes precedence over `template`.
parse: Function to parse formatted string into a date, takes precedence over `template`.
size: Size of the date-time picker input box.
shape: Shape of the date-time picker input box.
borderRadius: Border radius, higher priority than `shape`, consistent with CSS `border-radius` behavior; single value or array of length 1 → all four corners; array of length 2 → [top-left & bottom-right, top-right & bottom-left]; array of length 3 → [top-left, top-right & bottom-left, bottom-right]; array of length 4 → applies to corners clockwise.
status: Form validation status.
autofocus: Native `<input>` `autofocus` attribute.
autofocusStart: Native `<input>` `autofocus` attribute for the start date.
autofocusEnd: Native `<input>` `autofocus` attribute for the end date.
dropdownDestroyOnHide: Whether the dropdown panel is destroyed when hidden.
pollSizeChange: Whether to poll for component size changes (may affect performance), often used when the component is affected by container size causing canvas rendering issues.
dropdownProps: Properties for the dropdown panel.
needDropdown: Whether to show the dropdown panel.
use12hours: Whether the day uses 12-hour format.

events.input: Callback when the date-time picker input is triggered.
events.update:modelValue: Callback for updating `modelValue`.
events.change: Callback when the date-time picker value changes.
events.clear: Callback when the clear text button is clicked and content is cleared.
events.blur: Callback when the date-time picker loses focus.
events.focus: Callback when the date-time picker gains focus.
events.select: Callback when the date-time picker value is changed via the dropdown panel.
events.monthPrev: Callback when moving to the previous month in the date picker panel.
events.monthNext: Callback when moving to the next month in the date picker panel.
events.yearPrev: Callback when moving to the previous year in the date picker panel.
events.yearNext: Callback when moving to the next year in the date picker panel.
events.referredDateSelect: Callback when selecting a year/month via the dropdown options in the date picker panel.
events.referredDateChange: Callback when the year/month changes in the date picker panel.

slots.prefix: Prefix content.
slots.suffix: Suffix content.
slots.splitter: Separator content for range selection.

dateTimePickerExpose.focus: Focuses the current control; for range selection, defaults to the start time if `placement` is not provided.
dateTimePickerExpose.blur: Blurs the current control; for range selection, defaults to the start time if `placement` is not provided.
dateTimePickerExpose.clear: Clears the current input content.
dateTimePickerExpose.select: Selects the current input content; for range selection, defaults to the start time if `placement` is not provided.
]]]

[[[slice percent]]]
[[[slice rest-attrs]]]