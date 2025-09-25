[[[zh
# 图标 Icon

Pixelium Design 组件库使用了来自 [@hackernoon/pixel-icon-library](https://pixeliconlibrary.com/minus-solid) 的像素风图标。该图标库提供了 400+ 矢量图标，包含了 SVG、字体图标、PNG 多种导出格式。许可证基于 [CC BY 4.0 International](https://pixeliconlibrary.com/license/) 协议。

## 导入

组件库已经将其预处理为基于 SVG 的 Vue 组件，并且支持基于 ESModule 的 Tree Shaking 优化，只有用到的图标才会被打包，这也是优于导入所有资源的字体图标的使用方式。

你可以通过从组件库的 `@pixelium/web-vue/icon-hn/es` 中导入它们。

> 和组件库导入类似：
> 
> 样式文件也会被自动导入，请确保你的构建工具支持在 JS 文件中导入样式。
> - Vite：默认支持；
> - Webpack：通常需要借助 css-loader 和 style-loader；
> - Rollup：通常需要借助 rollup-plugin-postcss 和 postcss；
> - 其他构建工具请参考它们的文档。
> 
> 请确保项目 *Typescript* 在 *4.7 版本以上*，避免类型解析异常。

举个例子：
]]]
[[[en
# Icon

Pixelium Design uses pixel-style icons from [@hackernoon/pixel-icon-library](https://pixeliconlibrary.com/minus-solid). This icon library provides 400+ vector icons and supports multiple export formats including SVG, icon fonts, and PNG. It is licensed under [CC BY 4.0 International](https://pixeliconlibrary.com/license/).

## Import

The component library has pre-processed them into SVG-based Vue components, supporting ESModule-based tree-shaking—only the icons you actually use will be bundled. This is superior to the font-icon approach that imports everything.

Import them from `@pixelium/web-vue/icon-hn/es` in the component library.

> Similar to importing the component library itself:
> 
> Style files are auto-imported; make sure your bundler supports importing styles from JS.
> - Vite: works out-of-the-box;
> - Webpack: usually needs css-loader + style-loader;
> - Rollup: typically requires rollup-plugin-postcss and postcss;
> - consult the docs for other bundlers.
> 
> Ensure your project uses *TypeScript 4.7+* to avoid type-resolution issues.

For example:
]]]

```ts
import { IconUser, IconMessage } from '@pixelium/web-vue/icon-hn/es'
```

[[[zh
这里也提供了完整导入的注册方式，注册后，可以以 `<hn-icon-user>`、`<hn-icon-message>` 这样子的方式使用它们。举个例子：
]]]
[[[en
A full importation option is also provided. Once registered, the icons can be used as `<hn-icon-user>`, `<hn-icon-message>`, etc. For example:
]]]

```ts
import { createApp } from 'vue'
import App from './App.vue'
import HnIcon from '@pixelium/web-vue/icon-hn'
import '@pixelium/web-vue/dist/pixelium-vue-icon-hn.css'

createApp(App)
  .use(HnIcon)
  .mount('#app')
```

[[[zh
## 基础使用

就像普通 Vue 组件一样使用它。图标尺寸依赖 `font-size` 样式，颜色依赖 `color` 样式。另外，`size` 和 `color` 这两个属性也可以用于设置图标的尺寸和颜色。
]]]
[[[en
## Basic Usage

Use it just like a regular Vue component. The icon size depends on the `font-size` style, and the color depends on the `color` style. Additionally, the `size` and `color` props can also be used to set the icon's size and color.
]]]
<preview path="./icon-basic.vue"></preview>

[[[zh
## 图标增强

结合 Icon 组件使用，解锁更多用法：
]]]

[[[en
## Icon Enhancements

Unlock more features by using them together with the Icon component: 
]]]

<preview path="./icon-enhance.vue"></preview>

## API
[[[api icons zh
size: 图标尺寸。
color: 图标颜色。
]]]
[[[api icons en
size: Icon's size.
color: Icon's color.
]]]
[[[api zh
size: 图标尺寸。
color: 图标颜色。
rotate: 旋转角度（顺时针）。
spin: 开启旋转动画。
flip: 镜像翻转。
slots.default: 传入的图标。
]]]
[[[api en
size: Icon size.
color: Icon color.
rotate: Rotation angle (clockwise).
spin: Enable spinning animation.
flip: Mirror flip.
slots.default: The icon passed in.
]]]
[[[zh
## 图标预览
]]]
[[[en
## Icon Overview
]]]
<IconExample />