[[[zh
# 虚拟列表 VirtualList
用来展示很长很长很长的列表，只有看到的部分才会被实际渲染。组件在十万数量级的数据下可流畅渲染（更多也可以，但是可能被浏览器 DOM 的最大高度截断内容）。

> 虚拟列表采用分层次分块策略维护前缀和。这种数据结构能将计算高度的时间复杂度控制在 $O(\sqrt{n})$，最终在大数据量场景下实现流畅滚动。
]]]

[[[en
# Virtual List
Used to display extremely long lists, where only the visible parts are actually rendered. The component can render smoothly with data on the order of 100,000 items (more data is also possible, but the content may be truncated by the maximum height limit of the browser's DOM).

> The virtual list adopts a hierarchical block partitioning strategy to maintain prefix sums. This data structure can control the time complexity of height calculation to $O(\sqrt{n})$, ultimately achieving smooth scrolling in large data volume scenarios.

]]]

[[[zh
::: warning
浏览器对单个 DOM 的最大可滚动 / 可绘制高度存在实现差异与上限，可能导致内容在极端情况下被裁剪或无法正常滚动。例如：在 Edge 版本 141.0.3537.71 中，页面可展示的像素高度在 2.7 千万像素左右，超过此范围的内容会被截断或不可见。

在使用百万级或更大数据量时，请注意总高度（$itemsCount \times averageItemHeight$）是否会接近或超过浏览器的限制。
:::
]]]

[[[en
::: warning
Browsers impose implementation-specific limits on the maximum scrollable / renderable height of DOM, which may cause content truncation or inaccessible regions in extreme cases. For example, in Edge 141.0.3537.71 the maximum visible pixel height is around 27 million pixels; content beyond that may be clipped or unreachable.

When using millions (or more) of items, watch the total height ($itemsCount \times averageItemHeight$).
:::
]]]



[[[zh
## 基础使用
虚拟列表默认子元素动态高度。`estimatedHeight` 设置初始化时元素的预估高度，通常应该比大部分子元素高度小些。
]]]
[[[en
## Basic Usage
The virtual list has dynamic heights for child elements by default. `estimatedHeight` sets the estimated height of elements during initialization, and it should usually be smaller than the height of most child elements.
]]]
<preview path="./virtual-list-basic.vue"></preview>

[[[zh
## 固定高度
虚拟列表的子元素高度固定，或者可以准确获得子元素平均高度时，可以设置 `fixedHeight` 和 `estimatedHeight`，节省性能。
]]]
[[[en
## Fixed Height
When the child elements of the virtual list have fixed heights, or the average height of child elements can be accurately obtained, you can set `fixedHeight` and `estimatedHeight` to save performance.
]]]
<preview path="./virtual-list-fix.vue"></preview>


## API

[[[api zh
list: 用于渲染的数据数组。
fixedHeight: 是否为定高模式。
estimatedHeight: 预估项高（用于初始化和测量前的估算），单位 px。
buffer: 缓冲项数，控制视窗前后多渲染的项数以避免快速滚动时闪烁。
]]]

[[[api en
list: The data array to render.
fixedHeight: Whether to use fixed-height mode.
estimatedHeight: Estimated item height in px (used for initialization and before measurements complete).
buffer: Number of buffer items to render before/after the visible window to reduce flicker during fast scrolls.
]]]

