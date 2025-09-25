[[[zh
# 布局容器 Container
你可以用它来搭建页面基本结构，太棒了，简直像魔法一样！它包括以下几个部分
- Container：外层容器；
- Header：页头区域；
- Footer：页脚区域；
- Main：主体内容区域；
- Aside：侧边栏区域。
]]]

[[[en
# Layout Container
You can use it to build the basic structure of a page—amazing, almost like magic! It includes the following parts:

- Container: The outer container;
- Header: The header area;
- Footer: The footer area;
- Main: The main content area;
- Aside: The sidebar area.
]]]

[[[zh
## 常见页面布局
]]]

[[[en
## Common Page Layouts
]]]


<preview path="./container-basic-1.vue"></preview>
<preview path="./container-basic-2.vue"></preview>
<preview path="./container-basic-3.vue"></preview>
<preview path="./container-basic-4.vue"></preview>

[[[zh
## 布局边框

Header、Footer、Aside 可以用 `bordered` 属性设置展示边框，Aside 组件 `side` 属性用于标记侧边栏位置，从而修改边框展示的位置。
]]]

[[[en
## Layout Borders

Header, Footer, and Aside can display borders using the `bordered` property. The Aside component's `side` property is used to indicate the sidebar position, which changes where the border appears.
]]]

<preview path="./container-bordered.vue"></preview>


[[[zh
## 强调布局
Header、Footer、Aside 可以用 `dark` 属性开启深色模式。
]]]

[[[en
## Emphasized Layout
Header, Footer, and Aside can enable dark mode using the `dark` property.
]]]

<preview path="./container-dark.vue"></preview>

## API

[[[api zh
direction: 子元素排列方向，如果有 Aside 子组件，默认为 `'vertical'`，否则为 `'horizontal'`。
slots.default: 用于传入子布局容器组件。
]]]

[[[api header zh
minHeight: Header 组件最小高度。
bordered: Header 组件是否展示边框。
dark: Header 组件是否为深色模式。
slots.default: 页头区域的内容。
]]]

[[[api footer zh
minHeight: Footer 组件最小高度。
bordered: Footer 组件是否展示边框。
dark: Footer 组件是否为深色模式。
slots.default: 页脚区域的内容。
]]]

[[[api aside zh
width: Aside 组件宽度。
bordered: Aside 组件是否展示边框。
dark: Aside 组件是否为深色模式。
side: 属性用于标记侧边栏位置，从而修改边框展示的位置，为 `'left'` 则边框出现在右侧，为 `'right'` 则出现在左侧。
slots.default: 侧边栏区域的内容。
]]]

[[[api main zh
slots.default: 主体区域的内容。
]]]

[[[api en
direction: The direction in which child elements are arranged. If there is an Aside child component, the default is `'vertical'`, otherwise `'horizontal'`.
slots.default: Used to pass in child layout container components.
]]]

[[[api header en
minHeight: Minimum height of the Header component.
bordered: Whether the Header component displays a border.
dark: Whether the Header component uses dark mode.
slots.default: Content of the header area.
]]]

[[[api footer en
minHeight: Minimum height of the Footer component.
bordered: Whether the Footer component displays a border.
dark: Whether the Footer component uses dark mode.
slots.default: Content of the footer area.
]]]

[[[api aside en
width: Width of the Aside component.
bordered: Whether the Aside component displays a border.
dark: Whether the Aside component uses dark mode.
side: Property used to indicate the sidebar position, which changes where the border appears. If set to `'left'`, the border appears on the right; if set to `'right'`, the border appears on the left.
slots.default: Content of the sidebar area.
]]]

[[[api main en
slots.default: Content of the main area.
]]]