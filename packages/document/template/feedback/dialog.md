[[[zh
# 对话框 Dialog

弹出对话框时，对话框就会被弹出。
]]]
[[[en
# Dialog

When a dialog is triggered, the dialog will pop up.
]]]

[[[zh
## 基础使用

`visible` 控制对话框的展示和隐藏，传入 `visible` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultVisible` 属性作为默认值。
]]]
[[[en
## Basic Usage

The `visible` property controls the display and hiding of the dialog. When `visible` is passed, it enters controlled mode. If not passed or set to `undefined`, it is in uncontrolled mode, and the `defaultVisible` property can be provided as the default value.
]]]
<preview path="./dialog-base.vue"></preview>

[[[zh
## 弹窗表单

只是一个对话框中使用表单的栗子🌰。就像栗子所展示的那样，你可以直接传入 `class` 和 `style` 等 attrs 穿透到对话框容器元素上。
]]]
[[[en
## Form in Dialog

This is just an example of using a form inside a dialog. As demonstrated by the example, you can directly pass attrs such as `class` and `style` through to the dialog container element.
]]]
<preview path="./dialog-form.vue"></preview>

[[[zh
## 函数式

如果你完整注册了组件库，你可以以以下方式使用它：
- `window.$dialog`；
- Vue 组件内： `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.dialog`；
- 从 `@pixelium/web-vue` 中导入。

按需引入时，也可以从 `@pixelium/web-vue/es` 中导入 `Dialog` 使用。
]]]
[[[en
## Functional Usage

If you have fully registered the component library, you can use it in the following ways:
- `window.$dialog`;
- Inside a Vue component: `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.dialog`;
- Import from `@pixelium/web-vue`.

When using on-demand import, you can also import `Dialog` from `@pixelium/web-vue/es` for usage.
]]]
<preview path="./dialog-function.vue"></preview>

[[[zh
## 异步确认

传入 `onBeforeOk` 后，在确认时将会等待 `onBeforeOk` 执行完成，若结果不为 `false` 再执行后续代码。
]]]
[[[en
## Asynchronous Confirmation

When `onBeforeOk` is provided, the confirmation process will wait for `onBeforeOk` to complete. If the result is not `false`, subsequent code will be executed.
]]]
<preview path="./dialog-async-confirm.vue"></preview>

## API

### Dialog Function

[[[zh

Dialog 上的函数调用后，返回一个 `Promise<boolean>`，通过确认关闭弹窗，则以 `true` fulfilled，否则为 `false`。

]]]
[[[en

After calling a function on the Dialog, a `Promise<boolean>` is returned. If the dialog is closed via confirmation, the promise is fulfilled with `true`; otherwise, it is `false`.

]]]

```ts
type DialogReturn = Promise<boolean> & {
	close: () => void
}

// ...
{
	[key in DialogOptions['type'] & string]: (
		options:
			| (Omit<DialogOptions, 'type'> & Omit<EmitEvent<DialogEvents>, 'update:visible'>)
			| string
	) => DialogReturn
}
```

[[[zh
就像上面栗子所展示的那样🌰，作为组件时你可以直接传入 `class` 和 `style` 等 attrs 穿透到对话框容器元素上。
]]]
[[[en
Just as demonstrated in the example above example, when used as a component, you can directly pass attributes such as `class` and `style` through to the dialog container element.
]]]

[[[api zh
dialogOptions.content: 对话框内容。
dialogOptions.title: 对话框标题。
dialogOptions.icon: 对话框标题图标。
dialogOptions.footer: 对话框底部区域。
dialogOptions.type: 对话框类型。
dialogOptions.closable: 是否展示右上角关闭按钮。
dialogOptions.mask: 是否展示遮罩层。
dialogOptions.maskClosable: 点击遮罩层是否可以关闭对话框。
dialogOptions.escToClose: 是否可以按 ESC 键关闭对话框，需要聚焦到对话框中。
dialogOptions.showCancel: 是否展示取消按钮，不设置时，受 `type` 字段影响，仅 `'confirm'` 时展示。
dialogOptions.okText: 确认按钮文本内容。
dialogOptions.cancelText: 取消按钮文本内容。
dialogOptions.showFooter: 是否展示对话框底部区域。
dialogOptions.zIndex: 对话框的 `z-index` 属性。
dialogOptions.root: 对话框挂载的根元素。
dialogOptions.okButtonProps: 确认按钮的属性。
dialogOptions.cancelButtonProps: 取消按钮的属性。
dialogOptions.maskProps: 遮罩层的属性。
dialogOptions.containerProps: 对话框容器元素的属性。
dialogOptions.headerProps: 对话框头部区域元素的属性。
dialogOptions.bodyProps: 对话框内容区域元素的属性。
dialogOptions.footerProps: 对话框底部区域元素的属性。

visible: 控制对话框展示，受控模式，支持 `v-model`。
defaultVisible: 控制对话框展示的默认值，非受控模式。
title: 对话框标题。
closable: 是否展示右上角关闭按钮。
mask: 是否展示遮罩层。
maskClosable: 点击遮罩层是否可以关闭对话框。
escToClose: 是否可以按 ESC 键关闭对话框，需要聚焦到对话框中。
showCancel: 是否展示取消按钮，不设置时，受 `type` 字段影响，仅 `'confirm'` 时展示。
okText: 确认按钮文本内容。
cancelText: 取消按钮文本内容。
loading: 确认按钮是否处于加载状态。
showFooter: 是否展示对话框底部区域。
zIndex: 对话框的 `z-index` 属性。
root: 对话框挂载的根元素。
destroyOnHide: 对话框内容是否在隐藏后销毁。
okButtonProps: 确认按钮的属性。
cancelButtonProps: 取消按钮的属性。
maskProps: 遮罩层的属性。
containerProps: 对话框容器元素的属性。
headerProps: 对话框头部区域元素的属性。
bodyProps: 对话框内容区域元素的属性。
footerProps: 对话框底部区域元素的属性。

slots.default: 对话框内容。
slots.title: 对话框标题。
slots.icon: 对话框标题图标。
slots.footer: 对话框底部区域。

events.update:visible: 用于更新受控模式的 `visible` 值。
events.beforeOk: 用于异步确认，需返回一个 `Promise<boolean | void> | boolean | void` 类型的数据判断是否成功，`await` 操作后不为 `false` 即为确认成功。
events.ok: 通过确认成功关闭弹窗的回调。
events.cancel: 通过取消、关闭按钮、遮罩层、ESC 键等方法，关闭弹窗的回调。
events.open: 弹窗打开时的回调。
events.afterOpen: 弹窗打开动画结束后的回调。
events.close: 弹窗关闭时的回调。
events.afterClose: 弹窗关闭动画结束后的回调。

dialogExpose.close: 关闭弹窗。
dialogExpose.open: 打开弹窗。
]]]

[[[api en
dialogOptions.content: Dialog content.
dialogOptions.title: Dialog title.
dialogOptions.icon: Dialog title icon.
dialogOptions.footer: Dialog footer area.
dialogOptions.type: Dialog type.
dialogOptions.closable: Whether to display the close button in the top-right corner.
dialogOptions.mask: Whether to display the mask layer.
dialogOptions.maskClosable: Whether the dialog can be closed by clicking the mask layer.
dialogOptions.escToClose: Whether the dialog can be closed by pressing the ESC key (requires focus to be within the dialog).
dialogOptions.showCancel: Whether to display the cancel button. If not set, it is influenced by the `type` field—only displayed when the type is `'confirm'`.
dialogOptions.okText: Text content of the confirm button.
dialogOptions.cancelText: Text content of the cancel button.
dialogOptions.showFooter: Whether to display the dialog footer area.
dialogOptions.zIndex: The `z-index` property of the dialog.
dialogOptions.root: The root element to which the dialog is mounted.
dialogOptions.okButtonProps: Properties of the confirm button.
dialogOptions.cancelButtonProps: Properties of the cancel button.
dialogOptions.maskProps: Properties of the mask layer.
dialogOptions.containerProps: Properties of the dialog container element.
dialogOptions.headerProps: Properties of the dialog header area element.
dialogOptions.bodyProps: Properties of the dialog content area element.
dialogOptions.footerProps: Properties of the dialog footer area element.

visible: Controls the display of the dialog (controlled mode), supports `v-model`.
defaultVisible: Default value for controlling the display of the dialog (uncontrolled mode).
title: Dialog title.
closable: Whether to display the close button in the top-right corner.
mask: Whether to display the mask layer.
maskClosable: Whether the dialog can be closed by clicking the mask layer.
escToClose: Whether the dialog can be closed by pressing the ESC key (requires focus to be within the dialog).
showCancel: Whether to display the cancel button. If not set, it is influenced by the `type` field—only displayed when the type is `'confirm'`.
okText: Text content of the confirm button.
cancelText: Text content of the cancel button.
loading: Whether the confirm button is in a loading state.
showFooter: Whether to display the dialog footer area.
zIndex: The `z-index` property of the dialog.
root: The root element to which the dialog is mounted.
destroyOnHide: Whether the dialog content is destroyed after hiding.
okButtonProps: Properties of the confirm button.
cancelButtonProps: Properties of the cancel button.
maskProps: Properties of the mask layer.
containerProps: Properties of the dialog container element.
headerProps: Properties of the dialog header area element.
bodyProps: Properties of the dialog content area element.
footerProps: Properties of the dialog footer area element.

slots.default: Dialog content.
slots.title: Dialog title.
slots.icon: Dialog title icon.
slots.footer: Dialog footer area.

events.update:visible: Used to update the `visible` value in controlled mode.
events.beforeOk: For async confirmation. Must return a value of type `Promise<boolean | void> | boolean | void` to indicate success. Confirmation is successful if the result after `await` is not `false`.
events.ok: Callback triggered when the dialog is successfully closed via confirmation.
events.cancel: Callback triggered when the dialog is closed via cancellation, close button, mask layer, ESC key, etc.
events.open: Callback triggered when the dialog opens.
events.afterOpen: Callback triggered after the dialog opening animation ends.
events.close: Callback triggered when the dialog closes.
events.afterClose: Callback triggered after the dialog closing animation ends.

dialogExpose.close: Close the dialog.
dialogExpose.open: Open the dialog.
]]]

### ValidContent, ValidVNodeContent
```ts
export type ValidContent = string | ((...args: any[]) => VNode | string | JSX.Element)
export type ValidVNodeContent = (...args: any[]) => VNode | JSX.Element
```

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