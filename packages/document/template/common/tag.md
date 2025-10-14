[[[zh
# 标签 Tag

一般用来展示一些东西的特性（不是指 bug）。
]]]
[[[en
# Tag

Generally used to display the features (not referring to bugs) of something.
]]]

[[[zh
## 主题

和按钮一样，标签有几种不同颜色的主题：`'primary'`（默认）、`'success'`、`'warning'`、`'danger'`、`'info'`、`'sakura'`。
]]]
[[[en
## Theme

Like buttons, tags have several different color themes: `'primary'` (default), `'success'`, `'warning'`, `'danger'`, `'info'`, and `'sakura'`.
]]]
<preview path="./tag-theme.vue"></preview>

[[[zh
## 标签变体

标签也有几种不同的样式变体：`'primary'`（默认）、`'plain'`、`'outline'`。
]]]
[[[en
## Tag Variants

Tags also have several different style variants: `'primary'` (default), `'plain'`, and `'outline'`.
]]]
<preview path="./tag-variant.vue"></preview>

[[[zh
## 标签尺寸

标签是有大小变化的。
]]]
[[[en
## Tag Sizes

Tags come in different sizes.
]]]
<preview path="./tag-size.vue"></preview>

[[[zh
## 圆角边框

标签是长圆角的。
> 精力和技术力不太充足，自定义圆角还有需要优化的地方，但整体不影响使用。
]]]
[[[en
## Rounded Borders

Tags have rounded corners.
]]]
<preview path="./tag-shape.vue"></preview>

[[[zh
## 关闭按钮

标签的关闭按钮也是通的。
]]]
[[[en
## Close Button

Tags can have a close button.
]]]
<preview path="./tag-closable.vue"></preview>

[[[zh
## 禁用状态

禁用状态的标签关闭按钮是不通的。
]]]
[[[en
## Disabled State

The close button is disabled when the tag is disabled.
]]]
<preview path="./tag-disabled.vue"></preview>

[[[zh
## 自定义颜色
自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'`字符串和 3、4、6、8位长度的十六位数字表示。 
]]]
[[[en
## Custom Color
You can customize the main color. A complete color palette will be generated based on this color, which takes precedence over the preset palette provided by `theme`. Supports CSS-like `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'` strings, as well as 3, 4, 6, or 8-digit hexadecimal values.
]]]
<preview path="./tag-color.vue"></preview>

## API
[[[api zh
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
shape: 标签形状。
size: 标签尺寸。
disabled: 是否禁用。
variant: 标签样式变体。
theme: 标签主题。
color: 自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
closable: 标签可关闭。
events.close: 关闭事件。
slots.default: 标签内容。
]]]
[[[api en
borderRadius: Border radius, takes precedence over `shape`, and behaves the same as CSS `border-radius`. A single value or an array of length 1 → applies to all four corners; array of length 2 → [top left & bottom right, top right & bottom left]; array of length 3 → [top left, top right & bottom left, bottom right]; array of length 4 → applies to each corner in clockwise order.
shape: Tag shape.
size: Tag size.
disabled: Whether the tag is disabled.
variant: Tag style variant.
theme: Tag theme.
color: Custom main color. A complete color palette will be generated based on this color, which takes precedence over the preset palette provided by `theme`. Supports CSS-like `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'` strings, as well as 3, 4, 6, or 8-digit hexadecimal values.
closable: Whether the tag can be closed.
events.close: Close event.
slots.default: Tag content.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```