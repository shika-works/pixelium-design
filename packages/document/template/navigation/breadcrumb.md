[[[zh
# 面包屑 Breadcrumb

一点也联想不到面包屑和这个 UI 组件有什么关系...
]]]
[[[en
# Breadcrumb

It's hard to associate "breadcrumb" with this UI component at all...
]]]

[[[zh
## 基础使用

使用 Breadcrumb 和 BreadcrumbItem 搭建面包屑导航条。

默认情况下最后一项会作为普通文本渲染，可通过 Breadcrumb 的 `renderLastText` 属性修改。

BreadcrumbItem 根据 `href` 或 `route` 属性把选项渲染 `<a>` 标签或者 Vue Router 的 RouterLink 组件。

::: warning
`href` 和 `route` 将直接渲染到 `<a>` 标签中，如果传递类似 `javascript:alert(1)` 这样的值或恶意 URL，可能会导致 XSS 或开放重定向漏洞。
:::
]]]
[[[en
## Basic Usage

Use `Breadcrumb` and `BreadcrumbItem` to build a breadcrumb navigation bar.

By default, the last item is rendered as plain text. This can be changed via the `renderLastText` property of `Breadcrumb`.

`BreadcrumbItem` renders an option as an `<a>` tag or a Vue Router `RouterLink` component based on its `href` or `route` property.

::: warning
`href` and `route` are directly rendered into the `<a>` tag. Passing values like `javascript:alert(1)` or malicious URLs may lead to XSS or open redirect vulnerabilities.
:::
]]]

<preview path="./breadcrumb-basic.vue"></preview>

[[[zh
## 禁用和不可点击

使用 BreadcrumbItem 的 `disabled` 设置禁用，`clickable` 设置子项是否可点击。
]]]
[[[en
## Disabled and Non-clickable

Use the `disabled` property of `BreadcrumbItem` to disable an item, and `clickable` to control whether a child item is clickable.
]]]

<preview path="./breadcrumb-disabled.vue"></preview>

[[[zh
## 选项属性

使用 `options` 属性创建面包屑导航条。选项的字符串值和 `index` 字段作为唯一标识，推荐确保它们的唯一性。
]]]
[[[en
## Options Property

Use the `options` property to create a breadcrumb navigation bar. The string value and `index` field of an option are used as unique identifiers. It is recommended to ensure their uniqueness.
]]]

<preview path="./breadcrumb-options.vue"></preview>

[[[zh
## 分隔符

通过 Breadcrumb 的 `splitter` 属性或者 `splitter` 插槽设置分隔符。
]]]
[[[en
## Separator

Set the separator via the `splitter` property or the `splitter` slot of `Breadcrumb`.
]]]

<preview path="./breadcrumb-splitter.vue"></preview>

## API

[[[api zh
options: 面包屑的子项。
splitter: 子项之间的分隔符。
renderLastText: 是否把最后一项渲染为纯文本。

events.select: 选择面包屑子项时触发的回调。

slots.default: 面包屑子项的插槽。
slots.splitter: 分隔符的插槽。
]]]
[[[api en
options: breadcrumb items.
splitter: separator between items.
renderLastText: whether to render the last item as plain text.

events.select: callback triggered when a breadcrumb item is selected.

slots.default: slot for breadcrumb items.
slots.splitter: slot for the separator.
]]]

[[[api breadcrumb-item zh
label: 文本标签。
index: 唯一标识。
disabled: 是否禁用。
clickable: 是否可点击。
href: `<a>` 标签的 `href` 属性，传入 `href` 参数时，将以 `<a>` 标签渲染文本标签。
route: Vue Router 的 RouterLink 的 `to` 参数，传入后，将以 RouterLink 作为 `<a>` 渲染文本标签。如果使用该属性，请确保在全局的 Vue App 中注册 Vue Router。
target: `<a>` 标签的 `target` 属性。

slots.default: 文本标签。
slots.icon: 图标。
]]]
[[[api breadcrumb-item en
label: Text label.
index: Unique identifier.
disabled: Whether the item is disabled.
clickable: Whether the item is clickable.
href: The `href` attribute for the `<a>` tag. When provided, the text label will be rendered as an `<a>` element.
route: The `to` parameter for Vue Router's RouterLink. When provided, the text label will be rendered as a RouterLink `<a>` element. If using this property, ensure Vue Router is registered globally in your Vue App.
target: The `target` attribute for the `<a>` tag.

slots.default: Slot for the text label.
slots.icon: Slot for the icon.
]]]

### BreadcrumbOption

```ts
export interface BreadcrumbOption extends NavigationOption {
	disabled?: boolean
	clickable?: boolean
	href?: string
	route?: string | object
	target?: string
}

export interface NavigationOption {
	index: string | number | symbol
	label?: string
}
```