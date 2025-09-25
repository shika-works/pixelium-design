[[[zh
# 主题
可能不难发现，组件库的主题颜色来源于全局的 CSS 变量。修改这些变量就可以完成主题色的定制。

如下所示，在项目初始化时，你可以通过导出的 `setThemeColor` 函数来修改主题色。
- 第一个参数为要调整的颜色组：`'primary' | 'success' | 'warning' | 'danger' | 'sakura' | 'neutral'`；
- 第二个参数为要设置的颜色，类型为 `string | { light?: string[]; dark?: string[] }`，传入字符串时，组件库将调用内部算法以传入颜色为基础，生成明暗模式下的各阶渐变颜色。你也可以传入自己定制的调色板，传入对象时，将会直接把传入的颜色赋值到全局 CSS 变量中。
]]]
[[[en
# Theme
As you may notice, the theme color of the component library originates from global CSS variables. Customizing the theme color can be achieved by modifying these variables.

As shown below, at project initialization, you can call the exported `setThemeColor` function to customize the theme color.
- The first parameter is the color group to be adjusted: `'primary' | 'success' | 'warning' | 'danger' | 'sakura' | 'neutral'`;
- The second parameter is the color to be set, which can be of type `string | { light?: string[]; dark?: string[] }`. If a string is passed, the component library will use its internal algorithm to generate gradient palette colors for light and dark modes based on the provided color. Alternatively, you can pass in a custom color palette as an object. In this case, the provided colors will directly assign to the global CSS variables.
]]]
```ts
import { createApp } from 'vue'
import App from './App.vue'

// If full import
import Pixelium, { setThemeColor } from '@pixelium/web-vue'
import '@pixelium/web-vue/dist/pixelium-vue.css'

// If on-demand import
// import { setThemeColor } from '@pixelium/web-vue/es'

// Import the font
import '@pixelium/web-vue/dist/font.css'

setThemeColor('primary', '#409EFF')

// ...
createApp(App)
  .use(Pixelium) // If full import
  // ...
  .mount('#app')
```
