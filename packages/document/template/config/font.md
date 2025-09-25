[[[zh
# 字体
组件库字体来自 [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font)，它采用 [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) 许可证。

导入 `import '@pixelium/web-vue/dist/font.css'` 后，你可以在 `font-family` 属性中设置 `'Fusion Pixel Zh_hans'`，在组件外的地方使用它。

组件的字体由 class `pixelium` 提供，如有更改字体的需要，你可以创建一个 `.pixelium` 的选择器把对应的属性覆盖掉。

下面是预设的 `.pixelium` 提供的样式：
]]]
[[[en
# Font
The font used in the component library is sourced from [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font) and released under the [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) license.

By importing `import '@pixelium/web-vue/dist/font.css'`, you can specify `'Fusion Pixel Zh_hans'` in the `font-family` property to use it outside components.

The font of the component is provided by the class `pixelium`. If you need to change the font, you can override the corresponding properties by creating a `.pixelium` selector.

Below are the preset styles provided by `.pixelium`.
]]]
```css
.pixelium {
	font-family: 'Fusion Pixel Zh_hans', sans-serif;
	line-height: var(--px-line-height);
	font-size: var(--px-medium-font-size);
}
```