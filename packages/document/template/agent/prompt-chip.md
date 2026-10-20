[[[zh
# 提示词标签 PromptChip

chip 是 Prompt 编辑器里的内联片段：输入触发字符并选中候选后插入，以单行标签的形式展示，同时仍是输入内容的一部分。`modelValue` 用 chip 的 `label` 拼出纯文本，`content` 则保留文本与 chip 的片段数组。
]]]
[[[en
# PromptChip

A chip is an inline segment inside the Prompt editor: it is inserted by typing a trigger character and choosing a candidate, shown as a single-line label, and still part of the input. `modelValue` joins the `label` of the chips into plain text, while `content` keeps both the text and the chip segments.
]]]

[[[zh
## 基础使用

`chipConfig` 的 `trigger` 指定唤起候选列表的字符，`options` 给出候选（也可以混入分组）。选中后，触发字符与已输入的关键词会被替换成一个 chip，插入与移除分别触发 `chipAdd` 与 `chipRemove`。

`chipType` 决定 chip 的类型，可以是固定字符串，也可以是按选项计算的函数；类型会拼成 `px-prompt-chip__<type>` 类，在输入内容以纯文本保存时不受影响。
]]]
[[[en
## Basic Usage

`trigger` of `chipConfig` sets the characters that open the candidate list, and `options` provides the candidates (groups can be mixed in). Once a candidate is chosen, the trigger character and the typed keyword are replaced by a chip; the insertion and the removal emit `chipAdd` and `chipRemove`.

`chipType` decides the type of the chip: it can be a fixed string or a function computed from the option. The type becomes the `px-prompt-chip__<type>` class and does not affect the plain text the content is saved as.
]]]

<preview path="./prompt-chip-basic.vue"></preview>

[[[zh
## 插入与删除

除输入触发字符外，也可以用 ref 上的 `insertChip` 与 `removeChip` 手动操作：前者在光标处插入一个 chip，后者按 `id` 移除。输入触发字符时，`trigger` 事件会给出当前字符、关键词、面板是否展开以及触发位置。

下面的例子用两个按钮插入与移除 chip，并通过 `chipAdd` 与 `chipRemove` 维护自己的列表。
]]]
[[[en
## Insert and Remove

Besides typing a trigger character, the `insertChip` and `removeChip` of the ref operate on chips directly: the former inserts a chip at the caret, the latter removes one by `id`. While a trigger character is typed, the `trigger` event carries the current character, the keyword, whether the panel is open and the position of the trigger.

The following example inserts and removes chips with two buttons, keeping its own list through `chipAdd` and `chipRemove`.
]]]

<preview path="./prompt-chip-insert.vue"></preview>

[[[zh
## 自定义样式

chip 的节点由编辑器在输入过程中创建，结构不能替换，外观通过类型类定制：直接用 `px-prompt-chip__<type>` 改背景、颜色、圆角。chip 处在 `contenteditable` 中，不要在其中放按钮、输入框这类可聚焦元素。
]]]
[[[en
## Custom Styles

The chip nodes are created by the editor while typing, so their structure cannot be replaced; the appearance is customized through the type class: change the background, the color and the radius with `px-prompt-chip__<type>`. The chip lives in a `contenteditable`, so do not put focusable elements such as buttons or inputs inside it.
]]]

<preview path="./prompt-chip-style.vue"></preview>

## API
[[[api zh
id: PromptChip 的唯一标识。
type: PromptChip 的类型。
label: PromptChip 展示的文本。
value: PromptChip 携带的文本值。
data: PromptChip 携带的自定义数据。

trigger: 唤起候选列表的触发字符。
options: 候选列表的数据。
filter: 候选列表的自定义过滤函数。
dropdownProps: 候选列表弹出层的属性与事件。

char: 触发提及的字符。
query: 触发字符之后已输入的关键词。
active: 候选列表是否展开。
rect: 触发字符所在位置的区域。
]]]
[[[api en
id: The unique identifier of PromptChip.
type: The type of PromptChip.
label: The text shown by PromptChip.
value: The text value carried by PromptChip.
data: The custom data carried by PromptChip.

trigger: The characters that open the candidate list.
options: The data of the candidate list.
filter: The custom filter of the candidate list.
dropdownProps: The properties and events of the candidate list popup.

char: The character that triggers the mention.
query: The keyword typed after the trigger character.
active: Whether the candidate list is open.
rect: The area of the position where the trigger character sits.
]]]

[[[zh
### 事件

以下事件由 Prompt 抛出，参数与 chip 相关，详见 [提示词输入](./prompt)。

| 事件 | 参数 | 描述 | 版本 |
| --- | --- | --- | --- |
| chipAdd | `chip: PromptChip` | chip 插入时触发。 | 0.2.1 |
| chipRemove | `chip: PromptChip` | chip 移除时触发。 | 0.2.1 |
| trigger | `payload: PromptTriggerPayload` | 输入提及触发字符时触发。 | 0.2.1 |
]]]
[[[en
### Events

The following events are emitted by Prompt and carry chip related payloads; see [Prompt](./prompt).

| Event | Parameter | Description | Version |
| --- | --- | --- | --- |
| chipAdd | `chip: PromptChip` | Triggered when a chip is inserted. | 0.2.1 |
| chipRemove | `chip: PromptChip` | Triggered when a chip is removed. | 0.2.1 |
| trigger | `payload: PromptTriggerPayload` | Triggered when a mention trigger character is typed. | 0.2.1 |
]]]

[[[zh
### 方法

以下方法通过 ref 调用，属于 Prompt，详见 [提示词输入](./prompt)。

| 属性 | 类型 | 可选 | 默认值 | 描述 | 版本 |
| --- | --- | --- | --- | --- | --- |
| setCaret | `(position: PromptCaretPosition) => void` | 否 | ` ` | 将光标移动到指定位置：`start`、`end` 或字符偏移；`setContent` 之后调用需先 `await nextTick()`。 | 0.2.1 |
| insertChip | `(chip: PromptChip) => void` | 否 | ` ` | 在光标处插入 chip。 | 0.2.1 |
| removeChip | `(id: number \| string \| symbol) => void` | 否 | ` ` | 移除指定 id 的 chip。 | 0.2.1 |
]]]
[[[en
### Methods

The following methods are called through the ref and belong to Prompt; see [Prompt](./prompt).

| Attribute | Type | Optional | Default | Description | Version |
| --- | --- | --- | --- | --- | --- |
| setCaret | `(position: PromptCaretPosition) => void` | False | ` ` | Moves the caret to the given position: `start`, `end` or a character offset; wait for one `nextTick` before calling it after `setContent`. | 0.2.1 |
| insertChip | `(chip: PromptChip) => void` | False | ` ` | Inserts a chip at the caret. | 0.2.1 |
| removeChip | `(id: number \| string \| symbol) => void` | False | ` ` | Removes the chip with the given id. | 0.2.1 |
]]]

### PromptCaretPosition

```ts
export type PromptCaretPosition = 'start' | 'end' | number
```

### PromptOption

```ts
export interface PromptOption extends Omit<OptionListOption, 'value'> {
	chipType?: string | ((option: PromptOption) => string)
}
```

### PromptGroupOption

```ts
export interface PromptGroupOption {
	label: string
	key: string | number | symbol
	children: (PromptOption | string)[]
	type: typeof GROUP_OPTION_TYPE
}
```

[[[slice option-list]]]

[[[slice group-option]]]
