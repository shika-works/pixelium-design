[[[zh
# 快速开始
## 安装
选择一个你喜欢的包管理器。
]]]
[[[en
# Quick Start
## Installation
Pick your favorite package manager.
]]]

::: code-group
```sh [npm]
npm install @pixelium/web-vue
```

```sh [yarn]
yarn @pixelium/web-vue
```

```sh [pnpm]
pnpm install @pixelium/web-vue
```
:::
[[[zh
## 兼容性

Pixelium Design 支持在以下环境运行：
]]]
[[[en
## Compatibility

Pixelium Design supports running in the following environments:
]]]
|<img src="/js_logo.png" width="32px" height="32px"/>ECMAScript|<img src="/edge_logo.svg" width="32px" height="32px"/>Edge|<img src="/firefox_logo.svg" width="32px" height="32px"/>Firefox|<img src="/chrome_logo.svg" width="32px" height="32px"/>Chrome|<img src="/safari_logo.svg" width="32px" height="32px"/>Safari|
|-|-|-|-|-|
|≥2020|≥88|≥78|≥87|≥14|

[[[zh
如果您需要支持旧版本的浏览器，请自行添加 [Babel](https://babeljs.io/) 和相应的 Polyfill。

## 完整导入
如果你不在意包大小，或者你会用到几乎所有的组件，我们推荐使用完整导入。
]]]
[[[en
If you need to support older browsers, please add [Babel](https://babeljs.io/) and the corresponding polyfills yourself.

## Full Import
If you don't care about bundle size, or you will be using almost every component, we recommend full import.
]]]
```ts
import { createApp } from 'vue'
import App from './App.vue'
import Pixelium from '@pixelium/web-vue'
import '@pixelium/web-vue/dist/pixelium-vue.css'
// Import the font
import '@pixelium/web-vue/dist/font.css'

createApp(App)
  .use(Pixelium)
  .mount('#app')
```
[[[zh
## 按需导入
Pixelium Design 支持基于 ESModule 的 Tree Shaking，你可以直接从 `@pixelium/web-vue/es` 直接进行按需导入。

> 样式文件也会被自动导入，请确保你的构建工具支持在 JS 文件中导入样式。
> - Vite：默认支持；
> - Webpack：通常需要借助 css-loader 和 style-loader；
> - Rollup：通常需要借助 rollup-plugin-postcss 和 postcss；
> - 其他构建工具请参考它们的文档。
> 
> 请确保项目 *Typescript* 在 *4.7 版本以上*，避免类型解析异常。
]]]
[[[en
## On-demand Import
Pixelium Design supports ESModule-based Tree Shaking.  
You can perform on-demand imports directly from `@pixelium/web-vue/es`.

> Style files are auto-imported; make sure your bundler supports importing styles from JS.
> - Vite: works out-of-the-box;
> - Webpack: usually needs css-loader + style-loader;
> - Rollup: typically requires rollup-plugin-postcss and postcss;
> - consult the docs for other bundlers.
> 
> Ensure your project uses *TypeScript 4.7+* to avoid type-resolution issues.
]]]
```ts
// Import the font at the project entry
import '@pixelium/web-vue/dist/font.css'
```
```ts
// Use components in the business code by on-demand import
import { Button, Link } from '@pixelium/web-vue/es'
```