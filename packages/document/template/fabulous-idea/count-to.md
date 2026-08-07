[[[zh
# 数字滚动 CountTo

一个数字滚动动画组件，常用于数据面板、统计卡片等场景的数值展示。
]]]
[[[en
# CountTo

A number count-up animation component, commonly used for displaying values in data panels, stat cards, and similar scenarios.
]]]

[[[zh
## 基础使用

通过 `to` 属性设置目标数值，CountTo 在挂载后会自动从 `from`（默认 0）滚动到 `to`。使用 `duration` 属性可以设置动画时长，使用 `precision` 属性可以设置小数位数。
]]]
[[[en
## Basic Usage

Set the target value with the `to` prop, and CountTo automatically counts from `from` (default 0) to `to` after mounting. Use the `duration` prop to set the animation length and the `precision` prop to set the number of decimal places.
]]]
<preview path="./count-to-basic.vue"></preview>

[[[zh
## 格式化

通过 `separator` 属性开启千分位分隔，`formatter` 属性可以完全自定义数值的显示格式，例如添加单位或货币符号。
]]]
[[[en
## Formatting

Enable thousands separators with the `separator` prop. The `formatter` prop allows fully customizing how the value is displayed, such as adding units or currency symbols.
]]]
<preview path="./count-to-format.vue"></preview>

[[[zh
## 延迟启动

使用 `startDelay` 属性可以让 CountTo 在挂载后延迟指定时间再开始滚动动画。
]]]
[[[en
## Delayed Start

Use the `startDelay` prop to make CountTo wait for a specified period after mounting before starting the count-up animation.
]]]
<preview path="./count-to-delay.vue"></preview>

[[[zh
## 手动控制

通过 `autoplay` 属性可以控制滚动是否自动开始。CountTo 还暴露 `start`、`pause`、`resume`、`reset` 方法，便于手动控制滚动过程：`start` 从头开始滚动，`pause` 暂停当前滚动，`resume` 从暂停处继续，`reset` 根据属性状态重置并视 `autoplay` 决定是否自动继续。
]]]
[[[en
## Manual Control

Use the `autoplay` prop to control whether the count-up starts automatically. CountTo also exposes the `start`, `pause`, `resume`, and `reset` methods for manual control over the animation: `start` plays from the beginning, `pause` pauses the current animation, `resume` continues from where it was paused, and `reset` resets the playback according to the prop state and continues automatically if `autoplay` is enabled.
]]]
<preview path="./count-to-expose.vue"></preview>

[[[zh
## 响应式更新

当 `to` 属性发生变化时，CountTo 会从当前显示的数值滚动到新的目标值；若 `autoplay` 为 `false`，则会直接更新为新的目标值。
]]]
[[[en
## Reactive Updates

When the `to` prop changes, CountTo counts from the currently displayed value to the new target; if `autoplay` is `false`, it updates directly to the new target value.
]]]
<preview path="./count-to-reactive.vue"></preview>

[[[zh
## 自定义内容

CountTo 提供 `default` 插槽来自定义数值的渲染，接收当前显示的文本 `text` 和数值 `value`。
]]]
[[[en
## Custom Content

CountTo provides the `default` slot to customize how the value is rendered, receiving the current display text `text` and the numeric value `value`.
]]]
<preview path="./count-to-slot.vue"></preview>

## API
[[[api zh
from: CountTo 动画的起始数值。
to: CountTo 动画的目标数值。
duration: CountTo 动画的时长（毫秒）。
precision: CountTo 显示数值保留的小数位数。
startDelay: CountTo 开始动画前的延迟时间。
autoplay: CountTo 是否在挂载后自动开始动画。
separator: 是否开启千分位分隔。
formatter: CountTo 的自定义格式化函数。

events.start: CountTo 开始动画时触发。
events.end: CountTo 动画结束时触发。

slots.default: 自定义 CountTo 的数值渲染。

countToExpose.start: （重新）开始 CountTo 的滚动动画。
countToExpose.pause: 暂停 CountTo 的滚动动画。
countToExpose.resume: 恢复 CountTo 被打断的滚动动画。
countToExpose.reset: 重置 CountTo 的滚动状态。
]]]
[[[api en
from: The starting value of the CountTo animation.
to: The target value of the CountTo animation.
duration: The duration of the CountTo animation (ms).
precision: The number of decimal places to keep when CountTo displays the value.
startDelay: The delay before CountTo starts the animation.
autoplay: Whether CountTo starts the animation automatically after mounting.
separator: Whether to enable thousands separators.
formatter: The custom formatting function of CountTo.

events.start: Triggered when CountTo starts the animation.
events.end: Triggered when the CountTo animation finishes.

slots.default: Customize the value rendering of CountTo.

countToExpose.start: (Re)start the CountTo count-up animation.
countToExpose.pause: Pause the CountTo count-up animation.
countToExpose.resume: Resume the interrupted CountTo count-up animation.
countToExpose.reset: Reset the CountTo count-up state.
]]]