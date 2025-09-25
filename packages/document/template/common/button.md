[[[zh
# 按钮 Button

一个常见的按钮，是用于触发功能的控件。
]]]
[[[en
# Button

A common button, a control to trigger functions.
]]]

[[[en
## Button Themes
The button offers six themes: `'primary'` (default), `'success'`, `'warning'`, `'danger'`, `'info'`, and `'sakura'`.
]]]
[[[zh
## 按钮主题
按钮有 `'primary'`（默认）、`'success'`、`'warning'`、`'danger'`、`'info'`、`'sakura'` 六种主题。
]]]
<preview path="./button-theme.vue"></preview>

[[[en
## Button Variants
The button is available in four style variants: `'primary'` (default), `'plain'`, `'outline'`, and `'text'`.
]]]
[[[zh
## 按钮变体
按钮有 `'primary'`（默认）、`'plain'`、`'outline'`、`'text'` 四种样式变体。
]]]
<preview path="./button-variant.vue"></preview>

[[[en
## Button Shapes
The button comes in four shapes: `'default'` (default), `'round'`, `'circle'`, and `'square'`.
]]]
[[[zh
## 按钮形状
按钮有 `'default'`（默认）、`'round'`、`'circle'`、`'square'` 四种形状。
]]]
<preview path="./button-shape.vue"></preview>

[[[en
## Button Sizes
The button’s style can be adjusted using the `size` prop, which offers three options: `'default'` (default), `'small'`, and `'large'`.
]]]
[[[zh
## 按钮尺寸
可以设置 `size` 属性改变按钮的样式，有 `'default'`（默认）、`'small'`、`'large'` 三种。
]]]
<preview path="./button-size.vue"></preview>

[[[en
## Disabled Status
`disabled` prop can disables the button.
]]]
[[[zh
## 禁用状态
`disabled` 设置按钮禁用。
]]]
<preview path="./button-disabled.vue"></preview>

[[[en
## Loading Status
`loading` sets whether the button is in a loading state. When true, the button’s native `disabled` attribute becomes `"true"` and the button will not respond to `click` events.
]]]
[[[zh
## 加载状态
`loading` 设置按钮是否处于加载状态，加载状态时按钮的原生属性 `disabled="true"`，不会响应 `click` 事件。
]]]
<preview path="./button-loading.vue"></preview>
[[[zh
## 按钮图标
`icon` 插槽设置按钮图标。
]]]
[[[en
## Button Icon
Set the button icon via the `icon` slot.
]]]
<preview path="./button-icon.vue"></preview>


[[[zh
## 占据整行
设置 `block` 属性可以使得按钮占据整行。
]]]
[[[en
## Full Width
Setting the `block` property makes the button take up the full line.
]]]
<preview path="./button-block.vue"></preview>

[[[en
## Custom Color
Custom primary color: the component will generate a complete color palette based on it, and this palette takes precedence over the preset palettes provided by `theme`. It supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values.
]]]
[[[zh
## 自定义颜色
自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'`字符串和 3、4、6、8位长度的十六位数字表示。 
]]]
<preview path="./button-color.vue"></preview>

[[[zh
## 圆角边框
`borderRadius` 设置按钮圆角，优先级高于 `shape`，与 CSS `border-radius` 行为一致。
> 圆角渲染还有需要优化的地方，整体不影响使用
- 单值或长度为 1 的数组 → 四角同时生效；
- 长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；
- 长度为 3 的数组 → [左上, 右上 & 左下, 右下]；
- 长度为 4 的数组 → 按顺时针顺序依次作用于四角。
]]]
[[[en
## Rounded Corner Border
`borderRadius` sets the button's rounded corners, has a higher priority than `shape`, and behaves consistently with CSS `border-radius`.
> There is still room for optimization in border-radius rendering, but it doesn't affect overall usability.
- A single value or an array of length 1 → applies to all four corners simultaneously;
- An array of length 2 → [top-left & bottom-right, top-right & bottom-left];
- An array of length 3 → [top-left, top-right & bottom-left, bottom-right];
- An array of length 4 → applies to the four corners in a clockwise order.
]]]
<preview path="./button-radius.vue"></preview>

[[[en
## Button Group
Use the ButtonGroup component to group buttons together like this.
]]]
[[[zh
## 按钮组
使用 ButtonGroup 组件可以像这样子把按钮放在一起。
]]]
<preview path="./button-group.vue"></preview>

## API
[[[api zh
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
shape: 按钮形状。
size: 按钮尺寸。
disabled: 是否禁用。
loading: 是否加载状态。
variant: 按钮样式变体。
theme: 按钮主题。
color: 自定义主色，内部基于此生成完整色板，该色板优先级高于 `theme` 提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
block: 是否占据整行。
nativeType: HTML `<button>` 原生 `type` 属性。
autofocus: HTML `<button>` 原生 `autofocus` 属性。
events.click: 点击事件。
slots.default: 按钮内容。
slots.icon: 按钮图标。
]]]
[[[api en
borderRadius: Corner radius, takes precedence over `shape` and behaves like CSS `border-radius`. A single value or an array of length 1 → applies to all four corners simultaneously; an array of length 2 → [top-left & bottom-right, top-right & bottom-left]; an array of length 3 → [top-left, top-right & bottom-left, bottom-right]; an array of length 4 → applies to the four corners in a clockwise order.
shape: Button shape.
size: Button size.
disabled: Whether the button is disabled.
loading: Whether the button is in a loading state.
variant: Button style variant.
theme: Button theme.
color: Custom primary color: the component will generate a complete color palette based on it, and this palette takes precedence over the preset palettes provided by `theme`. It supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3-, 4-, 6-, and 8-digit hexadecimal values.
nativeType: Native HTML `<button>` `type` attribute.
autofocus: Native HTML `<button>` `autofocus` attribute.
block: Whether to take up the full line.
events.click: Click event.
slots.default: The button's content.
slots.icon: The button's icon.
]]]

[[[api button-group zh
borderRadius: 圆角半径，优先级高于 `shape`，将覆盖 Button 子组件的 `borderRadius`，圆角仅作用于两侧 Button 子组件的外侧边框。与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
shape: 按钮形状，将覆盖 Button 子组件的 `shape`，圆角仅作用于两侧 Button 子组件的外侧边框。
size: 按钮尺寸，将覆盖 Button 子组件的 `size`。
disabled: 是否禁用，与 Button 子组件的 `disabled` 取或决定 Button 子组件是否禁用。
variant: 按钮样式变体，将覆盖 Button 子组件的 `variant`。
slots.default: 子按钮。
]]]
[[[api button-group en
borderRadius: Corner radius, takes precedence over `shape`, overrides the borderRadius of Button child components; rounding only affects the outer borders on both sides of Button child components; behaves like CSS `border-radius`. A single value or an array of length 1 → applies to all four corners simultaneously; an array of length 2 → [top-left & bottom-right, top-right & bottom-left]; an array of length 3 → [top-left, top-right & bottom-left, bottom-right]; an array of length 4 → applies to the four corners in a clockwise order.
shape: Button shape, overrides the `shape` of the Button child components, rounding only affects the outer borders on both sides of the Button child components.
size: Button size, overrides the `size` of the Button child components.
disabled: Whether to disable; the final disabled state of the Button child components is determined by OR-ing this prop with each child’s own `disabled`. 
loading: Whether the button is in a loading state.
variant: Button style variant, overrides the `variant` of the Button child components.
slots.default: The sub-buttons.
]]]

### NumberOrPercentage
```ts
export type NumberOrPercentage = number | `${number}%`
```