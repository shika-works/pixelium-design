[[[zh
# Flex 栅格 Row

基于 CSS Flex 布局的栅格组件，提供响应式布局，让页面适配不同屏宽更轻松。
]]]
[[[en
# Row

A grid component based on CSS Flex layout, providing responsive layout to make it easier for pages to adapt to different screen widths.
]]]
[[[zh
## 基础使用
Row 组件把内容区域等分为 24 份。
]]]
[[[en
## Basic Usage
The Row component divides the content area into 24 equal parts.
]]]
<preview path="./row-basic.vue"></preview>

[[[zh
## 栅格尺寸
Col 的 `span` 属性设置栅格宽度。`'xs'`、`'sm'`、`'md'`、`'lg'`、`'xl'`、`'xxl'` 分别对应 $[0, 576]$、$(576, 768]$、$(768, 992]$、$(992, 1200]$、$(1200, 1600]$、$(1600, +\infty]$ 的窗口像素宽度。
]]]

[[[en
## Grid Size
The `span` property of Col sets the grid width. `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, and `'xxl'` correspond to the window pixel widths of $[0, 576]$, $(576, 768]$, $(768, 992]$, $(992, 1200]$, $(1200, 1600]$, and $(1600, +\infty)$, respectively.
]]]
<preview path="./row-span.vue"></preview>
[[[zh
## 栅格偏移
Col 的 `offset` 属性设置栅格宽度。同样地，支持响应式。
]]]
[[[en
## Grid Offset
The `offset` property of Col sets the grid offset. It also supports responsiveness.
]]]
<preview path="./row-offset.vue"></preview>
[[[zh
## 栅格间隔
Row 的 `gutter` 属性设置栅格宽度。同样地，支持响应式。
]]]
[[[en
## Grid Gutter
The `gutter` property of Row sets the grid gutter. It also supports responsiveness.
]]]
<preview path="./row-gutter.vue"></preview>
[[[zh
## 横向排列
Row 的 `justify` 属性设置横向排列方式。
]]]
[[[en
## Horizontal Alignment
The `justify` property of Row sets the horizontal alignment.
]]]
<preview path="./row-justify.vue"></preview>
[[[zh
## 纵向排列
Row 的 `align` 属性设置纵向排列方式。
]]]
[[[en
## Vertical Alignment
The `align` property of Row sets the vertical alignment.
]]]
<preview path="./row-align.vue"></preview>

## API
[[[api zh
gutter: 子组件 Col 之间的间隔。
justify: Row 的横向排列方式，基于 CSS `justify-content` 属性。
align: Row 的纵向排列方式，基于 CSS `align-items` 属性。
wrap: 子组件 Col 是否可以换行。
slots.default: 子组件 Col。
]]]
[[[api en
gutter: The interval between child components Col.
justify: The horizontal alignment of Row, based on the CSS `justify-content` property.
align: The vertical alignment of Row, based on the CSS `align-items` property.
wrap: Whether Child components Col can wrap.
slots.default: Child components Col.
]]]
[[[api col zh
offset: Col 左侧偏移。
span: Col 宽度。
slots.default: Col 内容。
]]]
[[[api col en
offset: The offset to the left of Col.
span: The width of Col.
slots.default: The Col's content.
]]]

### ValueWithDeviceWidth
```ts
enum SCREEN_SIZE_TYPE {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	XL = 'xl',
	XXL = 'xxl'
}

type ValueWithDeviceWidth<T> = Record<SCREEN_SIZE_TYPE, T>
```