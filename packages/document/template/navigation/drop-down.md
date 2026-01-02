[[[zh
# 下拉菜单 DropDown

通过下拉框展示的小型菜单。
]]]

[[[en
# DropDown
A compact menu displayed via a dropdown.
]]]

[[[zh
## 基础使用

通过 `options` 属性设置菜单内容。选项中字符串值或者对象值的 `index` 字段会作为选项唯一标识，建议确保它们没有重复。

通过 `select` 事件获取触发的选项。

`options` 根据子元素的 `href` 或 `route` 字段决定把选项渲染 `<a>` 标签或者 Vue Router 的 RouterLink 组件。

::: warning
`href` 和 `route` 将直接渲染到 `<a>` 标签中，如果传递类似 `javascript:alert(1)` 这样的值或恶意 URL，可能会导致 XSS 或开放重定向漏洞。
:::

]]]
[[[en
## Basic Usage

Set menu content using the `options` prop. When an option is a string or an object, its `index` field will be used as the option's unique identifier — make sure they are not duplicated.

Use the `select` event to get the triggered option.

`options` determines whether to render the options as `<a>` tags or Vue Router RouterLink components based on the `href` or `route` field of the child elements.

::: warning
The `href` and `route` will be directly rendered into the `<a>` tag. If values such as `javascript:alert(1)` or malicious URLs are passed, this may lead to XSS or open redirect vulnerabilities.
:::
]]]

<preview path="./drop-down-basic.vue"></preview>

[[[zh
## 弹出位置

DropDown 弹出框提供 9 种展示位置。

由 `placement` 属性决定弹出的位置。该属性值格式为：[方向]-[对齐位置]，分别是`'top'`、`'right'`、`'bottom'`、`'left'`、`'top-start'`、`'top-end'`、`'right-start'`、`'right-end'`、`'bottom-start'`、`'bottom-end'`、`'left-start'`、`'left-end'`，有四个展示方向，和三种对齐方式，默认的 `placement` 为 `top`。
]]]
[[[en
## Placement

The DropDown popup supports multiple placements.

The `placement` prop determines where the popup appears. The value format is [direction]-[alignment], such as `'top'`, `'right'`, `'bottom'`, `'left'`, `'top-start'`, `'top-end'`, `'right-start'`, `'right-end'`, `'bottom-start'`, `'bottom-end'`, `'left-start'`, `'left-end'`. There are four directions and three alignment variations. Default `placement` is `top`.
]]]
<preview path="./drop-down-place.vue"></preview>

[[[zh
## 菜单分组

选项是可以分组的。
]]]
[[[en
## Grouped Menus

Options can be grouped.
]]]
<preview path="./drop-down-group.vue"></preview>

[[[zh
## 分割按钮

结合 ButtonGroup 和 Button 组件，这里可以使得图标按钮触发弹出。
]]]
[[[en
## Split Button

Combine ButtonGroup and Button components so an icon button can trigger the popup.
]]]
<preview path="./drop-down-button.vue"></preview>

[[[zh
## 受控模式

传入 `visible` 属性进入受控模式；不传或传 `undefined` 则为非受控模式，可使用 `defaultVisible` 指定初始显示。组件会触发 `update:visible` 事件以配合 `v-model`。 
]]]
[[[en
## Controlled Mode

Passing `visible` switches the component to controlled mode. If omitted or set to `undefined`, the component is uncontrolled and `defaultVisible` can be used to set the initial state. The component emits `update:visible` to support `v-model`.
]]]

<preview path="./drop-down-control.vue"></preview>

[[[zh
## 禁用状态

传入 `disabled` 设置禁用状态，此时触发方式将失效，弹出层不会被打开。
]]]
[[[en
## Disabled State

Set `disabled` to disable the component. Trigger actions will be ignored and the popup will not open.
]]]

<preview path="./drop-down-disabled.vue"></preview>

## API

[[[api zh
options: 下拉菜单内容。
visible: 是否显示（受控模式，支持 `v-model`）。
defaultVisible: 非受控模式下默认的显示状态。
placement: 弹出位置。
trigger: 触发方式。
offset: 弹出偏移距离（px）。
variant: 组件样式变体。
arrow: 是否展示箭头。
disabled: 是否禁用。
zIndex: 弹出层 `z-index`。
root: 挂载元素。
destroyOnHide: 隐藏时是否销毁内容。
popoverProps: 透传给内部 Popover 的属性。
dividerProps: 透传 DOM 属性到分割线元素。

events.update:visible: 更新 `visible` 的回调。
events.select: 选择菜单时触发的回调。
events.close: 弹出层关闭时触发。
events.open: 弹出层打开时触发。

slots.default: 触发元素插槽。
slots.option: 选项自定义渲染。
slots.group-labe: 分组标题自定义渲染。

dropDownExpose.open: 打开确认弹出框。
dropDownExpose.close: 关闭确认弹出框。
]]]

[[[api en
options: Dropdown menu contents.  
visible: Whether it is shown (controlled mode, supports `v-model`).  
defaultVisible: Default visibility in uncontrolled mode.  
placement: Popup placement.  
trigger: Trigger action.  
offset: Popup offset in pixels.  
variant: Component style variant.  
arrow: Whether to show an arrow.  
disabled: Whether the component is disabled.  
zIndex: `z-index` for the popup.  
root: Mount element.  
destroyOnHide: Whether to destroy content when hidden.  
popoverProps: Props forwarded to the internal Popover.  
dividerProps: DOM attributes forwarded to the divider element.

events.update:visible: Callback for updating `visible`.  
events.select: Fired when a menu option is selected.  
events.close: Fired when the popup closes.  
events.open: Fired when the popup opens.

slots.default: Trigger element slot.  
slots.option: Custom rendering for an option.  
slots.group-label: Custom rendering for the group header.

dropDownExpose.open: Opens the popup.  
dropDownExpose.close: Closes the popup.
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

### DropDownListOption, DropDownListGroupOption

```ts
export interface DropDownListOption extends NavigationOption {
	divider?: boolean
	disabled?: boolean
	href?: string
	route?: string | object
	target?: string
}

export interface DropDownListGroupOption extends NavigationOption {
	children: (DropDownListOption | string)[]
	type: 'group'
}

export interface NavigationOption {
	index: string | number | symbol
	label?: string
}

```