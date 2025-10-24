[[[zh
# 消息提示 Message

全局消息提示，用于反馈用户操作结果。
]]]
[[[en
# Message

Global message prompt, used to feedback the result of user operations.
]]]
[[[zh
## 基础使用
如果你完整注册了组件库，你可以以以下方式使用它：
- `window.$message`；
- Vue 组件内： `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.message`；
- 从 `@pixelium/web-vue` 中导入。

按需引入时，也可以从 `@pixelium/web-vue/es` 中导入 `Message` 使用。
]]]
[[[en
## Basic Usage
If you have fully registered the component library, you can use it in the following ways:
- `window.$message`;
- Inside a Vue component: `getCurrentInstance().appContext.config.globalProperties.PixeliumVue.message`;
- Import from `@pixelium/web-vue`.

When importing on-demand, you can also import `Message` from `@pixelium/web-vue/es` for use.
]]]
<preview path="./message-basic.vue"></preview>
[[[zh
## 消息类型
消息有 `'normal'`（默认）、`'info'`、`'success'`、`'warning'`、`'error'`、`'loading'`、`'sakura'`，7 种类型，其中 `'normal'` 和 `'sakura'` 默认不展示图标。
]]]
[[[en
## Message Types
Messages come in 7 types: `'normal'` (default), `'info'`, `'success'`, `'warning'`, `'error'`, `'loading'`, and `'sakura'`. Among them, `'normal'` and `'sakura'` do not display icons by default.
]]]
<preview path="./message-theme.vue"></preview>
[[[zh
## 消息位置
消息可以出现在左上、上方（默认）、右上、左下、右下、下方，6 个位置。
]]]
[[[en
## Message Placements
Messages can appear in 6 placements: top-left, top (default), top-right, bottom-left, bottom-right, and bottom.
]]]
<preview path="./message-position.vue"></preview>
[[[zh
## 可关闭消息
`closable` 设置消息可关闭。
]]]
[[[en
## Closable Messages
Set `closable` to make the message closable.
]]]
<preview path="./message-closable.vue"></preview>
[[[zh
## 持续时间
`duration` 设置消息持续时间。
]]]
[[[en
## Duration
Set the duration of the message with `duration`.
]]]
<preview path="./message-duration.vue"></preview>
[[[zh
## 消息图标
`icon` 设置消息图标。
]]]
[[[en
## Message Icons
Set the message icon with `icon`.
]]]
<preview path="./message-icon.vue"></preview>
[[[zh
## 消息内容
消息内容支持传入 JSX 或者渲染函数。
]]]
[[[en
## Message Content
Message content supports JSX or render functions.
]]]
<preview path="./message-content.vue"></preview>
[[[zh
## 自定义颜色
自定义主色，内部基于此生成完整色板，该色板优先级高于 `info` 属性提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'`字符串和 3、4、6、8位长度的十六位数字表示。 
]]]
[[[en
## Custom Colors
Customize the primary color. The internal system generates a complete color palette based on this, which has a higher priority than the preset color palette provided by the `info` property. It supports CSS-like `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'` strings, as well as 3, 4, 6, and 8-digit hexadecimal numbers.
]]]
<preview path="./message-color.vue"></preview>
[[[zh
## 消息容器
MessageBox 组件是消息的容器，消息出现的位置由容器的 `placement` 决定。在以函数式创建的消息中，出现位置相同的消息都是同一个 MessageBox 的子组件。我们也提供了 MessageBox 的导出。
]]]
[[[en
## Message Container
The MessageBox component is the container for messages. The position of the message is determined by the container's `placement`. In functionally created messages, messages with the same position are sub-components of the same MessageBox. We also provide an export for MessageBox.
]]]
<preview path="./message-box.vue"></preview>
## API
### MessageFunction
```ts
type MessageFunction = (options: ValidContent | MessageOptions) => MessageReturn & {
  [key in MessageOptions['type'] & string]: (options: Omit<MessageOptions, 'type'> | string) => MessageReturn
}
declare const message: MessageFunction
```
### ValidContent, ValidVNodeContent
```ts
export type ValidContent = string | ((...args: any[]) => VNode | string | JSX.Element)
export type ValidVNodeContent = (...args: any[]) => VNode | JSX.Element
```
[[[api message-box en
messageOptions.content: Message content.
messageOptions.icon: Message icon.
messageOptions.duration: Duration (ms).
messageOptions.type: Message type.
messageOptions.color: Custom primary color. The internal system generates a complete color palette based on this, which has a higher priority than the preset color palette provided by `info` property. It supports CSS-like `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'` strings, as well as 3, 4, 6, and 8-digit hexadecimal numbers.
messageOptions.closable: Whether the message can be closed.
messageOptions.position: <Badge type="warning" text="Deprecated" /> The position where the message appears.
messageOptions.placement: The position where the message appears.
messageOptions.root: The element where the message is mounted.
messageReturn.close: Close the current message.
messageReturn.clear: Clear all messages in the current MessageBox.
messageBoxProps.messages: All messages in the current MessageBox.
messageBoxProps.position: <Badge type="warning" text="Deprecated" /> The position where the message appears.
messageBoxProps.placement: The position where the message appears.
messageBoxProps.zIndex: The `z-index` style of MessageBox.
messageBoxProps.root: The element where the message is mounted.
messageBoxExpose.close: Close the message.
events.update:messages: `v-model` updates the `messages` property.
events.close: Callback for closing the message.
]]]
[[[api message-box zh
messageOptions.content: 消息内容。
messageOptions.icon: 消息图标。
messageOptions.duration: 持续时间（ms）。
messageOptions.type: 消息类型。
messageOptions.color: 自定义主色，内部基于此生成完整色板，该色板优先级高于 `info` 属性提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
messageOptions.closable: 是否可以关闭消息。
messageOptions.position: <Badge type="warning" text="Deprecated" /> 消息出现位置。
messageOptions.placement: 消息出现位置。
messageOptions.root: 消息挂载元素。
messageReturn.close: 关闭当前消息。
messageReturn.clear: 清空当前 MessageBox 的所有消息。
messageBoxProps.messages: 当前 MessageBox 的所有消息。
messageBoxProps.position: <Badge type="warning" text="Deprecated" /> 消息出现位置。
messageBoxProps.placement: 消息出现位置。
messageBoxProps.zIndex: MessageBox 的 `z-index` 样式。
messageBoxProps.root: 消息挂载元素。
messageBoxExpose.close: 关闭消息。
events.update:messages: `v-model` 更新 `messages` 属性。
events.close: 关闭消息的回调。
]]]
[[[api en
content: Message content.
icon: Message icon.
duration: Duration (ms).
type: Message type.
color: Custom primary color. The internal system generates a complete color palette based on this, which has a higher priority than the preset color palette provided by `info` property. It supports CSS-like `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'` strings, as well as 3, 4, 6, and 8-digit hexadecimal numbers.
closable: Whether the message can be closed.
id: The unique identifier for the message. A random nanoid is used by default.
]]]
[[[api zh
content: 消息内容。
icon: 消息图标。
duration: 持续时间（ms）。
type: 消息类型。
color: 自定义主色，内部基于此生成完整色板，该色板优先级高于 `info` 属性提供的预设色版。支持类似 CSS 的 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'` 字符串和 3、4、6、8 位长度的十六位数字表示。
closable: 是否可以关闭消息。
id: 消息的唯一标识，默认使用随机的 nanoid。
]]]