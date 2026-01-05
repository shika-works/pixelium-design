[[[zh
# 滚动条 ScrollBar

像素风格的滚动条组件，基于 [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/)。
]]]
[[[en
# ScrollBar

A pixel-style scrollbar component, based on [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/).
]]]

[[[zh
## 滚动容器

使用 ScrollBar 组件，把内容装在滚动条里。使用时可能需要设置高度样式。

传入 `scrollOffset` 作为滚动条偏移量。传入 `scrollOffset` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultScrollOffset` 属性作为默认值。

`scrollOffset` 的更新是带有防抖的，只会在停止滚动时触发。如果需要监听滚动，可以监听 `scroll` 事件。

对于 ScrollBar 组件，获取它的 DOM 元素后，可以像原生元素那样，访问 `scrollBy`、`scrollTo`、`scrollTop`、`scrollLeft` 等属性。
]]]
[[[en
## Scroll Container

Use the ScrollBar component to wrap your content inside a scrollbar. You may need to set height styles.

Pass `scrollOffset` as the scrollbar offset. Providing `scrollOffset` puts it in controlled mode. Not providing it or setting it to `undefined` puts it in uncontrolled mode, where you can pass the `defaultScrollOffset` property as the default value.

Updates to `scrollOffset` are debounced and only trigger when scrolling stops. If you need to listen for scrolling, listen to the `scroll` event.

For the ScrollBar component, after obtaining its DOM element, you can access properties like `scrollBy`, `scrollTo`, `scrollTop`, `scrollLeft`, etc., just like a native element.
]]]

<preview path="./scroll-bar-basic.vue"></preview>

[[[zh
## 函数式

使用 useScrollBar 钩子，手动为某个区域加上像素风滚动条。为需要加上滚动条的元素添加属性 `data-overlayscrollbars-initialize` 防止滚动条闪烁问题的出现。
]]]
[[[en
## Functional Usage

Use the `useScrollBar` hook to manually add a pixel-style scrollbar to a specific area. Add the attribute `data-overlayscrollbars-initialize` to the element that needs the scrollbar to prevent flickering issues.
]]]

<preview path="./scroll-bar-hook.vue"></preview>

[[[zh
这样子可以为 `<body>` 元素加上滚动条。此时也可以正常访问 `window.scrollX`、`window.scrollY`、`window.scroll`、`window.scrollTo`、`window.scrollBy` 等原生属性。

为了防止闪烁，请为 `<html>` 和 `<body>` 加上 `data-overlayscrollbars-initialize` 属性。
]]]
[[[en
This way, you can add a scrollbar to the `<body>` element. You can then normally access native properties like `window.scrollX`, `window.scrollY`, `window.scroll`, `window.scrollTo`, `window.scrollBy`, etc.

To prevent flickering, add the `data-overlayscrollbars-initialize` attribute to both `<html>` and `<body>`.
]]]

```ts
import { useScrollBar } from '@pixelium/web-vue'

// If on-demand import
// import { useScrollBar } from '@pixelium/web-vue/es'

const [init] = useScrollBar()

init({
  target: document.body
})
```

## API

[[[zh
如果不能满足你的需求，可以前往 [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/) 文档查看使用方法。

像素风滚动条的主题名为 `'px-scroll-theme'`。导入全量的样式，或者手动导入 `@pixelium/web-vue/es/scroll-bar/index.css` 后，你就可以在 OverlayScrollbars 上使用它。
]]]
[[[en
If it doesn't meet your needs, you can refer to the [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/) documentation for usage details.

The theme name for the pixel-style scrollbar is `'px-scroll-theme'`. After importing the full styles or manually importing `@pixelium/web-vue/es/scroll-bar/index.css`, you can use it with OverlayScrollbars.
]]]

[[[api zh
scrollOffset: 滚动的偏移量，受控模式，支持 `v-model`。
defaultScrollOffset: 滚动的偏移量默认值，非受控模式。

events:update:scrollOffset: 更新 `scrollOffset` 的回调。
events:initialize: 滚动条初始化的回调。
events:update: 滚动条触发更新的回调。
events:scroll: 滚动时的回调。

slots:default: 滚动容器内容。

scrollBarExpose:scrollTo: 效果同原生 `scrollsTo`。
scrollBarExpose:scrollBy: 效果同原生 `scrollBy`。
]]]

[[[api en
scrollOffset: Scroll offset, controlled mode, supports `v-model`.
defaultScrollOffset: Default value for scroll offset, uncontrolled mode.

events:update:scrollOffset: Callback when `scrollOffset` updates.
events:initialize: Callback when the scrollbar initializes.
events:update: Callback when the scrollbar updates.
events:scroll: Callback when scrolling occurs.

slots:default: Content of the scroll container.

scrollBarExpose:scrollTo: Same behavior as native `scrollsTo`.
scrollBarExpose:scrollBy: Same behavior as native `scrollBy`.
]]]