[[[zh
# 字体
组件库的字体来自 [缝合像素 / Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font)，它采用 [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) 许可证。

导入 `import '@pixelium/web-vue/dist/font.css'` 后，你可以在 `font-family` 属性中设置 `'Fusion Pixel Zh_hans'`，在组件外的地方使用它。

组件的字体由 CSS 变量 `var(--px-font)` 提供，如有更改字体的需要，你可以创建一个 `--px-font` 的变量把它覆盖掉。

汉字字形默认使用了简体中文，如果需要其他字形（如繁体、日韩汉字等）请不要导入 `'@pixelium/web-vue/dist/font.css'`。出于项目体积考虑，你可以前往 [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font) 或者其他字体库下载并使用。


下面是预设的 `--px-font` 提供的字体：
]]]
[[[en
# Font
The component library font is from [缝合像素 / Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font), which uses the [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) license.

After importing `import '@pixelium/web-vue/dist/font.css'`, you can set `'Fusion Pixel Zh_hans'` in the `font-family` property to use it outside of components.

Component fonts are provided by the CSS variable `var(--px-font)`. If you need to change the font, you can override it by creating a `--px-font` variable.

Chinese character glyphs use Simplified Chinese by default. To reduce project size, if you need other character sets (such as Traditional Chinese, Japanese/Korean characters, etc.), please do not import `'@pixelium/web-vue/dist/font.css'`. You can download and use alternatives from [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font) or other font libraries.

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