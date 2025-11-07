[[[zh
# 开关 Switch
这个组件叫做 Switch，听起来就像某款游戏机一样，好想玩......
]]]
[[[en
# Switch Component
This component is called Switch. It sounds just like a certain game console - makes me want to play so bad......

]]]

[[[zh
## 基础使用
传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage
Pass `modelValue` to enter controlled mode. If not passed or set to `undefined`, it will be in uncontrolled mode, and you can pass the `defaultValue` property as the default value.
]]]
<preview path="./switch-basic.vue"></preview>

[[[zh
## 只读 & 禁用
`readonly` 设置只读，`disabled` 设置禁用，此时内部 `<input>` 都会被设置 `disabled`。它们之间几乎只有样式不一样。
]]]
[[[en
## Readonly & Disabled
`readonly` sets read-only status, and `disabled` sets disabled status. The internal `<input>` will be set to `disabled` in both cases. They differ almost only in style.
]]]
<preview path="./switch-disabled.vue"></preview>

[[[zh
## 加载状态
`loading` 设置加载状态，会展示加载图标。
]]]
[[[en
## Loading State
`loading` sets the loading state, and a loading icon will be displayed.
]]]
<preview path="./switch-loading.vue"></preview>

[[[zh
## 提示信息
`activeTip`、`inactiveTip` 设置组件内部的文本提示，`activeLabel`、`inactiveLabel` 设置组件两侧的文本提示，也支持插槽的形式：`active-tip`、`inactive-tip`、`active-label`、`inactive-label`。

`active-icon` 和 `inactive-icon` 设置开关的图标。
]]]
[[[en
## Prompt Information
`activeTip` and `inactiveTip` set the text prompts inside the component. `activeLabel` and `inactiveLabel` set the text prompts on both sides of the component. Slot forms are also supported: `active-tip`, `inactive-tip`, `active-label`, `inactive-label`.

`active-icon` and `inactive-icon` set the icons of the switch.
]]]
<preview path="./switch-slot.vue"></preview>

[[[zh
## 背景颜色
通过 `activeColor`、`inactiveColor` 设置背景颜色。
]]]
[[[en
## Background Color
Set the background color through `activeColor` and `inactiveColor`.
]]]
<preview path="./switch-back.vue"></preview>

[[[zh
## 开关尺寸
`size` 属性设置开关的尺寸。
]]]
[[[en
## Switch Size
The `size` property sets the size of the switch.
]]]
<preview path="./switch-size.vue"></preview>

[[[zh
## 开关形状
开关有 `round` 和 `normal` 两种形状，通过 `shape` 设置。
]]]
[[[en
## Switch Shape
The switch has two shapes: `round` and `normal`, which are set via `shape`.
]]]
<preview path="./switch-shape.vue"></preview>

## API
[[[api en
modelValue: The value of the switch (controlled mode), supports `v-model`.
defaultValue: The default value of the switch (uncontrolled mode).
shape: The shape of the switch.
size: The size of the switch.
readonly: Whether it is read-only.
disabled: Whether it is disabled.
loading: Whether it is in loading state.
inactiveLabel: The text label when not selected, located outside the switch.
activeLabel: The text label when selected, located outside the switch.
inactiveTip: The text tip when not selected, located inside the switch.
activeTip: The text tip when selected, located inside the switch.
activeColor: The label color when selected, supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3, 4, 6, or 8-digit hexadecimal number representations.
inactiveColor: The label color when not selected, supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3, 4, 6, or 8-digit hexadecimal number representations.

events.update:modelValue: Callback for updating `modelValue`.
events.input: Callback when the switch is triggered.
events.change: Callback when the switch's selection state changes.
events.focus: Callback when the switch is focused.
events.blur: Callback when the switch is blurred.

slots.active-tip: Tip when selected, located inside the switch.
slots.inactive-tip: Tip when not selected, located inside the switch.
slots.active-label: Text label when selected, located outside the switch.
slots.inactive-label: Text label when not selected, located outside the switch.
slots.active-icon: Icon when selected.
slots.inactive-icon: Icon when not selected.
]]]
[[[api zh
modelValue: 开关的值（受控模式），支持 `v-model`。
defaultValue: 开关的默认值（非受控模式）。
shape: 开关的形状。
size: 开关的尺寸。
readonly: 是否只读。
disabled: 是否禁用。
loading: 是否为加载状态。
inactiveLabel: 未选中时的文本标签，位于开关外侧。
activeLabel: 选中时的文本标签，位于开关外侧。
inactiveTip: 未选中时的文本提示，位于开关内侧。
activeTip: 选中时的文本提示，位于开关内侧。
activeColor: 选中时标签颜色，支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
inactiveColor: 未选中时标签颜色，支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。

events.update:modelValue: 更新 `modelValue` 的回调。
events.input: 触发开关的回调。
events.change: 开关选中状态改变的回调。
events.focus: 聚焦开关的回调。
events.blur: 开关失焦的回调。

slots.active-tip: 选中时的提示，位于开关内侧。
slots.inactive-tip: 未选中时的提示，位于开关内侧。
slots.active-label: 选中时的文本标签，位于开关外侧。
slots.inactive-label: 未选中时的文本标签，位于开关外侧。
slots.active-icon: 选中时的图标。
slots.inactive-icon: 未选中时的图标。
]]]