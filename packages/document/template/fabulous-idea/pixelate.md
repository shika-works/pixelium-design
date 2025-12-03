[[[zh
# 像素化 Pixelate

我们组件库导出函数 `pixelateImage` 用于将图片像素化。传入 URL、base64 字符串或者 `<img>` 对象，返回像素化后的 `ImageData` 对象。可以通过组件库提供的 `imageDataToDataURL` 函数可以转为 base64 格式的字符串，直接在 `<img>` 上使用。

## 基础使用
]]]
[[[en
# Pixelate

The component library exports a `pixelateImage` function that pixelates images. Pass in a URL, base64 string, or `<img>` element, and it returns the pixelated `ImageData` object. You can use the component library's `imageDataToDataURL` function to convert it to a base64 format string for direct use in `<img>` tags.

## Basic Usage
]]]

<preview path="./pixelate-basic.vue"></preview>

## API

```ts
function pixelateImage(imageSource: string | HTMLImageElement, pixelSize: number, options?: {
    palette?: string[];
    background?: string;
}): Promise<ImageData | null>
```

[[[zh
`options.palette` 限制像素化后可用的调色板，`options.background` 是涉及透明度时，对比颜色之间的距离的参考背景色，默认 #FFF，该参数 alpha 通道会被忽略。

这两个参数都支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
]]]
[[[en
`options.palette` restricts the available palette after pixelation, and `options.background` is the reference background color for the distance between contrasting colors when transparency is involved, defaulting to #FFF, with the alpha channel being ignored.

Both parameters support CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values. ]]]