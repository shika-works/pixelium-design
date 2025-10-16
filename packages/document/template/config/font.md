[[[zh
# 字体
组件库字体来自 [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font)，它采用 [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) 许可证。

导入 `import '@pixelium/web-vue/dist/font.css'` 后，你可以在 `font-family` 属性中设置 `'Fusion Pixel Zh_hans'`，在组件外的地方使用它。

组件的字体由 CSS 变量 `var(--px-font)` 提供，如有更改字体的需要，你可以创建一个 `--px-font` 的变量把它覆盖掉。

下面是预设的 `--px-font` 提供的字体：
]]]
[[[en
# Font
The component library font is from [Fusion Pixel](https://github.com/TakWolf/fusion-pixel-font), which uses the [SIL OFL 1.1](https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL) license.

After importing `import '@pixelium/web-vue/dist/font.css'`, you can set `'Fusion Pixel Zh_hans'` in the `font-family` property to use it outside of components.

Component fonts are provided by the CSS variable `var(--px-font)`. If you need to change the font, you can override it by creating a `--px-font` variable.

Below are the fonts provided by the preset `--px-font`:
]]]
```css
:root {
	// ...
	--px-font: 'Fusion Pixel Zh_hans', sans-serif;
}
```