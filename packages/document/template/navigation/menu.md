[[[zh
# 菜单 Menu

要吃东西。
]]]
[[[en
# Menu

Must feed.
]]]

[[[en
## Basic Usage
Organize the menu structure through Menu, MenuItem, MenuGroup, and Submenu components.
MenuItem accepts `href` or `route` parameters to render either an `<a>` tag or Vue Router's RouterLink component.
]]]
[[[zh
## 基本用法
通过 Menu、MenuItem、MenuGroup、Submenu 组织菜单结构。MenuItem 接收 `href` 或 `route` 参数渲染 `<a>` 标签或者 Vue Router 的 RouterLink 组件。
]]]

<preview path="./menu-basic.vue"></preview>

[[[en
## Horizontal Menu
When `direction` is set to `"horizontal"`, a horizontal menu is displayed. When `ellipsis` is `true`, overflowing menu items are automatically collapsed into a "..." submenu.
]]]
[[[zh
## 横向菜单
设置 `direction` 为 `"horizontal"` 时，展示横向菜单，`ellipsis` 为 `true` 时溢出的菜单项会自动收纳到 ... 子菜单中。
]]]

<preview path="./menu-horizontal-ellipsis.vue"></preview>

[[[en
## Collapsed Sidebar Mode
Use `collapsed` for sidebars to show compact UI.
]]]
[[[zh
## 折叠侧栏

侧边栏场景可使用 `collapsed` 属性以缩略展示菜单。
]]]

<preview path="./menu-collapsed.vue"></preview>

[[[en
## Groups & Submenus
Combine MenuGroup and Submenu for complex nested menus.
]]]
[[[zh
## 分组与子菜单
结合 MenuGroup 与 Submenu 构建多层菜单结构。
]]]

<preview path="./menu-group-submenu.vue"></preview>

[[[en
## Emphasized Menu
Set the Menu `dark` attribute to `true` to enable high-contrast dark mode.
]]]
[[[zh
## 强调菜单
设置 Menu `dark` 属性为 `true` 开启高对比度的深色模式。
]]]

<preview path="./menu-dark.vue"></preview>

[[[zh
## 选项属性

Menu 的 `options` 属性用于直接传入选项，可以用于简单菜单的快速创建。
]]]
[[[en
## Options Property

The `options` property of Menu is used to directly pass in options, enabling quick creation of simple menu.
]]]
<preview path="./menu-options.vue"></preview>

[[[en
## Controlled Menu

Control the selected menu and expanded menus by passing `active` and `expanded`. Supports `v-model`. If not passed or set to `undefined`, it operates in uncontrolled mode. In this case, default values can be set using `defaultActive` and `defaultExpanded`.
]]]
[[[zh
## 受控模式

通过传入 `active` 和 `expanded` 控制选中菜单和展开菜单，支持 `v-model`。不传或为 `undefined` 则为非受控模式，此时可以通过 `defaultActive` 和 `defaultExpanded` 设置默认值。
]]]

<preview path="./menu-controlled.vue"></preview>

