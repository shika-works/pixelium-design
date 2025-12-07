[[[zh
# 表单 Form
用于收集信息。

> 表单组件 Form 的 `size`、`disabled`、`readonly` 属性，会影响子树上的 Button 和 ButtonGroup 组件，以及后代组件 FormItem 子树上的 Input、InputNumber、InputTag、AutoComplete、Select、Textarea、InputGroup、Slider、Switch、Radio、RadioGroup、Checkbox、CheckboxGroup。

> 表单项 FormItem 组件的 `disabled`、`readonly` 会影响子树上的以下组件：
> Input、InputNumber、InputTag、AutoComplete、Select、Textarea、InputGroup、Slider、Switch、Radio、RadioGroup、Checkbox、CheckboxGroup。
]]]

[[[en
# Form
Used to collect information.

> The `size`, `disabled`, and `readonly` properties of the Form component affect Button and ButtonGroup components in its child tree, as well as Input, InputNumber, InputTag, AutoComplete, Select, Textarea, InputGroup, Slider, Switch, Radio, RadioGroup, Checkbox, and CheckboxGroup components in the descendant FormItem subtree.

> The `disabled` and `readonly` properties of the FormItem component affect the following components in its child tree:
> Input, InputNumber, InputTag, AutoComplete, Select, Textarea, InputGroup, Slider, Switch, Radio, RadioGroup, Checkbox, CheckboxGroup.
]]]

[[[zh
## 基础使用

一个表单校验的例子。
]]]
[[[en
## Basic usage

An example of form validation.
]]]
<preview path="./form-basic.vue"></preview>

[[[zh
## 自定义校验

使用 `validator` 自定义表单校验条件。
]]]
[[[en
## Custom validation

Use `validator` to provide custom validation rules.
]]]
<preview path="./form-validator.vue"></preview>

[[[zh
## 禁用 & 只读

通过 `disabled` 设置表单禁用状态，通过 `readonly` 设置表单只读状态。
]]]
[[[en
## Disabled & Readonly

Set the form's disabled state using `disabled` and the readonly state using `readonly`.
]]]
<preview path="./form-disabled.vue"></preview>

[[[zh
## 标签对齐

通过 `labelAlign` 设置标签对齐方向
]]]
[[[en
## Label alignment

Set label alignment with `labelAlign`.
]]]
<preview path="./form-label-align.vue"></preview>

[[[zh
## 子元素宽度

通过 `labelProps` 和 `contentProps` 修改标签和内容区域的 Col 组件属性。

设置 `labelAutoWidth` 标签区域宽度会进行自适应，内容区域宽度也会一同变化。
]]]
[[[en
## Child element width

Use `labelProps` and `contentProps` to modify the Col component props for the label and content areas.

When `labelAutoWidth` is set, the label area width becomes adaptive and the content area width will change accordingly.
]]]
<preview path="./form-label-width.vue"></preview>

[[[zh
## 表单尺寸

表单有不同的大小。
]]]
[[[en
## Form size

The form is available in different sizes.
]]]
<preview path="./form-label-size.vue"></preview>

## API

[[[api zh
model: 表单数据对象。
rules: 验证规则。
disabled: 是否禁用。
readonly: 是否只读。
size: 表单尺寸。
labelAlign: 标签的对齐方式。
showAsterisk: 是否展示星号。
asteriskPlacement: 星号的位置。
rowProps: 表单项行容器的属性。
labelProps: 表单项标签列的属性。
contentProps: 表单项内容列的属性。
labelAutoWidth: 表单项标签宽度自适应。

events.submit: 表单触发原生的提交时的回调。
events.reset: 表单触发原生的重置时触发的回调。
events.validate: 表单验证时触发的回调。

slots.default: 用于渲染表单项。

formExpose.validate: 手动触发表单验证，无参数时验证所有字段。
formExpose.reset: 手动触发表单重置，无参数时重置所有字段。
formExpose.clearValidation: 清除表单验证状态，无参数时清除所有字段。

ruleItem.required: 是否为必填字段。
ruleItem.message: 验证失败时的提示信息，为空字符串时不会触发错误。
ruleItem.trigger: 触发验证的事件。
ruleItem.type: 字段类型校验。
ruleItem.max: 最大值限制，仅对数字值有效。
ruleItem.min: 最小值限制，仅对数字值有效。
ruleItem.maxLength: 最大长度限制，仅当值为字符串或数组时有效。
ruleItem.minLength: 最小长度限制，仅当值为字符串或数组时有效。
ruleItem.email: 是否为邮箱地址，仅当值为字符串时有效。
ruleItem.url: 是否为 URL，仅当值为字符串时有效。
ruleItem.numberString: 是否为数字字符串，仅当值为字符串时有效。
ruleItem.level: 验证失败的级别，只有 `'error'` 等级才会使表单校验失败。
ruleItem.validator: 自定义验证函数，返回错误提示字符串，返回空值则为校验成功。
]]]

