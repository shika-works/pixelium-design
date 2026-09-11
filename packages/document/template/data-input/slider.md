[[[zh
# 滑动选择器 Slider
这个组件让我莫名其妙地想到了滑动变阻器，和这段音乐。😂
]]]
[[[en
# Slider
This component somehow reminds me of a sliding rheostat, and this piece of music. 😂
]]]
<audio controls src="/pixelium-design/slider.mp3">
Your browser does not support audio playback. 😢
</audio>

[[[zh
## 基础使用
传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage
Pass `modelValue` to enter controlled mode. If not passed or is `undefined`, it will be in uncontrolled mode, where you can pass the `defaultValue` prop as the default value.
]]]
<preview path="./slider-basic.vue"></preview>

[[[zh
## 范围选择
`range` 属性可开启范围选择。
]]]
[[[en
## Range Selection
The `range` prop enables range selection.
]]]
<preview path="./slider-range.vue"></preview>

[[[zh
## 数值范围、步长、精度
`min` 和 `max` 设置数值范围。`step` 设置步长，为 0 时不限制步长。

`precision` 参数控制数值最小精度，取值为 [0, 100] 的整数，为 `null` 时不限制最小精度。

> 设置 `precision` 参数主要是为了处理 JS 浮点数计算中因精度丢失产生的非预期近似值。
]]]
[[[en
## Value Range, Step & Precision
`min` and `max` set the numerical range. `step` sets the step size; when it is 0, the step size is not limited.

The `precision` parameter controls the minimum precision of the numerical value. It takes an integer in [0, 100]; when it is `null`, the minimum precision is not limited.

> Setting the `precision` parameter is primarily intended to handle unexpected approximate values resulting from precision loss in JS floating-point calculations.
]]]
<preview path="./slider-step.vue"></preview>

[[[zh
## 只读 & 禁用
`readonly` 设置只读，`disabled` 设置禁用。它们之间几乎只有样式不一样。
]]]
[[[en
## Readonly & Disabled
`readonly` sets it to read-only, `disabled` sets it to disabled. The only difference between them is almost just the styling.
]]]
<preview path="./slider-disabled.vue"></preview>

[[[zh
## 标记点
`marks` 设置标记点，设置 `step` 为 `'mark'` 时仅支持选择标记点的数值。
]]]
[[[en
## Marks
`marks` sets the marks on the slider. When `step` is set to `'mark'`, only values at the marks can be selected.
]]]
<preview path="./slider-marks.vue"></preview>

[[[zh
## 标签渲染
`mark` 插槽自定义标记点的标签渲染。
]]]
[[[en
## Label Rendering
The `mark` slot customizes the rendering of labels of marks.
]]]
<preview path="./slider-mark-slot.vue"></preview>

[[[zh
## 垂直方向
`direction` 设置滑动选择器方向，垂直时高度默认为容器高度，你也可以自己设置高度。
]]]
[[[en
## Vertical Orientation
`direction` sets the orientation of the slider. When vertical, the height defaults to the container's height, but you can also set the height yourself.
]]]
<preview path="./slider-vertical.vue"></preview>

[[[zh
## 轨道反转
`direction` 设置滑动选择器方向，垂直时高度默认为容器高度，你也可以自己设置高度。
]]]
[[[en
## Track Reversal
`direction` sets the orientation of the slider. When vertical, the height defaults to the container's height, but you can also set the height yourself.
]]]
<preview path="./slider-reverse.vue"></preview>

[[[zh
## 滑块标识
可以使用 `thumb`、`thumb-start`、`thumb-end` 插槽自定义滑块中的内容。
]]]
[[[en
## Thumb Indicator
You can use the `thumb`, `thumb-start`, and `thumb-end` slots to customize the content inside the thumbs.
]]]
<preview path="./slider-thumb.vue"></preview>

## API

[[[api zh
modelValue: 滑动选择器的值（受控模式），支持 `v-model`。
defaultValue: 滑动选择器的默认值（非受控模式）。
min: 滑动选择器的最小值（闭区间）。
max: 滑动选择器的最大值（闭区间）。
range: 范围选择。
disabled: 禁用状态。
readonly: 只读状态。
step: 数值的步长。
marks: 滑动选择器的标记点。
direction: 滑动选择器的方向。
reverse: 是否反转轨道。
precision: 数值最小精度，取值为 [0, 100] 的整数，为 `null` 时不限制。 
tooltip: 是否开启文本提示。
tooltipProps: 单值模式时，文本提示 Tooltip 组件的属性。
tooltipStartProps: 范围选择模式时，第一个文本提示 Tooltip 组件的属性。
tooltipEndProps: 范围选择模式时，第二个文本提示 Tooltip 组件的属性。

pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能。

events.update:modelValue: 更新 `modelValue` 的回调。
events.change: 数值变动的回调。
events.dragStart: 开始拖拽的回调。
events.dragEnd: 结束拖拽的回调。
events.markSelect: 选择标记点的回调。
events.focus: 聚焦滑动选择器的回调。
events.blur: 滑动选择器失去焦点的回调。

slots.mark: 标记点标签的渲染。
slots.thumb: 单值模式时，滑块的内容。
slots.thumb-start: 范围选择模式时，第一个滑块的内容。
slots.thumb-end: 范围选择模式时，第二个滑块的内容。
slots.tooltip-content: 文本提示的内容。
]]]
[[[api en
modelValue: The value of the slider (controlled mode), supports `v-model`.
defaultValue: The default value of the slider (uncontrolled mode).
min: The minimum value of the slider (inclusive).
max: The maximum value of the slider (inclusive).
range: Range selection.
disabled: Disabled state.
readonly: Read-only state.
step: The step size of the values.
marks: Marks on the slider.
direction: The orientation of the slider.
reverse: Whether to reverse the track.
precision: Numerical minimum precision: an integer in [0, 100]; `null` means no limit.
tooltip: Whether to enable text tooltip.
tooltipProps: Props for the Tooltip component in single-value mode.
tooltipStartProps: Props for the first Tooltip component in range selection mode.
tooltipEndProps: Props for the second Tooltip component in range selection mode.

pollSizeChange: Enables polling for component size changes. This also affects the property of the same name in data input components that are child components.

events.update:modelValue: Callback for updating `modelValue`.
events.change: Callback for value change.
events.dragStart: Callback for drag start.
events.dragEnd: Callback for drag end.
events.markSelect: Callback for mark selection.
events.focus: Callback for slider focus.
events.blur: Callback for slider blur.

slots.mark: Rendering of mark labels.
slots.thumb: Content of the thumb in single-value mode.
slots.thumb-start: Content of the first thumb in range selection mode.
slots.thumb-end: Content of the second thumb in range selection mode.
slots.tooltip-content: Content of the text tooltip.
]]]

### EmitEvent
```ts
export type EmitEvent<T extends Record<string, any>> = {
	[K in keyof T as `on${Capitalize<K & string>}`]?: (...args: T[K]) => void
}
```