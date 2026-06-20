[[[zh
# 颜色解析支持的格式

一些组件可接收传入的颜色字符串并解析，用于生成色板或 canvas 绘制，目前组件库支持解析以下颜色格式。

| 格式 | 示例 | 说明 |
|------|------|------|
| 十六进制（HEX） | `#f00`<br>`#ff0000`<br>`#ff0000ff`<br>`#f00f` | 支持 3、4、6、8 位十六进制表示。 |
| `rgb()` / `rgba()` | `rgb(255, 0, 0)`<br>`rgba(255, 0, 0, 0.5)`<br>`rgb(255, 0, 0, 0.5)` | R、G、B 分量取值范围 0–255。<br>Alpha 值取值范围 0–1。 |
| `hsl()` / `hsla()` | `hsl(0, 100%, 50%)`<br>`hsla(0, 100%, 50%, 0.5)`<br>`hsl(0, 100%, 50%, 0.5)` | 色相（Hue）0–359，饱和度（Saturation）与亮度（Lightness）为百分比。<br>Alpha 值取值范围 0–1。 |
| `hsv()` / `hsva()` | `hsv(0, 100%, 100%)`<br>`hsva(0, 100%, 100%, 0.5)`<br>`hsv(0, 100%, 100%, 0.5)` | 色相 0–359，饱和度与明度（Value）为百分比。<br>Alpha 值取值范围 0–1。 |
| `hwb()` / `hwba()` | `hwb(0, 0%, 0%)`<br>`hwba(0, 0%, 0%, 0.5)`<br>`hwb(0, 0%, 0%, 0.5)` | HWB 颜色空间，色相 0–359，白度（Whiteness）与黑度（Blackness）为百分比。<br>白度 + 黑度不超过 100%。<br>Alpha 值取值范围 0–1。 |

> 解析颜色允许包含多余空格。
]]]

[[[en
# Supported Color Formats for Parsing

Some components can receive and parse incoming color strings, which are then used to generate color swatches or for canvas drawing. The current component library supports parsing the following color formats.

| Format | Example | Description |
|--------|---------|-------------|
| Hexadecimal (HEX) | `#f00`<br>`#ff0000`<br>`#ff0000ff`<br>`#f00f` | Supports 3, 4, 6, and 8-digit hexadecimal notation. |
| `rgb()` / `rgba()` | `rgb(255, 0, 0)`<br>`rgba(255, 0, 0, 0.5)`<br>`rgb(255, 0, 0, 0.5)` | R, G, B components range from 0–255.<br>Alpha value ranges from 0–1. |
| `hsl()` / `hsla()` | `hsl(0, 100%, 50%)`<br>`hsla(0, 100%, 50%, 0.5)`<br>`hsl(0, 100%, 50%, 0.5)` | Hue: 0–359, Saturation and Lightness are percentages.<br>Alpha value ranges from 0–1. |
| `hsv()` / `hsva()` | `hsv(0, 100%, 100%)`<br>`hsva(0, 100%, 100%, 0.5)`<br>`hsv(0, 100%, 100%, 0.5)` | Hue: 0–359, Saturation and Value are percentages.<br>Alpha value ranges from 0–1. |
| `hwb()` / `hwba()` | `hwb(0, 0%, 0%)`<br>`hwba(0, 0%, 0%, 0.5)`<br>`hwb(0, 0%, 0%, 0.5)` | HWB color space. Hue: 0–359, Whiteness and Blackness are percentages.<br>The sum of whiteness and blackness must not exceed 100%.<br>Alpha value ranges from 0–1. |

> Color parsing allows extra spaces.
]]]