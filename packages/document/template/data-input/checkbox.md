[[[zh
# 复选框 Checkbox

这是多选题。
]]]
[[[en
# Checkbox

This is for multiple choices.
]]]

[[[zh
## 基础使用

复选框 Checkbox，传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。

复选框 Checkbox 有两种样式变体，普通模式（`normal`，默认）和经典模式（`retro`）。经典模式的样式为致敬早期的游戏 UI 而设置。
]]]
[[[en
## Basic Usage

For the Checkbox component, passing `modelValue` puts it in controlled mode. Not passing it or passing `undefined` puts it in uncontrolled mode, where you can pass the `defaultValue` property as the default value.

Checkbox has two style variants: normal mode (`normal`, default) and retro mode (`retro`). The retro mode style is a tribute to early game UI.
]]]
<preview path="./checkbox-basic.vue"></preview>

[[[zh
## 禁用、只读状态

复选框 Checkbox，`readonly` 设置只读，`disabled` 设置禁用。此时内部 `<input>` 都会被设置 `disabled`，它们之间几乎只有样式不一样。
]]]
[[[en
## Disabled and Read-only States

For the Checkbox component, use `readonly` to set it as read-only and `disabled` to set it as disabled. In both cases, the internal `<input>` will be set to `disabled`, and the difference between them is almost only in styling.
]]]
<preview path="./checkbox-disabled.vue"></preview>

[[[zh
## 复选组

可以通过组合 CheckboxGroup 和 Checkbox 来形成一个复选组。

CheckboxGroup 的值为选中的 Checkbox 复选框组件的 `value` 组成的数组。

同样地，CheckboxGroup 传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Checkbox Group

You can combine CheckboxGroup and Checkbox to form a checkbox group.

The value of CheckboxGroup is an array composed of the `value` of selected Checkbox components.

Similarly, CheckboxGroup enters controlled mode when `modelValue` is passed. Not passing it or passing `undefined` puts it in uncontrolled mode, where you can pass the `defaultValue` property as the default value.
]]]
<preview path="./checkbox-group.vue"></preview>

[[[zh
## 半选中

Checkbox 的 `indeterminate` 为 `true` 可以把复选框置为半选中状态，这个属性仅控制样式，和当前复选框的值无关。
]]]
[[[en
## Indeterminate State

Setting Checkbox's `indeterminate` to `true` can put the checkbox in an indeterminate state. This property only controls the styling and is independent of the current checkbox value.
]]]
<preview path="./checkbox-indeterminate.vue"></preview>

[[[zh
## 垂直排列

CheckboxGroup 的 `direction` 属性用于设置子复选框的排列方向。
]]]
[[[en
## Vertical Arrangement

The `direction` property of CheckboxGroup is used to set the arrangement direction of child checkboxes.
]]]
<preview path="./checkbox-direction.vue"></preview>

[[[zh
## 复选框尺寸

Checkbox 和 CheckboxGroup 的 `size` 属性都可以用于设置复选框的尺寸。
]]]
[[[en
## Checkbox Sizes

Both Checkbox and CheckboxGroup have a `size` property that can be used to set the size of checkbox.
]]]
<preview path="./checkbox-size.vue"></preview>

[[[zh
## 选项属性

CheckboxGroup 的 `options` 属性用于直接传入选项，可以用于简单复选组的快速创建。
]]]
[[[en
## Options Property

The `options` property of CheckboxGroup is used to directly pass in options, enabling quick creation of simple checkbox groups.
]]]
<preview path="./checkbox-options.vue"></preview>

## API
[[[api zh
modelValue: 复选框组件 Checkbox 的值（受控模式）。
defaultValue: 复选框组件 Checkbox 的默认值（非受控模式）。
disabled: 禁用状态。
readonly: 只读状态。
indeterminate: 半选中状态。
label: 复选框的文本。
value: 复选框的原生 `value` 属性。
variant: 复选框的样式变体。
size: 复选框的大小。

pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。

events.update:modelValue: 更新 `modelValue` 的回调。
events.input: 选中/取消选择复选框的回调。
events.change: 复选框选中状态改变的回调。
events.focus: 复选框聚焦的回调。
events.blur: 复选框失去焦点的回调。
slots.default: 复选框的文本。
]]]
[[[api en
modelValue: The value of the Checkbox component (controlled mode).
defaultValue: The default value of the Checkbox component (uncontrolled mode).
disabled: Disabled state.
readonly: Read-only state.
indeterminate: Indeterminate state.
label: The text of the checkbox.
value: the native `value` attribute of checkboxes.
size: Size of the checkbox.
variant: The style variant of the checkbox.

pollSizeChange: Enables polling for component size changes. This may impact performance. It is typically used to resolve abnormal canvas rendering that occurs when the component's size is affected by its container element.

events.update:modelValue: Callback for updating `modelValue`.
events.input: Callback for selecting/deselecting the checkbox.
events.change: Callback for when the checkbox selection state changes.
events.focus: Callback for when the checkbox is focused.
events.blur: Callback for when the checkbox loses focus.
slots.default: The text of the checkbox.
]]]

[[[api checkbox-group zh
modelValue: 复选组组件 CheckboxGroup 的值（受控模式）。
defaultValue: 复选组组件 CheckboxGroup 的默认值（非受控模式）。
disabled: 禁用状态。
readonly: 只读状态。
direction: 复选框子组件排列方向。
options: 复选组选项。
variant: 后代的单选框组件的样式变体，如果设置，优先于后代的单选框组件自身的 `variant`。
size: 后代的复选框组件的尺寸大小，如果设置，优先于后代的复选框组件自身的 `size`。

pollSizeChange: 开启轮询组件尺寸变化，会影响 Checkbox 子组件的同名属性。

events.update:modelValue: 更新 `modelValue` 的回调。
events.change: 复选组选中内容改变的回调。
slots.default: 复选框子组件。
]]]
[[[api checkbox-group en
modelValue: The value of the CheckboxGroup component (controlled mode).
defaultValue: The default value of the CheckboxGroup component (uncontrolled mode).
disabled: Disabled state.
readonly: Read-only state.
direction: The arrangement direction of child checkbox components.
options: Options for the checkbox group.
size: Size for descendant checkbox components. When set, it overrides the `size` prop on those components.
variant: The style variant for descendant Radio components, which takes precedence over the `variant` of individual Radio components if set.

pollSizeChange: Enables polling for component size changes. This also affects the property of the same name in Checkbox sub-components.

events.update:modelValue: Callback for updating `modelValue`.
events.change: Callback for when the checkbox group selection changes.
slots.default: Child checkbox components.
]]]

### CheckboxGroupOption
```ts
export interface Option<T = any> {
	value: T
	label: string
}

export interface CheckboxGroupOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}
```