[[[api form-item zh
field: 关联的表单字段名，支持字段路径的形式，例如 `'user[0].info.name'`。
label: 标签文本。
rule: 验证规则。
disabled: 是否禁用，和 Form 中的 `disabled` 取或运算决定最终是否禁用。
readonly: 是否只读，和 Form 中的 `readonly` 取或运算决定最终是否只读。
labelAlign: 标签的对齐方式。
showAsterisk: 是否展示星号。
asteriskPlacement: 星号的位置。
rowProps: 表单项行容器的属性。
labelProps: 表单项标签列的属性。
contentProps: 表单项内容列的属性。

slots.tip: 验证提示。
slots.extra: 额外内容插槽，位于内容区域下方。
slots.label: 自定义标签。
slots.default: 表单项内容插槽。
]]]

[[[api en
model: The form data object.
rules: Validation rules.
disabled: Whether the form is disabled.
readonly: Whether the form is read-only.
size: Form size.
labelAlign: Label alignment.
showAsterisk: Whether to show an asterisk.
asteriskPlacement: Position of the asterisk.
rowProps: Props for the form item row container.
labelProps: Props for the form item's label column.
contentProps: Props for the form item's content column.
labelAutoWidth: Enable auto width for form item labels.

events.submit: Callback for native form submit.
events.reset: Callback for native form reset.
events.validate: Callback fired when validation occurs.

slots.default: Used to render form items.

formExpose.validate: Manually trigger form validation; without arguments validates all fields.
formExpose.reset: Manually trigger form reset; without arguments resets all fields.
formExpose.clearValidation: Clear validation state; without arguments clears all fields.

ruleItem.required: Whether the field is required.
ruleItem.message: Error message shown on validation failure; an empty string will not trigger an error.
ruleItem.trigger: Event that triggers validation.
ruleItem.type: Field type validation.
ruleItem.max: Maximum value limit, only for numeric values.
ruleItem.min: Minimum value limit, only for numeric values.
ruleItem.maxLength: Maximum length limit, applicable when the value is a string or array.
ruleItem.minLength: Minimum length limit, applicable when the value is a string or array.
ruleItem.email: Whether the value must be an email address (applies when value is a string).
ruleItem.url: Whether the value must be a URL (applies when value is a string).
ruleItem.numberString: Whether the value must be a numeric string (applies when value is a string).
ruleItem.level: Failure level; only `'error'` will cause the form validation to fail.
ruleItem.validator: Custom validation function that returns an error message string; a falsy/empty return indicates success.
]]]

[[[api form-item en
field: The associated form field name. Supports field path syntax, e.g. `'user[0].info.name'`.
label: Label text.
rule: Validation rules.
disabled: Whether to disable. The final disabled state is determined by OR operation with `disabled` from Form.
readonly: Whether to be read-only. The final read-only state is determined by OR operation with `readonly` from Form.
labelAlign: Label alignment for this item.
showAsterisk: Whether to show an asterisk.
asteriskPlacement: Position of the asterisk.
rowProps: Props for the form item's row container.
labelProps: Props for the form item's label column.
contentProps: Props for the form item's content column.

slots.tip: Validation tip slot.
slots.extra: Extra content slot located below the content area.
slots.label: Custom label slot.
slots.default: Form item content slot.
]]]

### RuleLevel, FieldType, RuleTrigger, FormValidateResult
```ts
export type RuleLevel = 'error' | 'warning' | 'success' | 'normal'
export type FieldType = 'number' | 'string' | 'boolean' | 'array' | 'dict' | 'function' | 'date'
export type RuleTrigger = 'blur' | 'change' | 'input'

export type FormValidateResult = Promise<{
	isValid: boolean
	results: Record<
		string,
		PromiseSettledResult<{
			message: string
			level: RuleLevel
		}>
	>
}>
```