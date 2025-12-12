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
  - 新增视觉组件文本描边 TextOutline。
- 调整：
  - ⚠️需要注意⚠️ `'default'` 的 `shape` 属性重命名为 `'rect'`，旧有组件中的 `'default'` 依然生效。
  - ⚠️需要注意⚠️ ButtonGroup 增加 `theme` 属性，现在 ButtonGroup 和 Button 会将来自上级组件（例如 Form）注入的 `readonly` 属性作为 `disabled` 处理。
  - ⚠️需要注意⚠️ 部分组件内部 `size`、`variant`、`theme`、`shape` 的默认值实现方法发生变动，从 `withDefaults` 变为 `computed`，以适应嵌套组件属性优先级影响的实现。
  - ⚠️需要注意⚠️ 按需导入图标时，将不会自动导入组件库公共样式。
- 优化：
  - Select 组件增加 `label` 插槽。
  - InputGroup 增加 `readonly` 属性。
  - 优化弧线绘制算法。
  - 选项组的子选项增加缩进。
  - 优化 Select 组件的 `focus` 和 `blur` 事件触发。
  - 各种下拉和弹窗组件增加属性控制是否在隐藏时销毁内容。
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
  - Add a utility function `pixelate` for image pixelation.
  - Added visual component TextOutline for text stroke effect.
- Adjustment:
  - ⚠️ Note ⚠️ The `shape` property `'default'` is renamed to `'rect'`, `'default'` in existing components remains valid.
  - ⚠️ Note ⚠️ ButtonGroup now has a `theme` property, and both ButtonGroup and Button treat `readonly` property injected from ancestor components (e.g., Form) as `disabled`.
  - ⚠️ Note ⚠️ Default value implementation for `size`, `variant`, `theme`, `shape` in some components changed from `withDefaults` to `computed` to support nested component property priority.
  - ⚠️ Note ⚠️ When importing icons on demand, component library common styles will no longer be automatically imported.
- Optimizations:
  - Add `label` slot to the Select component.
  - Add `readonly` property to InputGroup.
  - Optimize the arc drawing algorithm.
  - Add indentation to sub-options of option groups.
  - Optimize the triggering of `focus` and `blur` events for the Select component.
  - Add a prop to dropdown and popup components to control whether content is destroyed when hidden.
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