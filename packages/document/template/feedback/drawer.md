[[[zh
# 抽屉 Drawer

就像是从窗口边缘弹出的 Dialog。

当有大量内容需要用弹窗展示时，使用这个组件或许会比 Dialog 拥有更好的视觉效果。Drawer 组件采用了和 Dialog 相似的 API 设计。
]]]
[[[en
# Drawer

A dialog that pops out from the edge of the window.

When you need to display a large amount of content in a popup, this component may provide a better visual effect than Dialog. The Drawer component uses an API design similar to Dialog.
]]]

[[[zh
## 基础使用

`visible` 控制 Drawer 的展示和隐藏，传入 `visible` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultVisible` 属性作为默认值。
]]]
[[[en
## Basic Usage

`visible` controls whether the Drawer is shown or hidden. Passing `visible` puts it in controlled mode. If you don't pass it or pass `undefined`, it will be in uncontrolled mode; you can then use the `defaultVisible` prop as the default value.
]]]
<preview path="./drawer-base.vue"></preview>

[[[zh
## 底部内容

`show-footer` 控制是否展示底部区域，默认 `false`。开启 `show-footer` 后，可以通过 `footer` 插槽传入底部区域内容。
]]]
[[[en
## Footer Content

`show-footer` controls whether the bottom area is displayed, defaulting to `false`. When `show-footer` is enabled, you can use the `footer` slot to provide footer content.
]]]
<preview path="./drawer-footer.vue"></preview>


[[[zh
## 弹出位置

`placement` 属性设置弹出位置。
]]]
[[[en
## Placement

The `placement` prop sets where the drawer appears from.
]]]
<preview path="./drawer-placement.vue"></preview>


[[[zh
## 样式设置

就像栗子🌰所展示的那样，你可以直接传入 `class` 和 `style` 等 attrs 穿透到抽屉容器元素上。
]]]
[[[en
## Styling

As shown in the example, you can directly pass attrs like `class` and `style` which will be forwarded to the drawer container element.
]]]
<preview path="./drawer-style.vue"></preview>

[[[zh
## 函数式

如果你完整注册了组件库，你可以以以下方式函数式地使用 Drawer：
- `window.$drawer`；
- Vue 组件内： `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.drawer`；
- 从 `@pixelium/web-vue` 中导入。

按需引入时，也可以从 `@pixelium/web-vue/es` 中导入 `Drawer` 使用。
]]]
[[[en
## Functional

If you have fully registered the component library, you can use the Drawer functionally in the following ways:
- `window.$drawer`;
- Inside a Vue component: `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.drawer`;
- Import from `@pixelium/web-vue`.

When importing on demand, you can also import `Drawer` from `@pixelium/web-vue/es`.
]]]
<preview path="./drawer-function.vue"></preview>

## API

### Drawer Function

```ts
export type DrawerReturn = {
	close: () => void
}

// ...
// Drawer
{
	open: (
		options: (DrawerOptions & Omit<EmitEvent<DrawerEvents>, 'update:visible'>) | string
	) => DrawerReturn
}
```

### Attrs

[[[zh
就像上面栗子所展示的那样🌰，作为组件时你可以直接传入 `class` 和 `style` 等 attrs 穿透到 Drawer 容器元素上。
]]]

[[[en
As shown in the example above, when using it as a component, you can directly pass attrs like `class` and `style` that will be forwarded to the drawer container element.
]]]

[[[api zh
drawerOptions.content: Drawer 的主体内容。
drawerOptions.title: Drawer 标题。
drawerOptions.footer: Drawer 底部区域。
drawerOptions.placement: Drawer 弹出位置。
drawerOptions.closable: 是否展示右上角关闭按钮。
drawerOptions.mask: 是否展示遮罩层。
drawerOptions.maskClosable: 点击遮罩层是否可以关闭 Drawer。
drawerOptions.escToClose: 是否可以按 ESC 键关闭 Drawer。
drawerOptions.showFooter: 是否展示 Drawer 底部区域。
drawerOptions.zIndex: Drawer 的 `z-index` 属性。
drawerOptions.root: Drawer 挂载的根元素。
drawerOptions.maskProps: 遮罩层的属性。
drawerOptions.containerProps: Drawer 容器元素的属性。
drawerOptions.headerProps: Drawer 头部区域元素的属性。
drawerOptions.bodyProps: Drawer 内容区域元素的属性。
drawerOptions.footerProps: Drawer 底部区域元素的属性。

visible: 控制 Drawer 展示，受控模式，支持 `v-model`。
defaultVisible: 控制 Drawer 展示的默认值，非受控模式。
title: Drawer 的标题。
closable: 是否展示右上角关闭按钮。
mask: 是否展示遮罩层。
maskClosable: 点击遮罩层是否可以关闭 Drawer。
escToClose: 是否可以按 ESC 键关闭 Drawer。
showFooter: 是否展示 Drawer 底部区域。
zIndex: Drawer 的 `z-index` 属性。
root: Drawer 挂载的根元素。
destroyOnHide: Drawer 内容是否在隐藏后销毁。
maskProps: 遮罩层的属性。
containerProps: Drawer 容器元素的属性。
headerProps: Drawer 头部区域元素的属性。
bodyProps: Drawer 内容区域元素的属性。
footerProps: Drawer 底部区域元素的属性。

slots.default: Drawer 的主体内容。
slots.title: Drawer 的标题。
slots.footer: Drawer 底部区域。

events.update:visible: 用于更新受控模式的 `visible` 值。
events.ok: 通过确认成功关闭 Drawer 的回调。
events.cancel: 通过关闭按钮、遮罩层、ESC 键等方法，关闭 Drawer 的回调。
events.open: Drawer 打开时的回调。
events.afterOpen: Drawer 打开动画结束后的回调。
events.close: Drawer 关闭时的回调。
events.afterClose: Drawer 关闭动画结束后的回调。

drawerExpose.close: 关闭 Drawer。
drawerExpose.open: 打开 Drawer。
]]]

[[[api en
drawerOptions.content: The main content of the Drawer.
drawerOptions.title: The title of the Drawer.
drawerOptions.footer: The footer area of the Drawer.
drawerOptions.placement: The placement where the Drawer appears.
drawerOptions.closable: Whether to show the close button in the upper right corner.
drawerOptions.mask: Whether to show the mask layer.
drawerOptions.maskClosable: Whether clicking the mask layer closes the Drawer.
drawerOptions.escToClose: Whether pressing the ESC key closes the Drawer.
drawerOptions.showFooter: Whether to show the footer area of the Drawer.
drawerOptions.zIndex: The `z-index` property of the Drawer.
drawerOptions.root: The root element where the Drawer is mounted.
drawerOptions.maskProps: Props for the mask layer.
drawerOptions.containerProps: Props for the Drawer container element.
drawerOptions.headerProps: Props for the Drawer header area element.
drawerOptions.bodyProps: Props for the Drawer content area element.
drawerOptions.footerProps: Props for the Drawer footer area element.

visible: Controls the visibility of the Drawer, controlled mode, supports `v-model`.
defaultVisible: The default visibility value of the Drawer, uncontrolled mode.
title: The title of the Drawer.
closable: Whether to show the close button in the upper right corner.
mask: Whether to show the mask layer.
maskClosable: Whether clicking the mask layer closes the Drawer.
escToClose: Whether pressing the ESC key closes the Drawer.
showFooter: Whether to show the footer area of the Drawer.
zIndex: The `z-index` property of the Drawer.
root: The root element where the Drawer is mounted.
destroyOnHide: Whether the Drawer content is destroyed after hiding.
maskProps: Props for the mask layer.
containerProps: Props for the Drawer container element.
headerProps: Props for the Drawer header area element.
bodyProps: Props for the Drawer content area element.
footerProps: Props for the Drawer footer area element.

slots.default: The main content of the Drawer.
slots.title: The title of the Drawer.
slots.footer: The footer area of the Drawer.

events.update:visible: Used to update the `visible` value in controlled mode.
events.ok: Callback when the Drawer is closed successfully via confirmation.
events.cancel: Callback when the Drawer is closed via the close button, mask, ESC key, etc.
events.open: Callback when the Drawer opens.
events.afterOpen: Callback after the Drawer opening animation ends.
events.close: Callback when the Drawer closes.
events.afterClose: Callback after the Drawer closing animation ends.

drawerExpose.close: Closes the Drawer.
drawerExpose.open: Opens the Drawer.
]]]

### ValidContent, ValidVNodeContent
```ts
export type ValidContent = string | ((...args: any[]) => VNode | string | JSX.Element | null | void)
export type ValidVNodeContent = (...args: any[]) => VNode | JSX.Element
```

[[[slice rest-attrs]]]
[[[slice emit-event]]]