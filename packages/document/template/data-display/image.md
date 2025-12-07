[[[zh
# 图片 Image

顾名思义，展示图片。

> 该文档示例中的图片来自 Lorem Picsum。
]]]
[[[en
# Image

As the name suggests, displays an image.

> The example images in this document are from Lorem Picsum.
]]]

[[[zh
## 基础使用

可以设置 `src`、`srcset`、`alt`，和 `<img>` 标签一样使用。
]]]
[[[en
## Basic Usage

You can set `src`, `srcset`, and `alt`, and use it just like the `<img>` tag.
]]]
<preview path="./image-basic.vue"></preview>

[[[zh
## 适应容器

`objectFit` 属性设置图片适应容器的方式，效果同 CSS 的 `object-fix`。
]]]
[[[en
## Fit to Container

The `objectFit` property sets how the image fits its container, similar to the CSS `object-fit`.
]]]
<preview path="./image-fit.vue"></preview>

[[[zh
## 占位元素和加载失败

`placeholder` 和 `error` 分别设置加载中的占位元素和加载失败的展示内容。
]]]
[[[en
## Placeholder and Load Failure

`placeholder` and `error` respectively set the content displayed while loading and when loading fails.
]]]
<preview path="./image-slot.vue"></preview>

[[[zh
## 懒加载

`loading` 设置由浏览器实现的原生图片懒加载。`lazy` 开启基于 `IntersectionObserver` 的懒加载，`root` 属性设置 `lazy` 懒加载可视区域。

> 为了防止重排发生，减少页面抖动，懒加载时推荐设置图片大小。
]]]
[[[en
## Lazy Loading

The `loading` property enables native browser image lazy loading. `lazy` enables lazy loading based on `IntersectionObserver`, and the `root` property sets the visible area for `lazy` loading.

> To prevent reflow and reduce page jitter, it is recommended to set the image size when using lazy loading.
]]]
<preview path="./image-lazy.vue"></preview>

[[[zh
## 预览

`previewable` 开启大图预览，预览图片尺寸基于图片资源的尺寸计算。
]]]
[[[en
## Preview

Enable large image preview with `previewable`. The preview image size is calculated based on the image resource dimensions.
]]]
<preview path="./image-preview.vue"></preview>

## API
[[[api zh
src: 图片资源地址，行为和原生 `<img>` 的 `src` 类似。
srcset: 响应式的图片资源地址，行为和原生 `<img>` 的 `srcset` 类似。
alt: 原生 `<img>` 的 `alt` 类似。
objectFit: 图片适应容器的方式，效果同 CSS 的 `object-fix`。
loading: 原生的图片懒加载。
lazy: 图片懒加载，开启后 `loading` 属性将失效，该属性不具有响应式。
root: 基于 `lazy` 属性的图片懒加载，可视区域的元素，为空时为视口，该属性不具有响应式。
rootMargin: 基于 `lazy` 属性的图片懒加载，距可视区域距离，该属性不具有响应式。
previewable: 是否开启大图预览。
maskProps: 预览时遮罩的属性。
popupWrapperProps: 预览时浮动层的属性。
zoomOptions: 预览图片尺寸的选项，`maxWidth` 和 `maxHeight` 为预览图片的最大宽高，`margin` 为预览图片距视口边缘的距离。
referrerpolicy: 原生 `<img>` 的 `referrerpolicy`。
crossorigin: 原生 `<img>` 的 `crossorigin`。
events.load: 图片加载完成的回调。
events.error: 图片加载失败的回调。
events.loading: `lazy` 属性的图片懒加载开始加载图片的回调。
events.preview: 开启预览图片的回调。
events.close: 关闭预览图片的回调。
slots.placeholder: 加载中的占位元素。
slots.error: 加载失败的展示内容。
]]]
[[[api en
src: Image resource URL, behaves like the native `<img>` `src`.
srcset: Responsive image resource URL, behaves like the native `<img>` `srcset`.
alt: Same as the native `<img>` `alt`.
objectFit: How the image fits its container, same as CSS `object-fit`.
loading: Native image lazy loading.
lazy: Image lazy loading. When enabled, the `loading` property will be disabled. This property is not reactive.
root: For image lazy loading based on the `lazy` property, sets the visible area element. If empty, defaults to the viewport. This property is not reactive.
rootMargin: For image lazy loading based on the `lazy` property, sets the distance from the visible area. This property is not reactive.
previewable: Whether to enable large image preview.
maskProps: Properties for the mask during preview.
popupWrapperProps: Properties for the floating layer during preview.
zoomOptions: Options for preview image size. `maxWidth` and `maxHeight` set the maximum width and height of the preview image, and `margin` sets the distance from the viewport edge.
referrerpolicy: Same as the native `<img>` `referrerpolicy`.
crossorigin: Same as the native `<img>` `crossorigin`.
events.load: Callback when the image loads successfully.
events.error: Callback when the image fails to load.
events.loading: Callback when the image starts loading with the `lazy` property.
events.preview: Callback when previewing the image.
events.close: Callback when closing the image preview.
slots.placeholder: Placeholder element while loading.
slots.error: Content displayed when loading fails.
]]]