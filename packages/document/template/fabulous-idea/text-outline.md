[[[zh
# 文本描边 TextOutline

一个用于给文字添加描边的轻量组件，常用于强调标题或装饰性文字效果。
]]]
[[[en
# TextOutline

A lightweight component to add an outline (stroke) to text — useful for emphasized or decorative typography.
]]]

[[[en
## Basic Usage
Provide text as default slot. Use `color` to set the outline color and `outlineWidth` to control the stroke thickness.
]]]
[[[zh
## 基本用法
将文字放入默认插槽。使用 `color` 设置文字描边颜色，使用 `outlineWidth` 控制描边粗细。
]]]
<preview path="./text-outline-basic.vue"></preview>

[[[en
## Color Fill
`color` accepts any CSS color string (hex, rgb/rgba, named colors, gradients via CSS var or shorthand background values) and will be used as the text outline fill.
]]]
[[[zh
## 填充颜色
`color` 接受任意 CSS 颜色字符串（十六进制、rgb / rgba、颜色名，或通过 CSS 变量/背景字符串实现渐变等），作为文字的描边填充。
]]]
<preview path="./text-outline-color.vue"></preview>

[[[en
## Outline Width
`outlineWidth` controls the stroke width. When set as a number it is treated as pixels; strings are used verbatim (e.g. `'0.1em'`, `'2px'`).
]]]
[[[zh
## 描边宽度
`outlineWidth` 控制描边宽度。若传入数字，则转换为像素单位；传入字符串则按字面使用（例如 `'0.1em'`、`'2px'`）。
]]]
<preview path="./text-outline-width.vue"></preview>


## API
[[[api zh
color: 填充颜色，接受任意合法 CSS 颜色或背景字符串（例如 `'#fff'`、`'rgba(255,0,0,0.8)'`、`'linear-gradient(...)'` 等），默认 `'#fff'`。
outlineWidth: 描边宽度，支持 number 或 字符串。number → 视为像素（例如 `1` → `1px`），字符串按字面使用（例如 `'0.1em'`、`'2px'`）。默认 `1`。
autoPadding: 自动根据描边宽度加上左右 `padding` 以防止描边被裁剪。

slots.default: 文本内容插槽。
]]]
[[[api en
color: Fill color — accepts any valid CSS color or background string (e.g. `'#fff'`, `'rgba(255,0,0,0.8)'`, `'linear-gradient(...)'`). Default `'#fff'`.
outlineWidth: Stroke width — accepts number or string. Number is treated as pixels (e.g. `1` → `1px`); string is used verbatim (e.g. `'0.1em'`, `'2px'`). Default `1`.
autoPadding: Automatically adds left and right `padding` based on outline width to prevent the outline from being clipped.

slots.default: Default slot for the text content.
]]]
