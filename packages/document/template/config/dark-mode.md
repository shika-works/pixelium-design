[[[zh
# 暗黑模式
Pixelium Design 已把所有颜色变量提取为 CSS 变量。基于此，我们支持了暗黑模式，并且支持默认的自动跟随系统切换和手动切换。
- 跟随系统：`@media (prefers-color-scheme: dark)` 媒体查询自动切换暗黑模式。
- 手动切换：通过使用 `useThemeMode` 钩子手动设置 `html` 节点上的类名实现。

## useThemeMode
`useThemeMode` 通过设置 `html` 节点上的类名实现暗黑 / 明亮主题模式切换，它使得 CSS 选择器或者某些监听器受到影响从而改变组件的主题颜色。

一个简单的使用例子如下所示：
]]]

[[[en
# Dark Mode
Pixelium Design has extracted all color variables as CSS variables. Based on this, we support dark mode, including both automatic switching following the system and manual switching.

- Follow system: Automatically switch to dark mode using the `@media (prefers-color-scheme: dark)` media query.
- Manual switch: Manually set the class name on the `html` node using the `useThemeMode` hook.

## useThemeMode
`useThemeMode` switches between dark and light themes by setting a class name on the `html` node, which affects CSS selectors or certain listeners to change the component's theme colors.

A simple example is shown below:
]]]

```ts
import { useThemeMode } from '@pixelium/web-vue'

// If on-demand import
// import { useThemeMode } from '@pixelium/web-vue/es'

const [mode, toggle, clear, followMedia] = useThemeMode()
```

[[[zh
`mode` 是一个 Vue ref 变量，有 3 个取值：`'dark'`（暗黑模式）、`'light'`（明亮模式）、`'unset'`（跟随系统）。默认值是当前 `@media (prefers-color-scheme: dark)` 媒体查询对应的主题模式。它将会设置 `html` 节点上的类名，通过修改它的值就可以切换到暗黑 / 明亮模式。

`toggle` 是切换暗黑 / 明亮模式的函数。

`clear` 用于把主题切换到跟随系统。

`clear` 用于把主题切换到跟随系统。

`followMedia` 把当前 `@media (prefers-color-scheme: dark)` 媒体查询对应的主题模式应用到 `mode` 中。

可以在这里试一下：
]]]

[[[en
`mode` is a Vue ref variable with three possible values: `'dark'` (dark mode), `'light'` (light mode), and `'unset'` (follows system). The default value is determined by the current `@media (prefers-color-scheme: dark)` media query. It sets the class name on the `html` node, so you can switch between dark and light modes by changing its value.

`toggle` is a function to switch between dark and light modes.

`clear` is used to switch the theme back to following the system.

`followMedia` applies the current theme mode according to the `@media (prefers-color-scheme: dark)` media query to `mode`.

You can try it here:
]]]

<preview path="./dark-mode-basic.vue"></preview>
