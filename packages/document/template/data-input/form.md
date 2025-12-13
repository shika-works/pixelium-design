[[[zh
# 表单 Form
用于收集信息。
]]]

[[[en
# Form
Used to collect information.
]]]

[[[zh
## 基础使用

Form 用 `model` 传入表单数据对象，在 `rules` 中传入校验规则；FormItem 中 `field`  设置表单项字段，用于表单校验、重置等操作。

> FormItem 的 `rule` 会覆盖 Form 的 `rules` 中相同 `field` 的规则定义。

> 当通过 Form 组件的 `validate` 方法手动触发表单校验时，组件将忽略 `rules` 或 `rule` 上配置的 `trigger` 条件，对所有存在的 FormItem 执行校验，并在遇到第一条不满足的规则时立即返回校验结果。

> 此外，需要注意的是，FormItem 的 `field` 不具有响应式。
]]]
[[[en
## Basic usage

Form uses `model` to pass the form data object and `rules` to pass validation rules; in FormItem, `field` sets the form item field for validation, reset, and other operations.

> FormItem's `rule` takes precedence over Form's `rules` for the same `field`.

> When manually triggering validation using the Form component's `validate` method, it ignores the `trigger` condition configured on `rules` or `rule`, validates all existing FormItems, and stops at the first failing rule.

> Additionally, note that the `field` property of FormItem is not reactive.
]]]
<preview path="./form-basic.vue"></preview>

[[[zh
## Hook 语法

`useForm` 会返回一个用于操作表单的对象，传入 Form 的 `form` 中即可。

> Form 的 `model` 和 `form` 属性必须传入其一。
]]]
[[[en
`useForm` returns an object for manipulating the form, which can be passed to the Form's `form` property.

> Either the `model` or `form` property of Form must be provided.
]]]
<preview path="./form-hook.vue"></preview>

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

> 表单组件 Form 的 `disabled` 或 `readonly` 属性会作用于其内部的所有按钮组件（包括 Button、ButtonGroup）以及各个 FormItem 内部的数据输入组件；而单个 FormItem 的 `disabled` 或 `readonly` 属性则仅影响该表单项内部的按钮组件和数据输入组件。

> Form、FormItem 和其内部的按钮组和数据输入组件，这两个属性采用"或"逻辑，即任一被设为禁用或只读状态，其子树组件（或其自身）便会相应生效。
]]]
[[[en
## Disabled & Readonly

Set the form's disabled state using `disabled` and the readonly state using `readonly`.

> The `disabled` or `readonly` attribute of the Form component affects all button components within it (including Button and ButtonGroup) and the data input components within each FormItem, while the `disabled` or `readonly` attribute of an individual FormItem only affects the button and data input components within that specific FormItem.

> These two properties follow an 'OR' logic throughout the component hierarchy: if any level—Form, FormItem, or the component itself—is set to disabled or readonly, the component will be rendered in that state.
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

> 表单组件 Form 的 `size` 属性会作用于其内部的所有按钮组件（包括 Button、ButtonGroup）以及各个 FormItem 内部的数据输入组件。

> Form、FormItem 内部的按钮组和数据输入组件，`size` 属性如果没有传入或为 `undefined`，则设置为与 Form 的 `size` 属性相同，如果设置，则传入的值优先。
]]]
[[[en
## Form size

The form is available in different sizes.

> The `size` property of the Form component affects all button components within it (including Button and ButtonGroup) and the data input components within each FormItem.

> For button components and data input components inside Form and FormItem, if the `size` property is not provided or is `undefined`, it will be set to match the Form's `size` property; if explicitly set, the provided value takes precedence.
]]]
<preview path="./form-label-size.vue"></preview>

## API

### useForm
```ts
function useForm<T extends Record<string | number, any> = Record<string | number, any>>(options?: {
    initialValues?: T;
}): UseFormReturn<T>

export interface UseFormReturn<
	T extends Record<string | number, any> = Record<string | number, any>
> {
	model: Ref<T>
	validate: (field?: string | string[]) => FormValidateResult
	reset: (field?: string | string[]) => void
	clearValidation: (field?: string | string[]) => void
	register: (registerOptions: UseFormRegisterOptions) => void
}
```

[[[api zh
model: 表单数据对象。`form` 和 `model` 必须传入其一。
form: `useForm` 返回的表单对象，用于以 hook 的形式操作表单。`form` 和 `model` 必须传入其一。
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

useFormReturn.model: 表单数据对象。
useFormReturn.validate: 手动触发表单验证，无参数时验证所有字段，Form 挂载后方可调用。
useFormReturn.reset: 手动触发表单重置，无参数时验证所有字段，Form 挂载后方可调用。
useFormReturn.clearValidation: 清除表单验证状态，无参数时清除所有字段，Form 挂载后方可调用。
]]]

[[[api form-item zh
field: 关联的表单字段名，支持字段路径的形式，例如 `'user[0].info.name'`。该属性不具有响应式。
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
model: The form data object. Either `form` or `model` must be provided.
form: Form object returned by `useForm`, used to manipulate the form via a hook. Either `form` or `model` must be provided.
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

useFormReturn.model: The form data object.
useFormReturn.validate: Manually triggers form validation. Validates all fields when no parameters are provided. Can only be called after the Form is mounted.
useFormReturn.reset: Manually triggers form reset. Resets all fields when no parameters are provided. Can only be called after the Form is mounted.
useFormReturn.clearValidation: Clears the form validation status. Clears validation for all fields when no parameters are provided. Can only be called after the Form is mounted.
]]]

[[[api form-item en
field: The associated form field name. Supports field path syntax, e.g. `'user[0].info.name'`. This property is not reactive.
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
