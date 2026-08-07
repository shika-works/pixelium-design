[[[zh
# 轮播 Carousel

一个自动滚动展示内容的组件。
]]]
[[[en
# Carousel

A component that automatically scrolls its content, supporting seamless loop playback.
]]]

[[[zh
## 基础使用

Carousel 挂载后会自动开始滚动。通过 `speed` 属性可以设置滚动速度。
]]]
[[[en
## Basic Usage

Carousel starts scrolling automatically after mounting. Use the `speed` prop to set the scrolling speed.
]]]
<preview path="./carousel-basic.vue"></preview>

[[[zh
## 自动填充

设置 `autoFill` 属性后，Carousel 组件会让内容铺满整个可视区域。
]]]
[[[en
## Auto Fill

After setting the `autoFill` property, the Carousel component will make the content fill the entire viewport.
]]]
<preview path="./carousel-auto-fill.vue"></preview>

[[[zh
## 手动控制

Carousel 暴露 `resume`、`pause` 和 `reset` 方法，分别用于继续滚动、暂停滚动以及重置滚动位置并重新测量尺寸。
]]]
[[[en
## Manual Control

Carousel exposes the `resume`, `pause`, and `reset` methods, used to resume scrolling, pause scrolling, and reset the scroll position while re-measuring the dimensions respectively.
]]]
<preview path="./carousel-expose.vue"></preview>

## API

[[[api zh
autoFill: 是否根据视口宽度自动填充内容并去除间距。
speed: Carousel 的滚动速度。

slots.default: Carousel 的内容。

carouselExpose.resume: 继续 Carousel 的滚动。
carouselExpose.pause: 暂停 Carousel 的滚动。
carouselExpose.reset: 重置 Carousel 的滚动位置并重新测量尺寸。
carouselExpose.measure: 重新测量 Carousel 的尺寸。
]]]
[[[api en
autoFill: Whether to automatically fill the content based on the viewport width and remove the spacing.
speed: The scrolling speed of Carousel.

slots.default: The content of Carousel.

carouselExpose.resume: Resume the scrolling of Carousel.
carouselExpose.pause: Pause the scrolling of Carousel.
carouselExpose.reset: Reset the scroll position of Carousel and re-measure the dimensions.
carouselExpose.measure: Re-measure the dimensions of Carousel.
]]]