[[[zh
# 确认弹出框 Popconfirm

一个有确认按钮的弹出框。

> Popconfirm 与 Popover 在交互上类似，但更侧重于提供确认（确认/取消）类的轻量化操作。
]]]

[[[en
# Popconfirm

A popup with a confirm button.

> Popconfirm is similar to Popover in interaction, but focuses on confirmation (confirm/cancel) scenarios for quick confirmation flows.
]]]

[[[zh
## 基础使用

通过 `content` 属性设置显示的提示文本，默认会展示图标、文本与底部按钮（确认/取消）。
]]]
[[[en
## Basic Usage

Use the `content` prop to set the message. By default Popconfirm shows an icon, message and footer buttons (confirm/cancel).
]]]

<preview path="./popconfirm-basic.vue"></preview>

[[[zh
## 受控模式

传入 `visible` 属性进入受控模式；不传或传 `undefined` 则为非受控模式，可使用 `defaultVisible` 指定初始显示。组件会触发 `update:visible` 事件以配合 `v-model`。 
]]]
[[[en
## Controlled Mode

Passing `visible` switches the component to controlled mode. If omitted or set to `undefined`, the component is uncontrolled and `defaultVisible` can be used to set the initial state. The component emits `update:visible` to support `v-model`.
]]]

<preview path="./popconfirm-control.vue"></preview>

[[[zh
## 异步确认

传入 `onBeforeOk` 后，在确认时将会等待 `onBeforeOk` 执行完成，若结果不为 `false` 再执行后续代码。
]]]
[[[en
## Asynchronous Confirmation

When `onBeforeOk` is provided, the confirmation process will wait for `onBeforeOk` to complete. If the result is not `false`, subsequent code will be executed.
]]]

<preview path="./popconfirm-before-ok.vue"></preview>

[[[zh
## 自定义底部与图标

通过 `footer` 插槽可以自定义整个底部区域。若需要自定义图标，可使用 `icon` 插槽，`showIcon` 控制是否展示图标；若只需要更改按钮文字 / 属性，使用 `okText`、`cancelText` 以及 `okButtonProps`、`cancelButtonProps`。
]]]
[[[en
## Custom Footer and Icon

Customize the entire bottom area via the `footer` slot. Use the `icon` slot for custom icons; `showIcon` controls icon visibility. To modify button text or properties only, use `okText`, `cancelText`, `okButtonProps`, and `cancelButtonProps`.
]]]

<preview path="./popconfirm-custom-footer.vue"></preview>

[[[zh
## 禁用状态

传入 `disabled` 设置禁用状态，此时触发方式将失效，弹出层不会被打开。
]]]
[[[en
## Disabled State

Set `disabled` to disable the component. Trigger actions will be ignored and the popup will not open.
]]]

<preview path="./popconfirm-disabled.vue"></preview>

---

## API

[[[api zh
content: 确认弹出框文本内容。
visible: 是否显示（受控模式，支持 `v-model`）。
defaultVisible: 非受控模式下默认的显示状态。
placement: 弹出位置。
trigger: 触发方式。
offset: 弹出偏移距离（像素）。
variant: 组件样式变体（light/dark）。
arrow: 是否展示箭头。
disabled: 是否禁用。
zIndex: 弹出层 `z-index`。
root: 挂载元素。
destroyOnHide: 隐藏时是否销毁内容。
loading: 传入 `loading` 则用于控制确认按钮 loading 状态。
showIcon: 是否显示默认图标。
showCancel: 是否显示取消按钮。
showFooter: 是否显示底部区域。
okText: 确认按钮文本。
cancelText: 取消按钮文本。
popoverProps: 透传给内部 Popover 的属性。
okButtonProps: 传给确认按钮的属性以及事件。
cancelButtonProps: 传给取消按钮的属性以及事件。
containerProps: 透传 DOM 属性到容器区域。
contentProps: 透传 DOM 属性到内容区域容器。
footerProps: 透传 DOM 属性到底部区域容器。

events.update:visible: `v-model` 更新时触发。
events.beforeOk: 用于异步确认，需返回一个 `Promise<boolean | void> | boolean | void` 类型的数据判断是否成功，`await` 操作后不为 `false` 即为确认成功。
events.ok: 点击确认按钮时触发（在 onBeforeOk 通过时）。
events.cancel: 点击取消按钮时触发。
events.close: 弹出层关闭时触发。
events.open: 弹出层打开时触发。

slots.default: 触发元素插槽。
slots.content: 自定义内容。
slots.icon: 自定义图标。
slots.footer: 自定义底部。

popconfirmExpose.open: 打开确认弹出框。
popconfirmExpose.close: 关闭确认弹出框。
]]]

[[[api en
content: Text content of the confirmation popup.
visible: Whether to display (controlled mode, supports `v-model`).
defaultVisible: Default visibility state in uncontrolled mode.
placement: Popup placement.
trigger: Trigger method.
offset: Popup offset distance (pixels).
variant: Component style variant (light/dark).
arrow: Whether to show arrow.
disabled: Whether disabled.
zIndex: `z-index` of the popup layer.
root: Mount element.
destroyOnHide: Whether to destroy content when hidden.
loading: Pass `loading` to control the loading state of the confirm button.
showIcon: Whether to show the default icon.
showCancel: Whether to show the cancel button.
showFooter: Whether to show the footer area.
okText: Text for the confirm button.
cancelText: Text for the cancel button.
popoverProps: Props passed through to the internal Popover.
okButtonProps: Props and events passed to the confirm button.
cancelButtonProps: Props and events passed to the cancel button.
containerProps: DOM attributes passed to the container area.
contentProps: DOM attributes passed to the content area container.
footerProps: DOM attributes passed to the footer area container.

events.update:visible: Triggered when `v-model` updates.
events.beforeOk: For async confirmation. Must return a value of type `Promise<boolean | void> | boolean | void`. Confirmation succeeds if the result after `await` is not `false`.
events.ok: Triggered when the confirm button is clicked (after beforeOk passes).
events.cancel: Triggered when the cancel button is clicked.
events.close: Triggered when the popup closes.
events.open: Triggered when the popup opens.

slots.default: Slot for the trigger element.
slots.content: Custom content slot.
slots.icon: Custom icon slot.
slots.footer: Custom footer slot.

popconfirmExpose.open: Opens the confirmation popup.
popconfirmExpose.close: Closes the confirmation popup.
]]]

### RestAttrs, EmitEvent

```ts
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