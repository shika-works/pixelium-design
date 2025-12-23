[[[zh
# 提示 Alert

一个用于显示重要信息或操作反馈的消息栏组件。
]]]
[[[en
# Alert

A message bar component used to display important information or feedback for actions.
]]]

[[[en
## Alert Types
The Alert supports seven types: `'info'` (default), `'success'`, `'warning'`, `'error'`, `'loading'`, `'normal'`, and `'sakura'`.
]]]
[[[zh
## 提示类型
Alert 支持七种类型：`'info'`（默认）、`'success'`、`'warning'`、`'error'`、`'loading'`、`'normal'`、`'sakura'`。
]]]
<preview path="./alert-type.vue"></preview>

[[[en
## Alert Variants
The Alert has two style variants: `'plain'` (default) and `'primary'`.
]]]
[[[zh
## 提示变体
Alert 有两种样式变体：`'plain'`（默认）和 `'primary'`。
]]]
<preview path="./alert-variant.vue"></preview>

[[[en
## Text Alignment
Set `textAlign` to control the alignment of the content: `'start'`, `'center'`, or `'end'`.
]]]
[[[zh
## 文本对齐
通过设置 `textAlign` 控制内容对齐：`'start'`、`'center'` 或 `'end'`。
]]]
<preview path="./alert-text-align.vue"></preview>

[[[en
## Title
Use the `title` prop or `title` slot to show a prominent title above the content.
]]]
[[[zh
## 标题
可使用 `title` 属性或 `title` 插槽在内容上方显示显眼的标题。
]]]
<preview path="./alert-title.vue"></preview>

[[[en
## Closable
Enable `closable` to show a close icon; the component emits a `close` event when the icon is clicked.
]]]
[[[zh
## 可关闭
设置 `closable` 会显示关闭图标，点击时组件会触发 `close` 事件。
]]]
<preview path="./alert-closable.vue"></preview>

[[[en
## Icon
Set the icon position via `iconPlacement`: `'start'` or `'text-leading'`; control icon visibility via `showIcon`; customize the icon via the `icon` slot.
]]]
[[[zh
## 图标
通过设置 `iconPlacement` 设置图标位置：`'start'` 或 `'text-leading'`；通过 `showIcon` 控制图标显示；可通过 `icon` 插槽自定义图标。
]]]
<preview path="./alert-icon.vue"></preview>

[[[en
## Custom Color
Set `color` to provide a custom primary color: the component generates a complete palette from it and the palette will take precedence over preset theme palettes. Supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hex strings.
]]]
[[[zh
## 自定义颜色
设置 `color` 可以自定义主色，组件会基于此生成完整色板，该色板优先于主题预设。支持类似 CSS 的 `'rgb(r, g, b)'`、`'rgba(r, g, b, a)'` 字符串，和 3、4、6、8 位十六进制。
]]]
<preview path="./alert-color.vue"></preview>

[[[en
## Shape & Rounded Corner Border

Control the shape of the Alert component via `shape`.

`borderRadius` sets the Alert's rounded corners and takes precedence over `shape`, behavior follows CSS `border-radius` rules.
- Single value or array length 1 → applies to all corners
- Array length 2 → [top-left & bottom-right, top-right & bottom-left]
- Array length 3 → [top-left, top-right & bottom-left, bottom-right]
- Array length 4 → applies clockwise from top-left
]]]
[[[zh
## 形状 & 圆角边框

通过 `shape` 控制提示组件形状。

`borderRadius` 设置 Alert 的圆角，优先级高于 `shape`，与 CSS `border-radius` 行为一致：
- 单值或长度为 1 的数组 → 同时应用到四个角
- 长度为 2 的数组 → [左上 & 右下, 右上 & 左下]
- 长度为 3 的数组 → [左上, 右上 & 左下, 右下]
- 长度为 4 的数组 → 按顺时针从左上角依次应用
]]]
<preview path="./alert-radius.vue"></preview>


## API
[[[api zh
borderRadius: 圆角半径，优先级高于 `shape`，行为与 CSS `border-radius` 一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
shape: 组件形状，可选 `'rect'` 或 `'round'`。
variant: 样式变体，`'primary'` 或 `'plain'`。
type: 类型（主题），`'info'`、`'success'`、`'warning'`、`'error'`、`'loading'`、`'normal'`、`'sakura'`。
textAlign: 文本对齐，`'start'` / `'center'` / `'end'`。
title: 标题文本或通过 `title` 插槽提供。
color: 自定义主色，支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
closable: 是否显示关闭图标。
iconPlacement: 图标位置，`'start'` 或 `'text-leading'`。
showIcon: 是否显示图标。
pollSizeChange: 是否启用尺寸轮询，可能影响性能。

events.close: 关闭图标点击事件，回调参数为 `MouseEvent`。
slots.default: 内容插槽。
slots.title: 标题插槽。
slots.icon: 图标插槽。
]]]
[[[api en
borderRadius: Corner radius, takes precedence over `shape` and behaves like CSS `border-radius`.
shape: Component shape, `'rect'` or `'round'`.
variant: Style variant, `'primary'` or `'plain'`.
type: Type (theme), `'info'`, `'success'`, `'warning'`, `'error'`, `'loading'`, `'normal'`, `'sakura'`.
textAlign: Text alignment, `'start'` / `'center'` / `'end'`.
title: Title text or provided via `title` slot.
color: Custom primary color. It supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values.
closable: Whether to show close icon.
iconPlacement: Icon placement, `'start'` or `'text-leading'`.
showIcon: Whether to show icon.
pollSizeChange: Enable polling for size changes (may impact performance).

events.close: Emitted when close icon is clicked, callback receives `MouseEvent`.
slots.default: Default content slot.
slots.title: Title slot.
slots.icon: Icon slot.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```
