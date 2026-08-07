[[[zh
# 打字机 Typewriter

一个模拟打字机效果的组件，常用于标题或介绍性文字的展示。
]]]
[[[en
# Typewriter

A component that simulates a typewriter effect, often used for headings, or introductory text.
]]]

[[[zh
## 基本用法

Typewriter 支持多种命令组合成完整的打字序列： `type` 命令负责逐字输出文本，`backspace` 逐字删除，`delay` 暂停一段时间，`clear` 清空已输出的全部内容。

> 当 `text` 属性绑定的响应式对象发生引用改变时，Typewriter 内部状态将会重置。若仅修改该对象内部的某个属性，则此次修改会在该命令下一次被打印时生效。
]]]
[[[en
## Basic Usage

Typewriter supports combining multiple commands into a complete typing sequence: the `type` command outputs text character by character, `backspace` deletes characters one by one, `delay` pauses for a set period, and `clear` clears all the content that has been output.

> When the reactive object bound to the `text` property undergoes a reference change, the Typewriter's internal state will be reset. If only a property within that object is modified, the change will take effect the next time the command is printed.
]]]
<preview path="./typewriter-command.vue"></preview>

[[[zh
## 样式命令

使用 `setTypeColor` 和 `setTypeClass` 命令可以分别设置后续输出的文字颜色和 CSS 类名，从而在同一段文字中呈现不同的样式。
]]]
[[[en
## Styling Commands

Use the `setTypeColor` and `setTypeClass` commands to set the text color and CSS class of the subsequent output respectively, so different styles can appear within the same piece of text.
]]]
<preview path="./typewriter-color.vue"></preview>

[[[zh
## 自定义内容

Typewriter 提供 `default` 插槽来自定义文本渲染，接收当前输出文本；`caret` 插槽用于自定义光标，接收光标可见状态。
]]]
[[[en
## Custom Content

Typewriter provides the `default` slot to customize the text rendering, receiving the current output text; the `caret` slot is used to customize the caret, receiving the caret visibility state.
]]]
<preview path="./typewriter-slot.vue"></preview>

[[[zh
## 循环

使用 `loop` 属性可以让 Typewriter 循环播放命令序列。
]]]
[[[en
## Loop

Use the `loop` prop to make Typewriter play the command sequence repeatedly.
]]]
<preview path="./typewriter-loop.vue"></preview>

[[[zh
## 手动控制

通过 `autoplay` 属性可以控制打字是否自动开始。组件还暴露 `start`、`pause`、`resume`、`reset` 方法，便于手动控制打字过程：`start` 从头开始播放，`pause` 暂停当前打字，`resume` 从暂停处继续，`reset` 根据属性状态重置播放并视 `autoplay` 决定是否自动继续。
]]]
[[[en
## Manual Control

Use the `autoplay` prop to control whether typing starts automatically. The component also exposes the `start`, `pause`, `resume`, and `reset` methods for manual control over the typing process: `start` plays from the beginning, `pause` pauses the current typing, `resume` continues from where it was paused, and `reset` resets the playback according to the prop state and continues automatically if `autoplay` is enabled.
]]]
<preview path="./typewriter-expose.vue"></preview>

## API
[[[api zh
text: Typewriter 的打字命令序列。
typeSpeed: Typewriter 打字的速度（毫秒/字符）。
deleteSpeed: Typewriter 退格删除的速度（毫秒/字符）。
startDelay: Typewriter 开始打字前的延迟时间。
loop: Typewriter 是否循环播放命令序列。
autoplay: Typewriter 是否自动开始打字。
caret: 是否显示 Typewriter 的光标。
caretText: Typewriter 光标的文本内容。
blinkSpeed: Typewriter 光标的闪烁速度（毫秒间隔）。

events.start: Typewriter 开始打字时触发。
events.end: Typewriter 打完所有命令时触发。
events.textChange: Typewriter 当前输出文本变化时触发。
events.indexChange: Typewriter 执行命令索引变化时触发。

slots.default: 自定义 Typewriter 的文本渲染。
slots.caret: 自定义 Typewriter 的光标。

typewriterExpose.start: （重新）开始 Typewriter 的打字过程。
typewriterExpose.pause: 暂停 Typewriter 的打字过程。
typewriterExpose.resume: 恢复 Typewriter 被打断的打字过程。
typewriterExpose.reset: 重置 Typewriter 的打字内容。
]]]
[[[api en
text: The typing command sequence of Typewriter.
typeSpeed: The typing speed of Typewriter (ms per character).
deleteSpeed: The backspace deletion speed of Typewriter (ms per character).
startDelay: The delay before Typewriter starts typing.
loop: Whether Typewriter loops through the command sequence.
autoplay: Whether Typewriter starts typing automatically.
caret: Whether the caret of Typewriter is shown.
caretText: The text content of the Typewriter caret.
blinkSpeed: Typewriter cursor blink speed (ms interval).

events.start: Triggered when Typewriter starts typing.
events.end: Triggered when Typewriter finishes all commands.
events.textChange: Triggered when the current output text of Typewriter changes.
events.indexChange: Triggered when the executing command index of Typewriter changes.

slots.default: Customize the text rendering of Typewriter.
slots.caret: Customize the caret of Typewriter.

typewriterExpose.start: (Re)start the typing process of Typewriter.
typewriterExpose.pause: Pause the typing process of Typewriter.
typewriterExpose.resume: Resume the interrupted typing process of Typewriter.
typewriterExpose.reset: Reset the typing content of Typewriter.
]]]

### TypewriterText
```ts
export type TypewriterText =
	| {
			type: 'type'
			text: string
	  }
	| {
			type: 'backspace'
			count: number
	  }
	| {
			type: 'delay'
			ms: number
	  }
	| {
			type: 'clear'
	  }
	| {
			type: 'setTypeColor'
			color: string
	  }
	| {
			type: 'setTypeClass'
			class: string
	  }
```