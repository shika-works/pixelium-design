[[[zh
# 受控模式和非受控模式

对于一般的支持双向绑定的组件而言，传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。

所以，请不要把 `undefined` 作为受控模式的空值，我们推荐使用相应数据结构的空值（例如字符串的 `''`，数组的 `[]`）或者  `null` 作为受控模式的空值。

满足以下形式的组件属性同理：
1. 支持 `v-model` 的 `xxx`
2. 拥有 `defaultXxx` 作为默认值 
]]]

[[[en
# Controlled Mode and Uncontrolled Mode

For general components that support two-way binding, passing `modelValue` puts them into controlled mode. If not passed or set to `undefined`, they are in uncontrolled mode, where the `defaultValue` property can be passed as the default value.

Therefore, please do not use `undefined` as the empty value in controlled mode. We recommend using empty values corresponding to the data structure (such as `''` for strings, `[]` for arrays) or `null` as the empty value in controlled mode.

The same applies to component properties in the following forms:
1. `xxx` that supports `v-model`
2. Having `defaultXxx` as the default value
]]]