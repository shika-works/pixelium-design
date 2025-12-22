[[[zh
# 加载 Spin

正在加载...
]]]
[[[en
# Loading Spin

Loading...
]]]

[[[zh
## 基础使用

用 Spin 组件包裹要加载的内容。`loading` 属性设置加载状态。
]]]
[[[en
## Basic Usage

Wrap the content to be loaded with the Spin component. The `loading` property sets the loading state.
]]]
<preview path="./spin-basic.vue"></preview>

[[[zh
## 单独使用

单独使用时仅展示加载图标。
]]]
[[[en
## Standalone Usage

When used alone, only the loading icon is displayed.
]]]
<preview path="./spin-separately.vue"></preview>

[[[zh
## 图标尺寸

图标有不同尺寸。
]]]
[[[en
## Icon Size

Icons come in different sizes.
]]]
<preview path="./spin-size.vue"></preview>

[[[zh
## 换个图标

`icon` 插槽修改图标。
]]]
[[[en
## Change Icon

Use the `icon` slot to change the icon.
]]]
<preview path="./spin-icon.vue"></preview>

[[[zh
## 添加描述

使用 `description` 插槽，你也可以添加加载中的描述。
]]]
[[[en
## Add Description

Use the `description` slot to add a loading description.
]]]
<preview path="./spin-desc.vue"></preview>

## API
[[[api zh
loading: 加载状态，单独使用 Spin 时默认 `true`，包裹内容时默认 `false`。
size: 图标尺寸。
maskColor: <Badge type="warning" text="Deprecated" /> 遮罩层 Mask 组件颜色。
maskStep: <Badge type="warning" text="Deprecated" /> 遮罩层 Mask 组件网格间隔。
maskLineWidth: <Badge type="warning" text="Deprecated" /> 遮罩层 Mask 组件线条尺寸。
maskGrid: <Badge type="warning" text="Deprecated" /> 遮罩层 Mask 组件是否为网格背景。
maskProps: 遮罩层的属性。
zIndex: 包裹内容时，加载状态呈现的覆盖层的 `z-index`。
slots.default: Spin 包裹的内容。
slots.icon: Spin 的图标。
slots.description: Spin 加载时的描述。
]]]
[[[api en
loading: Loading state. Defaults to `true` when Spin is used alone, and `false` when wrapping content.
size: Icon size.
maskProps: Properties of mask.
maskColor: <Badge type="warning" text="Deprecated" /> Mask component color.
maskStep: <Badge type="warning" text="Deprecated" /> Grid spacing of the Mask component.
maskLineWidth: <Badge type="warning" text="Deprecated" /> Line width of the Mask component.
maskGrid: <Badge type="warning" text="Deprecated" /> Whether the Mask component has a grid background.
zIndex: `z-index` of the overlay when wrapping content.
slots.default: Content wrapped by Spin.
slots.icon: Icon for Spin.
slots.description: Description during Spin loading.
]]]

### RestAttrs

```ts
export type VueClassValue = string | Record<string, any> | VueClassValue[]

export type RestAttrs = {
	style?: StyleValue | null
	class?: VueClassValue | null
	[x: string]: any
}
```