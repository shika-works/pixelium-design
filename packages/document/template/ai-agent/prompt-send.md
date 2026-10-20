[[[zh
# 提示词发送 PromptSend

Prompt 的发送入口：空闲时是发送按钮，`loading` 且允许中断时变为停止入口，`loading` 但不允许中断时展示加载状态。它从 Prompt 读取 `disabled`、`loading` 与 `cancellable`，也可以脱离 Prompt 单独使用。
]]]
[[[en
# PromptSend

The send entry of Prompt: a send button while idle, a stop entry while `loading` and cancellable, and a loading state while `loading` but not cancellable. It reads `disabled`, `loading` and `cancellable` from Prompt, and it also works on its own.
]]]

[[[zh
## 基础使用

把 PromptSend 放进 Prompt 的 `send` 插槽即可替换内置的发送入口；`disabled`、`loading` 与 `cancellable` 会自动跟随 Prompt，通常不必自己传。`send` 插槽的作用域是 `PromptSendScope`，其中的 `submit` 与 `cancel` 就是点击要接的方法。

脱离 Prompt 使用时，自己传 `disabled` 与 `loading`：`loading` 展示加载状态，点击在禁用与加载时都不会派发。

下面的例子用三个开关模拟提交中、可中断与禁用，并把点击分别接到 `submit` 与 `cancel` 上。
]]]
[[[en
## Basic Usage

Place PromptSend in the `send` slot of Prompt to replace the internal send entry; `disabled`, `loading` and `cancellable` follow the Prompt automatically, so you rarely pass them yourself. The scope of the `send` slot is `PromptSendScope`, whose `submit` and `cancel` are the methods the click is wired to.

Used on its own, pass `disabled` and `loading` yourself: `loading` shows the loading state, and the click is not emitted while disabled or loading.

The following example uses three switches to simulate submitting, cancellable and disabled, and wires the click to `submit` and `cancel` respectively.
]]]

<preview path="./prompt-send-basic.vue"></preview>

## API

[[[zh
`PromptSendScope` 是 Prompt 传给 `send`、`start` 与 `end` 插槽的作用域：`submit` 与 `cancel` 负责提交和中断，`disabled`、`loading` 与 `cancellable` 是 Prompt 当前的状态。
]]]
[[[en
`PromptSendScope` is the scope Prompt passes to the `send`, `start` and `end` slots: `submit` and `cancel` submit and abort the input, while `disabled`, `loading` and `cancellable` carry the current state of Prompt.
]]]

[[[api zh
disabled: PromptSend 是否禁用。
loading: PromptSend 是否处于加载状态。

events.click: 点击发送入口时触发。

slots.trigger: 发送入口区域，替换内置的按钮。
slots.icon: 发送入口的图标。

promptSendScope.cancel: 放弃当前的输入内容。
promptSendScope.submit: 提交当前的输入内容。
promptSendScope.disabled: Prompt 是否禁用。
promptSendScope.loading: Prompt 是否处于提交中。
promptSendScope.cancellable: 提交中是否允许中断。
]]]
[[[api en
disabled: Whether PromptSend is disabled.
loading: Whether PromptSend is loading.

events.click: Triggered when the send entry is clicked.

slots.trigger: The send entry area, replacing the internal button.
slots.icon: The icon of the send entry.

promptSendScope.cancel: Discards the current input.
promptSendScope.submit: Submits the current input.
promptSendScope.disabled: Whether Prompt is disabled.
promptSendScope.loading: Whether Prompt is submitting.
promptSendScope.cancellable: Whether the submission can be aborted while Prompt is loading.
]]]
