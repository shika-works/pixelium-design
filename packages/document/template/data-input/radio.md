[[[zh
# 单选框 Radio

这个组件叫做单选框......
]]]
[[[en
# Radio

This component is called Radio...
]]]

[[[zh
## 基础使用

单选框 Radio 有两种样式变体，普通模式（`normal`，默认）和经典模式（`retro`）。经典模式的样式为致敬早期的游戏 UI 而设置。

单选框 Radio，传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

Radio has two style variants: normal mode (`normal`, default) and retro mode (`retro`). The retro mode style is a tribute to early game UI.

Radio enters controlled mode when `modelValue` is passed. When not passed or `undefined`, it's in uncontrolled mode, where you can pass the `defaultValue` property as the default value.
]]]
<preview path="./radio-basic.vue"></preview>

[[[zh
## 禁用、只读状态

单选框 Radio，`readonly` 设置只读，`disabled` 设置禁用。此时内部 `<input>` 都会被设置 `disabled`，它们之间几乎只有样式不一样。
]]]
[[[en
## Disabled, Read-only State

For Radio, `readonly` sets the read-only state and `disabled` sets the disabled state. In both cases, the internal `<input>` will be set to `disabled`, with almost only style differences between them.
]]]
<preview path="./radio-disabled.vue"></preview>

[[[zh
## 单选组

可以通过组合 RadioGroup 和 Radio 来形成一个单选组。

RadioGroup 的值为选中的 Radio 单选框组件的 `value`。

类似地，RadioGroup 传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Radio Group

You can combine RadioGroup and Radio to form a radio group.

RadioGroup's value is the `value` of the selected Radio component.

Similarly, RadioGroup enters controlled mode when `modelValue` is passed. When not passed or `undefined`, it's in uncontrolled mode, where you can pass the `defaultValue` property as the default value.
]]]
<preview path="./radio-group.vue"></preview>

[[[zh
## 垂直排列

RadioGroup 的 `direction` 属性用于设置子单选框的排列方向。
]]]
[[[en
## Vertical Arrangement

RadioGroup's `direction` property is used to set the arrangement direction of child radio buttons.
]]]
<preview path="./radio-direction.vue"></preview>

[[[zh
## 单选框尺寸

Radio 和 RadioGroup 的 `size` 属性都可以用于设置单选框的尺寸。
]]]
[[[en
## Radio Sizes

Both Radio and RadioGroup have a `size` property that can be used to set the size of radio buttons.
]]]
<preview path="./radio-size.vue"></preview>

[[[zh
## 选项属性

RadioGroup 的 `options` 属性用于直接传入选项，可以用于简单单选组的快速创建。
]]]
[[[en
## Options Property

RadioGroup's `options` property is used to directly pass in options, which can be used for quick creation of simple radio groups.
]]]
<preview path="./radio-options.vue"></preview>

## API
[[[api zh
modelValue: 单选框组件 Radio 的值（受控模式）。
defaultValue: 单选框组件 Radio 的默认值（非受控模式）。
disabled: 禁用状态。
readonly: 只读状态。
label: 单选框的文本。
value: 单选框的原生 `value` 属性。
variant: 单选框的样式变体。
size: 单选框的大小。

pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

events.update:modelValue: 更新 `modelValue` 的回调。
events.input: 选中单选框的回调。
events.change: 单选框选中状态改变的回调。
events.focus: 单选框聚焦的回调。
events.blur: 单选框失去焦点的回调。
slots.default: 单选框的文本。
]]]

[[[api radio-group zh
modelValue: 单选组组件 RadioGroup 的值（受控模式）。
defaultValue: 单选组组件 RadioGroup 的默认值（非受控模式）。
disabled: 禁用状态。
readonly: 只读状态。
variant: 后代的单选框组件的样式变体，如果设置，优先于后代的单选框组件自身的 `variant`。
size: 后代的单选框组件的尺寸大小，如果设置，优先于后代的单选框组件自身的 `size`。
direction: 单选框子组件排列方向。
options: 单选组选项。

pollSizeChange: 开启轮询组件尺寸变化，会影响 Radio 子组件的同名属性。

events.update:modelValue: 更新 `modelValue` 的回调。
events.change: 单选组选中内容改变的回调。
slots.default: 单选框子组件。
]]]
[[[api en
modelValue: The value of the Radio component (controlled mode).
defaultValue: The default value of the Radio component (uncontrolled mode).
disabled: Disabled state.
readonly: Read-only state.
label: The text of the radio button.
value: The native `value` attribute of the radio button.
variant: The style variant of the radio button.
size: Size of the radio button.

pollSizeChange: Enables polling for component size changes. This may impact performance. It is typically used to resolve abnormal canvas rendering that occurs when the component's size is affected by its container element.

events.update:modelValue: Callback for updating `modelValue`.
events.input: Callback when the radio button is selected.
events.change: Callback when the radio button's selection state changes.
events.focus: Callback when the radio button receives focus.
events.blur: Callback when the radio button loses focus.
slots.default: The text of the radio button.
]]]

[[[api radio-group en
modelValue: The value of the RadioGroup component (controlled mode).
defaultValue: The default value of the RadioGroup component (uncontrolled mode).
disabled: Disabled state.
readonly: Read-only state.
variant: The style variant for descendant Radio components, which takes precedence over the `variant` of individual Radio components if set.
size: Size for descendant Radio components. When set, it overrides the `size` prop on those components.
direction: The arrangement direction of child radio buttons.
options: Options for the radio group.

pollSizeChange: Enables polling for component size changes. This also affects the property of the same name in Radio sub-components.

events.update:modelValue: Callback for updating `modelValue`.
events.change: Callback when the selection in the radio group changes.
slots.default: Child radio button components.
]]]

### RadioGroupOption
```ts
export interface Option<T = any> {
	value: T
	label: string
}

export interface RadioGroupOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}
```