## API
[[[api zh
direction: 菜单的方向
active: 激活的菜单项，支持 `v-model` 受控模式。
defaultActive: 激活的菜单项的默认值，非受控模式。
expanded: 展开的子菜单，支持 `v-model` 受控模式。
defaultExpanded: 展开的子菜单默认值，非受控模式。
collapsed: 垂直菜单是否折叠。
submenuMode: 子菜单展示方式，若子菜单 `mode` 未设置将采用该值。
submenuTrigger: 子菜单浮窗的触发方式，若子菜单 `trigger` 未设置将采用该值。
indent: 每级菜单的缩进。
ellipsis: 横向菜单超出部分是否收纳到 ... 子菜单中。
dark: 菜单是否为深色模式。
options: 用于创建菜单子组件的选项，当未传入 `default` 插槽时生效。

events.update:active: 更新 `active` 的回调。
events.update:expanded: 更新 `expanded` 的回调。
events.select: 选中菜单的回调。
events.expandChange: 展开的子菜单变化的回调。
events.expand: 展开一个子菜单时触发的回调。
events.fold: 折叠一个子菜单时触发的回调。

slots.default: 构成菜单的子组件们。
]]]
[[[api en
direction: Orientation of the menu.
active: Activated menu item. Supports controlled mode via `v-model`.
defaultActive: Default value for the activated menu item in uncontrolled mode.
expanded: Expanded submenus. Supports controlled mode via `v-model`.
defaultExpanded: Default value for expanded submenus in uncontrolled mode.
collapsed: Whether the vertical menu is collapsed.
submenuMode: Display mode for submenus. This value will be used if the submenu’s own `mode` is not set.
submenuTrigger: Trigger method for submenu popups. This value will be used if the submenu’s own `trigger` is not set.
indent: Indentation for each menu level.
ellipsis: Whether overflowing items in a horizontal menu are collapsed into a "..." submenu.
dark: Whether the menu uses dark mode.
options: Options for creating menu sub-components, effective when the `default` slot is not passed.

events.update:active: Callback when `active` updates.
events.update:expanded: Callback when `expanded` updates.
events.select: Callback when a menu item is selected.
events.expandChange: Callback when expanded submenus change.
events.expand: Callback triggered when a submenu expands.
events.fold: Callback triggered when a submenu folds.

slots.default: Child components that make up the menu.
]]]
[[[api menu-item zh
label: 文本标签。
index: 唯一标识，MenuItem 和 Submenu 组件的 `index` 属性不可重复。
disabled: 是否禁用。
route: Vue Router 的 RouterLink 的 `to` 参数，传入后，将以 RouterLink 作为 `<a>` 渲染文本标签。如果使用该属性，请确保在全局的 Vue App 中注册 Vue Router。
href: `<a>` 标签的 `href` 属性，没有传入 `route` 参数时，将以 `<a>` 标签渲染文本标签。
target: `<a>` 标签的 `target` 属性。

slots.default: 文本标签。
slots.icon: 图标。
]]]
[[[api menu-item en
label: Text label.
index: Unique identifier. The `index` property of MenuItem and Submenu components must not be duplicated.
disabled: Whether it is disabled.

slots.default: Text label.
slots.icon: Icon.
]]]
[[[api submenu zh
label: 文本标签。
index: 唯一标识，MenuItem 和 Submenu 组件的 `index` 属性不可重复。
disabled: 是否禁用。
mode: 子菜单展示方式，`inline` 为内联的下拉子菜单，`popover` 为弹出框展示的浮窗子菜单。值为 `inline` 只在垂直菜单中和非浮窗子菜单中生效。
trigger: 子菜单的浮窗触发方式。
popoverProps: 内部 Popover 的属性。

slots.default: 构成菜单的子组件们。
slots.icon: 图标。
slots.label: 文本标签。
]]]
[[[api submenu en
label: Text label.
index: Unique identifier. The `index` property of MenuItem and Submenu components must not be duplicated.
disabled: Whether it is disabled.
mode: Display mode for the submenu. `inline` renders it as an inline dropdown, `popover` renders it in a popup window. The `inline` value only takes effect within vertical menus and non-popup submenus.
trigger: Trigger method for the submenu popup.
popoverProps: Properties for the internal Popover component.

slots.default: Child components that make up the menu.
slots.icon: Icon.
slots.label: Text label.
]]]
[[[api menu-group zh
label: 文本标签。

slots.default: 构成菜单的子组件们。
slots.label: 文本标签。
]]]
[[[api menu-group en
label: Text label.

slots.default: Child components that make up the menu.
slots.label: Text label.
]]]

### MenuOption, MenuGroupOption, SubmenuOption

```ts
export interface MenuOption extends NavigationOption {
	disabled?: boolean
	href?: string
	route?: string | object
	icon?: () => ValidVNodeContent
}

export interface MenuGroupOption extends NavigationOption {
	children: (MenuOption | MenuGroupOption | SubmenuOption)[]
	type: 'group'
}

export interface SubmenuOption extends NavigationOption {
	children: (MenuOption | MenuGroupOption | SubmenuOption)[]
	disabled?: boolean
	type: 'submenu'
	icon?: () => ValidVNodeContent
}

export interface NavigationOption {
	index: string | number | symbol
	label?: string
}
export type ValidVNodeContent = (...args: any[]) => VNode | JSX.Element
```

### EmitEvent

```ts
export type EmitEvent<T extends Record<string, any>> = {
	[K in keyof T as `on${Capitalize<K & string>}`]?: (...args: T[K]) => void
}
```