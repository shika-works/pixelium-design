[[[zh
# 颜色选择器 ColorPicker

选择一个你喜欢的颜色。

> 考虑到与已选颜色搭配效果不佳，ColorPicker 没有设置 focus 和 hover 的边框效果。
]]]
[[[en
# ColorPicker

Pick a color you like.

> Considering the poor matching effect with the selected color, ColorPicker does not have focus and hover border effects.
]]]

[[[zh
## 基础使用

`modelValue` 是颜色字符串值，`color` 是颜色对象值。这两个值传入至少一个进入受控模式。它们都不传入或者为 `undefined` 则为非受控模式。此时可以传入 `defaultValue` 和 `defaultColor` 属性作为默认值。
]]]
[[[en
## Basic Usage

`modelValue` is a color string value, and `color` is a color object value. Passing at least one of these two values enters controlled mode. If neither is passed or both are `undefined`, it becomes uncontrolled mode. In this case, you can pass the `defaultValue` and `defaultColor` props as default values.
]]]
<preview path="./color-picker-basic.vue"></preview>

[[[zh
## 颜色格式

组件目前支持 RGB、HEX、HSV、HSL、HWB 这几种颜色格式。
]]]
[[[en
## Color Formats

The component currently supports RGB, HEX, HSV, HSL, and HWB color formats.
]]]
<preview path="./color-picker-mode.vue"></preview>

[[[zh
## 显示透明度

组件支持通过 `includeAlpha` 设置颜色是否包含透明度
]]]
[[[en
## Show Opacity

The component supports setting whether the color includes opacity via `includeAlpha`.
]]]
<preview path="./color-picker-alpha.vue"></preview>

[[[zh
## 预设颜色

`preset` 属性提供预设颜色选项。
]]]
[[[en
## Preset Colors

The `preset` prop provides preset color options.
]]]
<preview path="./color-picker-preset.vue"></preview>

[[[zh
## 尺寸、形状
]]]
[[[en
## Size and Shape
]]]
<preview path="./color-picker-size.vue"></preview>

[[[zh
## 图表展示
]]]
[[[en
## Icon Display
]]]
<preview path="./color-picker-icon.vue"></preview>

[[[zh
## 更多配置
ColorPicker 还拥有 Input 组件的一些特性。
]]]
[[[en
## More Configurations

ColorPicker also has some features of the Input component.
]]]
<preview path="./color-picker-more.vue"></preview>

## API

[[[api zh
modelValue: 颜色选择器的字符串值（受控模式），支持 `v-model`。
defaultValue: 颜色选择器字符串值的默认值（非受控模式）。
color: 颜色选择器的对象值（受控模式），支持 `v-model`。
defaultColor: 颜色选择器字符串值的对象值（非受控模式）。
mode: 颜色选择器的颜色格式。
includeAlpha: 是否包含 alpha 透明度。
preset: 预设颜色。
disabled: 是否禁用。
readonly: 是否只读。
size: 自动填充输入框尺寸。
shape: 自动填充输入框形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
status: 表单验证状态。
autofocus: 原生 `<input>` 的 `autofocus` 属性。
dropdownDestroyOnHide: 下拉面板是否会在隐藏时销毁。
pollSizeChange: 开启轮询组件尺寸变化，可能会影响性能，常用于被容器元素影响尺寸，进而 canvas 绘制异常的情况。
dropdownProps: 下拉选择面板的属性。
showIcon: 是否展示图标。

events.update:modelValue: 更新 `modelValue` 的回调。
events.update:color: 更新 `color` 的回调。
events.change: 颜色变化时的回调。
events.blur: 自动填充输入框失焦时的回调。
events.focus: 自动填充输入框聚焦时的回调。
events.dropdownOpen: 下拉面板展示的回调。
events.dropdownClose: 下拉面板关闭的回调。

colorPickerExpose.focus: 聚焦当前控件。
colorPickerExpose.blur: 取消聚焦当前控件。
]]]
[[[en
[[[api en
modelValue: The string value of the color picker (controlled mode), supports `v-model`.
defaultValue: The default string value of the color picker (uncontrolled mode).
color: The object value of the color picker (controlled mode), supports `v-model`.
defaultColor: The default object value of the color picker (uncontrolled mode).
mode: The color format of the color picker.
includeAlpha: Whether to include alpha transparency.
preset: Preset colors.
disabled: Whether it is disabled.
readonly: Whether it is read-only.
size: Auto-fill input size.
shape: Auto-fill input shape.
borderRadius: Border radius, higher priority than `shape`, consistent with CSS `border-radius` behavior; single value or array of length 1 → all four corners take effect simultaneously; array of length 2 → [top-left & bottom-right, top-right & bottom-left]; array of length 3 → [top-left, top-right & bottom-left, bottom-right]; array of length 4 → applied clockwise to each corner.
status: Form validation status.
autofocus: Native `<input>` `autofocus` attribute.
dropdownDestroyOnHide: Whether the dropdown panel is destroyed when hidden.
pollSizeChange: Enable polling for component size changes, may affect performance, commonly used when the component's size is affected by container elements, leading to canvas rendering issues.
dropdownProps: Properties of the dropdown selection panel.
showIcon: Whether to display the icon.

events.update:modelValue: Callback for updating `modelValue`.
events.update:color: Callback for updating `color`.
events.change: Callback when the color changes.
events.blur: Callback when the auto-fill input loses focus.
events.focus: Callback when the auto-fill input gains focus.
events.dropdownOpen: Callback when the dropdown panel is shown.
events.dropdownClose: Callback when the dropdown panel is closed.

colorPickerExpose.focus: Focus the current control.
colorPickerExpose.blur: Blur the current control.
]]]
]]]

### ColorValue, ColorWithModel
```ts
export type ColorValue = {
	format: 'rgb' | 'hsv' | 'hsl' | 'hwb'
	color: RgbaColor | HslaColor | HsvaColor | HwbaColor
}

export type ColorWithModel = {
	rgb: RgbaColor
	hsl: HslaColor
	hwb: HwbaColor
	hsv: HsvaColor
}

export type RgbaColor = { r: number; g: number; b: number; a: number }
export type HsvaColor = { h: number; s: number; v: number; a: number }
export type HslaColor = { h: number; s: number; l: number; a: number }
export type HwbaColor = { h: number; w: number; b: number; a: number }
```

[[[slice emit-event]]]
[[[slice percent]]]