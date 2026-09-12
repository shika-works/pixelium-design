[[[zh
# 气泡 Bubble

展示在说话的样子，似乎 AI 对话交互很喜欢用。
]]]
[[[en
# Bubble

It shows the appearance of speaking; AI conversational interactions seem to like using it a lot.
]]]

[[[zh
## 基础使用

Bubble 默认采用主题色浅色调，小尾巴位于**左下角**，适合作为对话左侧的气泡；将 `variant` 设为 `'primary'`、`tailPlacement` 设为 `'bottom-right'` 即可得到右侧的实色气泡。
]]]
[[[en
## Basic Usage

By default a Bubble is a theme-tinted bubble with its tail at the **bottom-left**, ready for the left side of a conversation. Set `variant` to `'primary'` and `tailPlacement` to `'bottom-right'` to get a solid, filled bubble on the right.
]]]

<preview path="./bubble-basic.vue"></preview>

[[[zh
## 配色

`variant` 控制 Bubble 的样式，可选 `'plain'`（默认，浅色调底色）与 `'primary'`（实色底色）。

`theme` 设置主题色，可选 `'primary'`（默认）、`'sakura'`、`'success'`、`'warning'`、`'danger'`、`'info'`、`'notice'`，其中 `'info'` 为中性灰。也可以通过 `color` 传入自定义颜色，它会覆盖 `theme`。
]]]
[[[en
## Colors

`variant` controls the style of Bubble: `'plain'` (default) fills it with a tint of the theme color, and `'primary'` fills it with the theme color itself.

`theme` sets the theme color and accepts `'primary'` (default), `'sakura'`, `'success'`, `'warning'`, `'danger'`, `'info'`, and `'notice'`, where `'info'` is the neutral grey. A custom color can be passed through `color`, which overrides `theme`.
]]]

<preview path="./bubble-variant.vue"></preview>

[[[zh
## 小尾巴

通过 `tailPlacement` 可以把小尾巴放到 Bubble 的四个角上。设置 `tail: false` 可以去掉尾巴，`tailWidth`、`tailHeight` 则分别控制尾巴的根部宽度和高度（px）。
]]]
[[[en
## Tail

Use `tailPlacement` to put the tail at any of the four corners of the bubble. Set `tail: false` to remove the tail; `tailWidth` and `tailHeight` control the base width and the height of the tail (px).
]]]

<preview path="./bubble-tail.vue"></preview>

[[[zh
## 圆角

`shape` 提供两种预设：`'rect'`（默认，直角）与 `'round'`（完全圆角）。

`borderRadius` 控制圆角大小。

**尾巴附着的那一个角始终是直角**
]]]
[[[en
## Border Radius

`shape` offers two presets: `'rect'` (default, square corners) and `'round'` (fully rounded).

`borderRadius` controls the size of the four rounded corners. It accepts a single value or an array in `[top-left, top-right, bottom-right, bottom-left]` order — the same as the other components — and also supports percentages.

**The corner the tail hangs from is always square.**
]]]

<preview path="./bubble-shape.vue"></preview>

## API

[[[api zh
variant: Bubble 的样式变体。
theme: Bubble 的主题色。
color: 自定义颜色，会覆盖 `theme`。
tail: 是否绘制小尾巴。
tailPlacement: 小尾巴所在的角。
tailWidth: 小尾巴根部的宽度。
tailHeight: 小尾巴的高度。
borderRadius: 圆角半径，优先级高于 `shape`，和 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。。
shape: 圆角预设，优先级低于 `borderRadius`。
pollSizeChange: 是否在容器大小变化时重新绘制。

slots.default: Bubble 的内容。
]]]
[[[api en
variant: The style variant of Bubble.
theme: The theme color of Bubble.
color: A custom color, overrides `theme`.
tail: Whether to draw the tail.
tailPlacement: The corner the tail hangs from.
tailWidth: The base width of the tail.
tailHeight: The height of the tail.
borderRadius: Corner radius, takes precedence over `shape` and behaves like CSS `border-radius`. A single value or an array of length 1 → applies to all four corners simultaneously; an array of length 2 → [top-left & bottom-right, top-right & bottom-left]; an array of length 3 → [top-left, top-right & bottom-left, bottom-right]; an array of length 4 → applies to the four corners in a clockwise order.
shape: The corner preset, lower priority than `borderRadius`.
pollSizeChange: Whether to redraw when the container size changes.

slots.default: The content of Bubble.
]]]

[[[slice percent]]]
