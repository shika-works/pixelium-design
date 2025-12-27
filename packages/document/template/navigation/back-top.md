[[[zh
# 回到顶部 BackTop

回到梦开始的地方。
]]]
[[[en
# BackTop

Back to where it all began.
]]]

[[[en
## Basic Usage
The component can be placed anywhere within the application and, by default, listens to the scroll events of the `window`.

The `visibilityHeight` parameter sets the distance from the top of the scroll container, with a default value of 200px. The BackTop component only becomes visible once this distance is reached.

The `right` and `bottom` properties set the distance of the component's content from the right and bottom edges of the viewport, respectively.
]]]
[[[zh
## 基本用法
将组件放在应用中任意位置，默认监听 `window` 的滚动。

`visibilityHeight` 设置距离滚动容器顶部的距离，默认 200px，
到达此距离后，BackTop 组件才会展示。

`right` 和 `bottom` 属性设置组件内容距离视口右侧和底部的距离。
]]]

<preview path="./back-top-basic.vue"></preview>

[[[en
## Custom Button & Icon
Customize the inner button by passing `buttonProps` or provide your own `default` slot to replace the whole content. Use the `icon` slot to customize the icon.
]]]
[[[zh
## 自定义触发元素
通过 `buttonProps` 配置内置按钮，使用 `icon` 插槽自定义图标。你甚至可以使用 `trigger` 插槽替换全部内容
]]]

<preview path="./back-top-custom-button.vue"></preview>

[[[en
## Custom Root Container
By setting `root` to a selector or an `HTMLElement`, you can make the component listen to a specific scrollable container instead of `window`.

> 💡 **Tip**: When `root` is a CSS selector string, it will be resolved with `document.querySelector`. If no element matches, the component falls back to `window`.
]]]
[[[zh
## 自定义滚动容器
通过将 `root` 设置为选择器或 `HTMLElement`，组件会监听指定的滚动容器而非 `window`。

> 💡 **Tip**：当 `root` 为 CSS 选择器字符串时，会通过 `document.querySelector` 进行解析。如果未匹配到任何元素，组件将回退到 `window`。
]]]

<preview path="./back-top-root.vue"></preview>

## API
[[[api zh
root: 滚动容器，可为 `HTMLElement`、CSS 选择器字符串或 `window`；默认监听 `window`。
visibilityHeight: 触发显示按钮的滚动高度阈值，单位 px。
right: 与视窗右侧的偏移（px）。
bottom: 与视窗底部的偏移（px）。
zIndex: 组件样式的 `z-index`。
buttonProps: 传递给内部 Button 的属性（没有使用 `trigger` 插槽时生效）。
slots.icon: 自定义内部图标（没有使用 `trigger` 插槽时生效）。
slots.trigger: 自定义整个回到顶部按钮的内容。
]]]

[[[api en
root: The scroll container, which can be an `HTMLElement`, CSS selector string, or `window`; defaults to listening to `window`.
visibilityHeight: The scroll height threshold (px) at which the button becomes visible.
right: Offset from the right side of the viewport (px).
bottom: Offset from the bottom of the viewport (px).
zIndex: The `z-index` value for the component's style.
buttonProps: Props passed to the internal Button component (effective when the `trigger` slot is not used).
slots.icon: Custom internal icon (effective when the `trigger` slot is not used).
slots.trigger: Custom content for the entire back-to-top button.
]]]

### RestAttrs, EmitEvent

```ts
import type { StyleValue } from 'vue'

export type EmitEvent<T extends Record<string, any>> = {
	[K in keyof T as `on${Capitalize<K & string>}`]?: (...args: T[K]) => void
}

export type VueClassValue = string | Record<string, any> | VueClassValue[]

export type RestAttrs = {
	style?: StyleValue | null
	class?: VueClassValue | null
	[x: string]: any
}
```