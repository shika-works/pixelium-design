[[[zh
# 更新日志
]]]
[[[en
# Changelog
]]]

[[[zh
## v0.0.3
- 新增：
  - 支持切换像素宽度，支持 2px 和 4px。
  - 完善表单组件：Form、FormItem、Switch、Slider、Radio、RadioGroup、Checkbox、CheckboxGroup。
  - 新增图片展示组件 Image 和头像组件 Avatar。
  - 新增虚拟列表组件 VirtualList。
  - 新增图片像素化工具函数 `pixelate`。
- 优化：
  - Select 组件增加 `label` 插槽。
  - InputGroup 增加 `readonly` 属性。
  - 优化弧线绘制算法。
  - 选项组的子选项增加缩进。
  - 优化 Select 组件的 `focus` 和 `blur` 事件触发。
  - 优化代码 & 完善测试用例。
- 修复：
  - 修复 `variant="text"` 的 Button 组件在 ButtonGroup 和 InputGroup 下的渲染。
  - 修复表单控件 `focus` 和 `blur` 事件没有 emit 的问题。
  - 下拉选项设置 `tabindex`。
]]]
[[[en
## v0.0.3
- New features:
  - Support switching pixel widths, supporting 2px and 4px.
  - Improve form components: Form, FormItem, Switch, Slider, Radio, RadioGroup, Checkbox, CheckboxGroup.
  - Add image display component Image and avatar component Avatar.
  - Add virtual list component VirtualList.
  - Add a utility function `pixelate` for image pixelation
- Optimizations:
  - Add `label` slot to the Select component.
  - Add `readonly` property to InputGroup.
  - Optimize the arc drawing algorithm.
  - Add indentation to sub-options of option groups.
  - Optimize the triggering of `focus` and `blur` events for the Select component.
  - Optimize code & improve test cases.
- Fixes:
  - Fix the rendering of Button components with `variant="text"` in ButtonGroup and InputGroup.
  - Fix the bug where the `focus` and `blur` events of form controls are not being emitted.
  - Set `tabindex` for dropdown options.
]]]


[[[zh
## v0.0.2
- 新增组件: Input、InputNumber、Textarea、InputGroup、Input、GroupLabel、Tag、InputTag、Tooltip、Popover、Empty、AutoComplete、Mask、Spin、Select。
- 加入图标库 pixelarticons。
- 优化代码。
]]]

[[[en
## v0.0.2
- New components added: Input, InputNumber, Textarea, InputGroup, Input, GroupLabel, Tag, InputTag, Tooltip, Popover, Empty, AutoComplete, Mask, Spin, Select.
- Integrated the pixelarticons icon library.
- Code optimization.
]]]