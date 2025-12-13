[[[zh
# 像素尺寸
像素点尺寸由全局 CSS 变量 `--px-bit` 控制，默认 4px，目前只支持 2px 和 4px，其他尺寸暂未经过充分测试。

## setPixelSize
你可以在任何地方，不管是入口文件还是业务代码中，通过导出的 `setPixelSize` 函数来修改像素尺寸。
]]]

[[[en
# Pixel Size
The size of pixel points is controlled by the global CSS variable `--px-bit`, with a default of 4px. Currently, only 2px and 4px are supported; other sizes have not been fully tested yet.

## setPixelSize
You can modify the pixel size through the exported `setPixelSize` function anywhere, whether in the entry file or business code.
]]]

```ts
import { setPixelSize } from '@pixelium/web-vue'
// If on-demand import
// import { setPixelSize } from '@pixelium/web-vue/es'

setThemeColor(2) // 2px
```

[[[zh
可以在这里试一下：
]]]
[[[en
You can try it here:
]]]

<preview path="./pixel-basic.vue"></preview>