[[[zh
# 主题
可能不难发现，组件库的主题颜色来源于全局的 CSS 变量。修改这些变量就可以完成主题色的定制。

## setThemeColor
如下所示，你可以在任何地方，不管是入口文件还是业务代码中，通过导出的 `setThemeColor` 函数来修改主题色。
]]]

[[[en
# Theme
As you may notice, the theme color of the component library originates from global CSS variables. Customizing the theme color can be achieved by modifying these variables.

## setThemeColor
As shown below, you can modify the theme color through the exported `setThemeColor` function anywhere, whether in the entry file or business code.
]]]

```ts
import { setThemeColor } from '@pixelium/web-vue'
// If on-demand import
// import { setThemeColor } from '@pixelium/web-vue/es'

setThemeColor('primary', '#409EFF') // Blue
```


[[[zh
- 第一个参数为要调整的颜色组：`'primary' | 'success' | 'warning' | 'danger' | 'sakura' | 'neutral'`；
- 第二个参数为要设置的颜色，类型为 `string | { light?: string[]; dark?: string[] }`，传入字符串时，组件库将调用内部算法以传入颜色为基础，生成明暗模式下的各阶渐变颜色。你也可以传入自己定制的调色板，传入对象时，将会直接把传入的颜色赋值到全局 CSS 变量中。

可以在这里试一下：
]]]
[[[en
- The first parameter is the color group to be adjusted: `'primary' | 'success' | 'warning' | 'danger' | 'sakura' | 'neutral'`;
- The second parameter is the color to be set, which can be of type `string | { light?: string[]; dark?: string[] }`. If a string is passed, the component library will use its internal algorithm to generate gradient palette colors for light and dark modes based on the provided color. Alternatively, you can pass in a custom color palette as an object. In this case, the provided colors will directly assign to the global CSS variables.

You can try it here:
]]]

<preview path="./theme-basic.vue"></preview>