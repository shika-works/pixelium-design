[[[zh
# 点状加载 LoadingDots

用一串依次跳动的点表示正在加载的组件。
]]]
[[[en
# LoadingDots

A component that uses a row of dots bouncing in turn to indicate loading.
]]]

[[[zh
## 基础使用

LoadingDots 默认渲染三个点。组件本身是行内元素，既可以单独使用，也可以直接嵌在文本中。
]]]
[[[en
## Basic Usage

LoadingDots renders three dots by default. The component is an inline element, so it works both on its own and embedded in text.
]]]
<preview path="./loading-dots-basic.vue"></preview>

[[[zh
## 主题与颜色

通过 `theme` 属性设置 LoadingDots 的主题，支持 `'primary'`（默认）、`'sakura'`、`'success'`、`'warning'`、`'danger'`、`'info'` 和 `'notice'`。

通过 `color` 为 LoadingDots 设置自定义颜色，它会覆盖 `theme` 的颜色。
]]]
[[[en
## Themes & Color

Use the `theme` prop to set the theme of LoadingDots. It supports `'primary'` (default), `'sakura'`, `'success'`, `'warning'`, `'danger'`, `'info'`, and `'notice'`.

Pass a custom `color` to LoadingDots to override the color of `theme`.
]]]
<preview path="./loading-dots-theme.vue"></preview>

[[[zh
## 动画风格

通过 `variant` 属性设置点的动画风格，可选 `'smooth'`（默认）与 `'pixel'`。`'smooth'` 的点会平滑起落，`'pixel'` 的点则逐帧跳变，更接近像素动画的感觉。
]]]
[[[en
## Variant

Use the `variant` prop to set the animation style of the dots. It accepts `'smooth'` (default) and `'pixel'`. The dots of `'smooth'` rise and fall smoothly, while the dots of `'pixel'` jump frame by frame, which feels closer to a pixel animation.
]]]
<preview path="./loading-dots-variant.vue"></preview>

[[[zh
## 数量

通过 `count` 属性设置点的数量，默认渲染三个点。点与点之间的动画会依次错开，数量改变后错开的节奏也会自动调整。
]]]
[[[en
## Count

Use the `count` prop to set the number of dots; three dots are rendered by default. The animations of the dots are staggered in turn, and the rhythm of the stagger is adjusted automatically when the count changes.
]]]
<preview path="./loading-dots-count.vue"></preview>

[[[zh
## 尺寸与间距

通过 `dotSize` 属性设置单个点的尺寸，通过 `interval` 属性设置点与点之间的间距。
]]]
[[[en
## Size and Interval

Use the `dotSize` prop to set the size of a single dot and the `interval` prop to set the spacing between the dots. A number is treated as pixels, while a string is used as a CSS length value. Both fall back to the pixel size of the theme when they are not set.
]]]
<preview path="./loading-dots-size.vue"></preview>

## API
[[[api zh
count: LoadingDots 中点的数量。
variant: LoadingDots 中点的动画风格。
interval: LoadingDots 中点与点之间的间距。
dotSize: LoadingDots 中单个点的尺寸。
theme: LoadingDots 的主题。
color: LoadingDots 的自定义颜色。
animationDuration: LoadingDots 中单个动画周期的时长。
]]]
[[[api en
count: The number of dots in LoadingDots.
variant: The animation style of the dots in LoadingDots.
interval: The spacing between the dots of LoadingDots.
dotSize: The size of a single dot in LoadingDots.
theme: The theme of LoadingDots.
color: Custom color of LoadingDots.
animationDuration: The duration of a single animation cycle of LoadingDots.
]]]
