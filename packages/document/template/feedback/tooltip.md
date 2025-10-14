[[[zh
# 文本提示 Tooltip

Tooltip 用于弹出隐藏的文本提示。

>目前 Tooltip 和 Tooltip 组件除了样式外几乎是一样的，保留两个组件是出于 UI 设计和代码后续开发的可维护性考虑。
>
>从 UI 角度来说，Tooltip 用于只读短文本提示，Tooltip 承载更丰富的内容（标题、按钮、表单等）可以让用户完成轻量操作。
]]]

[[[en
# Tooltip

The Tooltip is used to display hidden content in a popup.

> Currently, the Tooltip and Tooltip components are almost identical except for their styles. Both are retained for UI design and future code maintainability.
>
> From a UI perspective, Tooltip is used for read-only short text hints, while Tooltip is designed to hold richer content (titles, buttons, forms, etc.) and allows users to perform lightweight actions.
]]]

[[[zh

## 基础使用

Tooltip 文本提示提供 9 种展示位置。

使用 `content` 属性来设置显示的信息。 由 `placement` 属性决定弹出的位置。该属性值格式为：[方向]-[对齐位置]，分别是`'top'`、`'right'`、`'bottom'`、`'left'`、`'top-start'`、`'top-end'`、`'right-start'`、`'right-end'`、`'bottom-start'`、`'bottom-end'`、`'left-start'`、`'left-end'`，有四个展示方向，和三种对齐方式，默认的 `placement` 为 `top`。
]]]
[[[en

## Basic Usage

The Tooltip provides 9 display positions.

Use the `content` property to set the displayed information. The `placement` property determines the popup position. The property value format is: [direction]-[alignment], including `'top'`, `'right'`, `'bottom'`, `'left'`, `'top-start'`, `'top-end'`, `'right-start'`, `'right-end'`, `'bottom-start'`, `'bottom-end'`, `'left-start'`, `'left-end'`. There are four directions and three alignment options. The default `placement` is `top`.
]]]
<preview path="./tooltip-place.vue"></preview>

[[[zh

## 触发方式

`trigger` 属性设置触发方式。
]]]
[[[en

## Trigger Method

The `trigger` property sets the trigger method.
]]]
<preview path="./tooltip-trigger.vue"></preview>

[[[zh

## 受控模式

传入 `visible` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultVisible` 属性作为默认值。
]]]
[[[en

## Controlled Mode

Pass in `visible` to enable controlled mode. If not passed or set to `undefined`, it is uncontrolled. In this case, you can use the `defaultVisible` property as the default value.
]]]
<preview path="./tooltip-control.vue"></preview>

[[[zh

## 禁用状态

传入 `disabled` 设置禁用状态，禁用状态下，鼠标事件将不再影响弹出关闭。
]]]
[[[en

## Disabled State

Pass in `disabled` to set the disabled state. In this state, mouse events will no longer open or close the popup.
]]]
<preview path="./tooltip-disabled.vue"></preview>

[[[zh

## 不展示箭头

传入 `arrow` 设置是否展示箭头，默认为 `true`。
]]]
[[[en

## Hide Arrow

Pass in `arrow` to control whether the arrow is displayed. The default is `true`.
]]]
<preview path="./tooltip-arrow.vue"></preview>

[[[zh

## 偏移距离

传入 `offset` 设置弹出框和触发元素之间的距离。
]]]
[[[en

## Offset Distance

Use the `offset` property to set the distance between the popup and the trigger element.
]]]
<preview path="./tooltip-offset.vue"></preview>

## API

[[[api zh
content: 气泡内容。
visible: 是否显示气泡（受控）。
defaultVisible: 默认是否显示气泡（非受控）。
placement: 气泡相对于触发元素的位置。
trigger: 触发方式。
offset: 偏移距离，单位为像素。
variant: 气泡样式变体。
arrow: 是否显示箭头。
disabled: 是否禁用气泡。
zIndex: 气泡的 `z-index`。
root: 气泡挂载的元素。
events.update:visible: v-model 更新 visible 属性。
events.close: 气泡关闭时的回调。
events.open: 气泡打开时的回调。
slots.default: 触发元素。
slots.content: 气泡内容。
]]]
[[[api en
content: The content of the tooltip.
visible: Whether the tooltip is visible (controlled).
defaultVisible: Whether the tooltip is visible by default (uncontrolled).
placement: The position of the tooltip relative to the trigger element.
trigger: The trigger method.
offset: Offset distance in pixels.
variant: Tooltip style variant.
arrow: Whether to show the arrow.
disabled: Whether the tooltip is disabled.
zIndex: The `z-index` of the tooltip.
root: The element where the tooltip is mounted.
events.update:visible: v-model update for the visible property.
events.close: Callback when the tooltip closes.
events.open: Callback when the tooltip opens.
slots.default: The trigger element.
slots.content: The tooltip content.
]]]