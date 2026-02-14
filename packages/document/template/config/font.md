[[[zh
# 字体
组件库的字体来自 [缝合像素 / Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font)，它采用 [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) 许可证。

组件的字体由 CSS 变量 `var(--px-font)` 提供，如有更改字体的需要，你可以创建一个 `--px-font` 的变量把它覆盖掉。你可以设置 `'pixelium'` 的 `class` 名称来使用 `--px-font` 字体。

下面是预设的 `pixelium` 提供的样式：
]]]
[[[en
# Font
The component library font is from [缝合像素 / Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font), which uses the [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) license.

The font of the component is provided by the CSS variable `var(--px-font)`. If you need to change the font, you can create a `--px-font` variable to override it. You can set the `class` name to `'pixelium'` to use the `--px-font` font.

Below are the preset styles provided by `pixelium`:
]]]

```css
.pixelium {
	font-family: var(--px-font);
	line-height: var(--px-line-height);
}
```

[[[zh
导入 `import '@pixelium/web-vue/dist/font.css'` 后，你可以在 `font-family` 属性中设置 `'Fusion Pixel Zh_hans'`，在组件外的地方使用这个字体。


默认情况下，汉字字形使用简体中文。这并不影响繁体中文或日韩汉字的显示，但可能存在细微差异。若需使用其他字形（如繁体、日韩汉字等），请勿导入 `'@pixelium/web-vue/dist/font.css'`。为减少项目体积，建议从 [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font) 或其他字体库下载并引用所需字体。


下面是预设的 `--px-font` 提供的字体：
]]]
[[[en
After importing `import '@pixelium/web-vue/dist/font.css'`, you can set `'Fusion Pixel Zh_hans'` in the `font-family` property to use this font outside of components.

Component fonts are provided by the CSS variable `var(--px-font)`. If you need to change the font, you can override it by creating a `--px-font` variable.

By default, the Chinese character glyphs use Simplified Chinese. This does not affect the display of Traditional Chinese or Japanese/Korean Han characters, but there may be subtle differences. If you need other glyphs (e.g., Traditional Chinese, Japanese/Korean Han characters, etc.), do not import `'@pixelium/web-vue/dist/font.css'`. To reduce project size, it is recommended to download and reference the required fonts from [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font) or other font libraries.

Below are the fonts provided by the preset `--px-font`:
]]]
```css
:root {
	// ...
	--px-font:
		'Fusion Pixel Zh_hans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun,
		sans-serif;
}
```