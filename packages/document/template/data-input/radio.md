radio.md
[[[zh

# 单选框 Radio

这个组件叫做 Radio......
]]]
[[[en

# Switch Component

This component is called Radio. It sounds just like a certain game console - makes me want to play so bad......
Radio
]]]

[[[zhRadio

## 基础使用

传入 [modelValue](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L14-L14) 进入受控模式。
]]]
[[[en

## Basic Usage

Pass [modelValue](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L14-L14) to enter controlled mode.
]]]
<preview path="./radio-basic.vue"></preview>

[[[zh

## 禁用

[disabled](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L15-L15) 设置禁用，此时内部 `<input>` 都会被设置 [disabled](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L15-L15)。。
]]]
[[[en

## Disabled

[disabled](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L15-L15) sets disabled status. The internal `<input>` will be set to [disabled](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L15-L15) in both cases.
]]]
<preview path="./radio-disabled.vue"></preview>

[[[zh

## 背景颜色

通过 `activeColor` 设置背景颜色。
]]]
[[[en

## Background Color

Set the background color through `activeColor`.
]]]
<preview path="./radio-back.vue"></preview>

[[[zh

## 单选框组

适用于在多个互斥的选项中选择的场景
]]]
[[[en

## Radio Group

It is applicable to scenarios where multiple mutually exclusive options are selected
]]]
<preview path="./radio-group.vue"></preview>

## API

[[[api radio en
modelValue: The value of the checked (controlled mode), supports `v-model`.
disabled: Whether it is disabled.
activeColor: The label color when selected, supports CSS-like strings such as `'rgb(r, g, b)'` and `'rgba(r, g, b, a)'`, as well as 3, 4, 6, or 8-digit hexadecimal number representations.

events.update:modelValue: Callback for updating [modelValue](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L14-L14).
events.input: Callback when the switch is triggered.
]]]
[[[api radio zh
modelValue: 选中的值（受控模式），支持 `v-model`。
disabled: 是否禁用。
activeColor: 选中时的标签颜色，支持 CSS-like 字符串，如 `'rgb(r, g, b)'` 和 `'rgba(r, g, b, a)'`，以及 3, 4, 6, 或 8 位的十六进制数字表示。

events.update:modelValue: 更新 [modelValue](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L14-L14) 的回调。
events.input: 选中开关的回调。
]]]

[[[api radio-group en
modelValue: The value of the checked (controlled mode), supports `v-model`.
disabled: Whether it is disabled.

events.update:modelValue: Callback for updating [modelValue](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L14-L14).
events.input: Callback when the checked is triggered.
]]]
[[[api radio-group zh
modelValue: 选中的值（受控模式），支持 `v-model`。
disabled: 是否禁用。

events.update:modelValue: 更新 [modelValue](file://c:\文档\开源\pixelium-design\packages\web-vue\lib\radio-group\typs.ts#L14-L14) 的回调。
events.input: 选中的回调。
]]]