[[[zh
# 复合输入控件 Input Group

用于把各种输入控件和按钮组合在一起。
]]]
[[[en
# Composite Input Controls: Input Group

Used to combine various input controls and buttons together.
]]]

[[[zh
## 基础使用

把各种输入控件和按钮组合在一起，目前支持以下组件：
- Input
- InputNumber
- InputTag
- AutoComplete
- Select
- Button
- InputGroupLabel

]]]
[[[en
## Basic Usage

Combines various input controls and buttons. Currently supported components:
- Input
- InputNumber
- InputTag
- AutoComplete
- Select
- Button
- InputGroupLabel
]]]
<preview path="./input-group-basic.vue"></preview>

[[[zh
## 圆角边框

`shape` 属性控制形状。

`borderRadius` 设置按钮圆角，优先级高于 `shape`，与 CSS `border-radius` 行为一致。
> 精力和技术力不太充足，自定义圆角还有需要优化的地方，但整体不影响使用。

]]]
[[[en
## Rounded Borders

The `shape` property controls the overall shape.

`borderRadius` sets the button corner radius; it takes precedence over `shape` and behaves like the CSS `border-radius` property.

> Due to limited time and resources, custom rounded corners still need refinement, but overall usability is not affected.
]]]
<preview path="./input-group-shape.vue"></preview>

[[[zh
## 控件尺寸

`size` 属性控制尺寸。

]]]
[[[en
## Control Sizes

The `size` property controls the dimensions of the controls.
]]]
<preview path="./input-group-size.vue"></preview>


[[[zh
## 禁用状态

`disabled` 会设置子控件的禁用状态。

]]]
[[[en
## Disabled State

The `disabled` attribute applies a disabled state to all child controls.
]]]
<preview path="./input-group-disabled.vue"></preview>

## API

[[[api zh
readonly: 是否只读。
disabled: 是否禁用。
size: 组件尺寸，将覆盖子组件的 `size`。
shape: 组件形状，将覆盖子组件的 `shape`，圆角仅作用于两侧子组件的外侧边框。
borderRadius: 圆角半径，优先级高于 `shape`，将覆盖子组件的 `borderRadius`，圆角仅作用于两侧子组件的外侧边框。与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
slots.default: 需要组合的组件。
]]]

[[[api en
disabled: Whether to disable.
readonly: Whether the input-group is readonly.
size: Component size, overrides the `size` of child components.
shape: Component shape, overrides the `shape` of child components; rounding only affects the outer borders on both sides of the child components.
borderRadius: Corner radius, takes precedence over `shape`, overrides the `borderRadius` of child components; rounding only affects the outer borders on both sides of the child components. Behaves like CSS `border-radius`: a single value or array of length 1 → applies to all four corners; length 2 → [top-left & bottom-right, top-right & bottom-left]; length 3 → [top-left, top-right & bottom-left, bottom-right]; length 4 → applies to the four corners in a clockwise order.
slots.default: Components to be grouped.
]]]

[[[api input-group-label zh
backgroundColor: 背景颜色，支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
shape: 组件形状。
borderRadius: 圆角半径，优先级高于 `shape`。与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
size: 组件尺寸。
slots.default: 标签内容。
]]]
[[[api input-group-label en
backgroundColor: Background color. Supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values.
shape: Component shape.
borderRadius: Corner radius, takes precedence over `shape`. Behaves like CSS `border-radius`: a single value or array of length 1 → applies to all four corners; length 2 → [top-left & bottom-right, top-right & bottom-left]; length 3 → [top-left, top-right & bottom-left, bottom-right]; length 4 → applies to the four corners in a clockwise order.
size: Component size.
slots.default: Label content.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```