[[[zh
# Grid 栅格 Grid

基于 CSS Grid 布局的栅格组件，提供响应式布局，让页面适配不同屏宽更轻松。功能和 Flex 组件类似，如果你喜欢 Grid 布局，可以试试这个组件。
]]]

[[[en
# Grid

A grid component based on CSS Grid layout, providing responsive layouts to make pages adapt to different screen widths more easily. Its functionality is similar to the Flex component. If you prefer Grid layouts, you can try this component.
]]]

[[[zh
## 基础使用
Grid 组件默认把内容区域等分为 24 份，可以通过 `column` 属性进行调整。`column` 属性支持响应式。和 Flex 组件一样，`'xs'`、`'sm'`、`'md'`、`'lg'`、`'xl'`、`'xxl'` 分别对应 $[0, 576]$、$(576, 768]$、$(768, 992]$、$(992, 1200]$、$(1200, 1600]$、$(1600, +\infty]$ 的窗口像素宽度。
]]]

[[[en
## Basic Usage
The Grid component divides the content area into 24 columns by default, which can be adjusted using the `column` property. The `column` property supports responsiveness. Like the Flex component, `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, and `'xxl'` correspond to window pixel widths of $[0, 576]$, $(576, 768]$, $(768, 992]$, $(992, 1200]$, $(1200, 1600]$, and $(1600, +\infty)$ respectively.
]]]


<preview path="./grid-basic.vue"></preview>
[[[zh
## 栅格尺寸
GridItem 的 `span` 属性设置栅格宽度。
]]]

[[[en
## Grid Size
The `span` property of GridItem sets the grid width.
]]]

<preview path="./grid-span.vue"></preview>
[[[zh
## 栅格偏移
GridItem 的 `offset` 属性设置栅格宽度。同样地，支持响应式。
]]]

[[[en
## Grid Offset
The `offset` property of GridItem sets the grid offset. It also supports responsiveness.
]]]

<preview path="./grid-offset.vue"></preview>
[[[zh
## 栅格间隔
Grid 的 `gutter` 属性设置栅格宽度。同样地，支持响应式。
]]]

[[[en
## Grid Gutter
The `gutter` property of Grid sets the spacing between GridItems. It also supports responsiveness.
]]]

<preview path="./grid-gutter.vue"></preview>

## API
[[[api zh
column: Grid 内容区域等分列数。
gutter: 子组件 GridItem 之间的间隔。
slots.default: 子组件 GridItem。
]]]
[[[api grid-item zh
offset: GridItem 左侧偏移。
span: GridItem 宽度， 默认为 Grid 的 `column` 属性。
slots.default: GridItem 内容。
]]]

[[[api en
column: Number of columns in the Grid content area.
gutter: Spacing between GridItem components.
slots.default: GridItem components.
]]]
[[[api grid-item en
offset: Left offset of GridItem.
span: The width of GridItem defaults to the `column` attribute of Grid.
slots.default: Content of GridItem.
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