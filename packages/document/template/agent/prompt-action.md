[[[zh
# 提示词操作 PromptAction

Prompt 工具栏中的操作控件，包括动作按钮 PromptAction、带标签开关 PromptSwitch 与下拉选择 PromptSelect。
]]]
[[[en
# PromptAction

Action controls for the Prompt toolbar: the action button PromptAction, the labeled switch PromptSwitch and the dropdown PromptSelect.
]]]

[[[zh
## 基础使用

把三者放进 Prompt 的工具栏插槽即可使用。PromptAction 通过 `label` 或 `default` 插槽展示文本，`icon` 与 `suffix` 插槽放置图标和尾部内容；PromptSwitch 用 `v-model` 控制激活状态，激活时展示关闭入口；PromptSelect 通过 `options` 提供选项，并用 `v-model` 保存选中值。三者都会跟随 Prompt 的 `disabled` 与 `readonly` 一起禁用。
]]]
[[[en
## Basic Usage

Place the three controls in the toolbar slots of Prompt. PromptAction shows its text through `label` or the `default` slot, with the `icon` and `suffix` slots holding the icon and the trailing content; PromptSwitch controls its active state with `v-model` and shows a close entry while it is active; PromptSelect takes its options from `options` and keeps the selected value in `v-model`. All three are disabled together with the `disabled` and `readonly` states of the Prompt.
]]]

<preview path="./prompt-action-basic.vue"></preview>

## API
[[[api zh
label: PromptAction 的文本。
disabled: PromptAction 是否禁用。

slots.default: PromptAction 的文本内容。
slots.icon: PromptAction 的图标。
slots.suffix: PromptAction 的尾部内容。
]]]
[[[api en
label: The text of PromptAction.
disabled: Whether PromptAction is disabled.

slots.default: The text content of PromptAction.
slots.icon: The icon of PromptAction.
slots.suffix: The trailing content of PromptAction.
]]]

[[[api prompt-switch zh
label: PromptSwitch 的文本。
disabled: PromptSwitch 是否禁用。
modelValue: 受控模式下的激活状态。
defaultValue: 非受控模式下初始的激活状态。
showClose: 激活时是否展示关闭入口。

events.update:modelValue: 激活状态变化时触发。

slots.default: PromptSwitch 的文本内容。
slots.icon: PromptSwitch 的图标。
]]]
[[[api prompt-switch en
label: The text of PromptSwitch.
disabled: Whether PromptSwitch is disabled.
modelValue: The active state in controlled mode.
defaultValue: The initial active state in uncontrolled mode.
showClose: Whether the close entry is shown while it is active.

events.update:modelValue: Triggered when the active state changes.

slots.default: The text content of PromptSwitch.
slots.icon: The icon of PromptSwitch.
]]]

[[[api prompt-select zh
disabled: PromptSelect 是否禁用。
options: 下拉列表的数据。
modelValue: 受控模式下的选中值。
defaultValue: 非受控模式下初始的选中值。
caretDuration: 下拉指示箭头动画的时长。
dropdownProps: 下拉弹出层的属性与事件。

events.update:modelValue: 选中值变化时触发。
events.open: 下拉列表展开时触发。
events.close: 下拉列表关闭时触发。
events.select: 在下拉列表中选择一项时触发。

slots.default: PromptSelect 的文本内容。
slots.icon: PromptSelect 的图标。
slots.option: 下拉列表中选项的内容。
slots.group-label: 下拉列表中分组标题的内容。

promptSelectExpose.open: 展开下拉列表。
promptSelectExpose.close: 关闭下拉列表。
]]]
[[[api prompt-select en
disabled: Whether PromptSelect is disabled.
options: The data of the dropdown list.
modelValue: The selected value in controlled mode.
defaultValue: The initial selected value in uncontrolled mode.
caretDuration: The duration of the animation of the dropdown caret.
dropdownProps: The properties and events of the dropdown popup.

events.update:modelValue: Triggered when the selected value changes.
events.open: Triggered when the dropdown list opens.
events.close: Triggered when the dropdown list closes.
events.select: Triggered when an option is chosen from the dropdown list.

slots.default: The text content of PromptSelect.
slots.icon: The icon of PromptSelect.
slots.option: The content of an option in the dropdown list.
slots.group-label: The content of a group label in the dropdown list.

promptSelectExpose.open: Opens the dropdown list.
promptSelectExpose.close: Closes the dropdown list.
]]]

### PromptSelectOption

```ts
export interface PromptSelectOption extends OptionListOption {}

export interface PromptSelectGroupOption extends OptionListGroupOption {
	children: (PromptSelectOption | string)[]
}
```

[[[slice option-list]]]

[[[slice group-option]]]

[[[slice emit-event]]]

[[[slice rest-attrs]]]
