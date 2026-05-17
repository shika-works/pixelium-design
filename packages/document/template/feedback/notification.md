[[[zh
# 通知 Notification

感觉就是样式不同的 Message
]]]
[[[en
# Notification

Essentially a Message with different styling.
]]]

[[[zh
## 基础使用
如果你完整注册了组件库，你可以以以下方式使用它：
- `window.$notification`；
- Vue 组件内： `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.notification`；
- 从 `@pixelium/web-vue` 中导入。

按需引入时，也可以从 `@pixelium/web-vue/es` 中导入 `Notification` 使用。
]]]
[[[en
## Basic Usage

If you have fully registered the component library, you can use it in the following ways:
- `window.$notification`;
- Inside a Vue component: `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.notification`;
- Import from `@pixelium/web-vue`.

For on-demand import, you can also import `Notification` from `@pixelium/web-vue/es`.
]]]
<preview path="./notification-basic.vue"></preview>

[[[zh
## 消息类型
Notification 有 `'normal'`（默认）、`'info'`、`'success'`、`'warning'`、`'error'`、`'loading'`、`'sakura'`、`'notice'`，多种类型，其中 `'normal'` 和 `'sakura'` 默认不展示图标。
]]]
[[[en
## Message Types

Notification has multiple types: `'normal'` (default), `'info'`, `'success'`, `'warning'`, `'error'`, `'loading'`, `'sakura'`, `'notice'`. Among them, `'normal'` and `'sakura'` do not display an icon by default.
]]]
<preview path="./notification-theme.vue"></preview>

[[[zh
## 通知位置
Notification 可以出现在左上、右上（默认）、左下、右下，4 个位置。
]]]
[[[en
## Position

Notification can appear in four positions: top-left, top-right (default), bottom-left, bottom-right.
]]]
<preview path="./notification-position.vue"></preview>

[[[zh
## 可关闭
`closable` 设置 Notification 可关闭。
]]]
[[[en
## Closable

Set `closable` to make the Notification closable.
]]]
<preview path="./notification-closable.vue"></preview>

[[[zh
## 持续时间
`duration` 设置持续时间。
]]]
[[[en
## Duration

Set `duration` to control how long the Notification stays.
]]]
<preview path="./notification-duration.vue"></preview>

[[[zh
## 通知容器
NotificationBox 组件是消息的容器，消息出现的位置由容器的 `placement` 决定。在以函数式创建的消息中，出现位置相同的 Notification 都是同一个 NotificationBox 的子组件。我们也提供了 NotificationBox 的导出。
]]]
[[[en
## Notification Container

The NotificationBox component is the container for messages. The position where messages appear is determined by the container's `placement`. In notifications created functionally, all notifications with the same placement are child components of the same NotificationBox. We also provide an export of NotificationBox.
]]]
<preview path="./notification-box.vue"></preview>

## API

### NotificationFunction
```ts
export type NotificationFunction = {
	(options: ValidContent | NotificationOptions): NotificationReturn
} & {
	[key in NotificationOptions['type'] & string]: (
		options: Omit<NotificationOptions, 'type'> | string
	) => NotificationReturn
}
declare const notification: NotificationFunction
```

### ValidContent, ValidVNodeContent
```ts
export type ValidContent = string | ((...args: any[]) => VNode | string | JSX.Element | null | void)
export type ValidVNodeContent = (...args: any[]) => VNode | JSX.Element
```

[[[api notification-box zh
notificationOptions.content: Notification 内容。
notificationOptions.title: Notification 标题。
notificationOptions.icon: Notification 图标。
notificationOptions.duration: 持续时间（ms）。
notificationOptions.type: Notification 类型。
notificationOptions.color: 自定义主色，详见 [支持的颜色解析](../config/supported-color-parsing)。
notificationOptions.closable: 是否可以关闭 Notification。
notificationOptions.placement: Notification 出现位置。
notificationOptions.root: NotificationBox 挂载元素。

notificationBoxExpose.close: 关闭当前 Notification。

notificationReturn.close: 关闭当前 Notification。
notificationReturn.clear: 清空当前 NotificationBox。
notificationReturn.unmount: 卸载当前 NotificationBox。

notificationBoxProps.notifications: 当前 NotificationBox 的所有 Notification 条目，需要使用 `v-model`。
notificationBoxProps.placement: Notification 出现位置。
notificationBoxProps.zIndex: NotificationBox 的 `z-index` 样式。
notificationBoxProps.root: NotificationBox 挂载元素。
notificationBoxProps.close: 关闭 Notification。

events.update:notifications: `v-model` 更新 `notifications` 属性。
events.close: 关闭 Notification 的回调。
]]]
[[[api zh
title: Notification 标题。
content: Notification 内容。
icon: Notification 图标。
duration: 持续时间（ms）。
type: Notification 类型。
color: 自定义主色，详见 [支持的颜色解析](../config/supported-color-parsing)。
closable: 是否可以关闭 Notification。
id: 唯一标识，默认使用随机的 nanoid。
placement: Notification 出现位置的标记，影响动画效果。
]]]

[[[api notification-box en
notificationOptions.content: Notification content.
notificationOptions.title: Notification title.
notificationOptions.icon: Notification icon.
notificationOptions.duration: Duration (ms).
notificationOptions.type: Notification type.
notificationOptions.color: Custom primary color, see [Supported color parsing](../config/supported-color-parsing) for details.
notificationOptions.closable: Whether the Notification can be closed.
notificationOptions.placement: Notification placement.
notificationOptions.root: NotificationBox mount element.

notificationBoxExpose.close: Close the current Notification.

notificationReturn.close: Close the current Notification.
notificationReturn.clear: Clear all Notifications in the current NotificationBox.
notificationReturn.unmount: Unmount the current NotificationBox.

notificationBoxProps.notifications: All Notification entries in the current NotificationBox, requires `v-model`.
notificationBoxProps.placement: Notification placement.
notificationBoxProps.zIndex: `z-index` style of NotificationBox.
notificationBoxProps.root: NotificationBox mount element.
notificationBoxProps.close: Close the Notification.

events.update:notifications: `v-model` updates the `notifications` property.
events.close: Callback for closing a Notification.
]]]
[[[api en
title: Notification title.
content: Notification content.
icon: Notification icon.
duration: Duration (ms).
type: Notification type.
color: Custom primary color, see [Supported color parsing](../config/supported-color-parsing).
closable: Whether the Notification can be closed.
id: Unique identifier, defaults to a random nanoid.
placement: The marker for where the Notification appears, affects the animation effect.
]]]