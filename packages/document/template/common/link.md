[[[zh
# 链接 Link

用于展示超链接的组件。
]]]
[[[en
# Link

A component used to display hyperlinks.
]]]

[[[en
## Basic Usage
Usually, we use it just like an `<a>` tag.
]]]
[[[zh
## 基础使用
通常，我们像 `<a>` 标签一样使用它。
]]]
<preview path="./link-base.vue"></preview>

[[[en
## Link Themes
The link offers six themes: `'primary'` (default), `'success'`, `'warning'`, `'danger'`, `'info'`, and `'sakura'`.
]]]
[[[zh
## 链接主题
链接有 `'primary'`（默认）、`'success'`、`'warning'`、`'danger'`、`'info'`、`'sakura'` 六种主题。
]]]
<preview path="./link-theme.vue"></preview>

[[[en
## Disabled Status
`disabled` indicates that the link is disabled; the browser’s default click-to-navigate behavior will not be triggered.
]]]
[[[zh
## 禁用状态
`disabled` 设置链接禁用，浏览器默认点击事件引起的跳转不会触发。
]]]
<preview path="./link-disabled.vue"></preview>

[[[en
## Loading Status
`loading` indicates whether the link is in a loading state; while loading, the browser’s default click-to-navigate behavior will not be triggered.
]]]
[[[zh
## 加载状态
`loading` 设置链接是否处于加载状态，加载状态时，浏览器默认点击事件引起的跳转不会触发。
]]]
<preview path="./link-loading.vue"></preview>
[[[zh
## 链接图标
`icon` 插槽设置链接图标。
]]]
<preview path="./link-icon.vue"></preview>

[[[en
## Custom Color
Custom primary color: similar to the button component, the component will generate a complete color palette based on it, and this palette takes precedence over the preset palettes provided by `theme`. It supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values.
]]]
[[[zh
## 自定义颜色
与按钮组件类似，自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'`字符串和 3、4、6、8位长度的十六位数字表示。 
]]]
<preview path="./link-color.vue"></preview>


## API
[[[api zh
disabled: 是否禁用。
loading: 是否加载状态。
theme: 链接主题。
color: 自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
href: HTML `<a>` 原生 `href` 属性。
target: HTML `<a>` 原生 `target` 属性。
slots.icon: 链接图标。
slots.default: 链接内容。
]]]
[[[api en
disabled: Whether the link is disabled.
loading: Whether the link is in a loading state.
theme: Link theme.
color: Custom primary color: the component will generate a complete color palette based on it, and this palette takes precedence over the preset palettes provided by `theme`. It supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values.
href: Native HTML `<a>` `href` attribute.
target: Native HTML `<a>` `target` attribute.
slots.icon: The link's icon.
slots.default: The link's content.
]]]
