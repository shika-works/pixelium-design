[[[zh
# 更新日志
]]]
[[[en
# Changelog
]]]

[[[zh
## v0.1.0

- 新增：
  - 新增反馈组件：Dialog、Popconfirm、Badge、Alert、Progress。
  - 新增菜单：Menu、MenuItem、Submenu、MenuGroup。
  - 新增其他导航组件：BackTop、DropDown。
  - Tooltip 和 Popover 新增 `cascade` 属性，以维持嵌套浮窗的展示。
  - 新增多语言国际化模块，可以通过入口文件导出的 `locale` 调整对话框和确认弹出框的文本语言。
  - Link 新增属性 `variant` 取值为 `'normal'` 和 `'underline'`（默认），控制是否展示下划线。
- 调整：
  - ⚠️需要注意⚠️ 为更方便地使用高阶组件，受限于 Vue 的机制，Row 与 Col、Container 与 Aside、Grid 与 GridItem、ButtonGroup 与 Button、InputGroup 与各数据输入组件等配对组件，接收对应的 `provide` 数据时，现在对直接的亲代组件的类型不再做严格要求。
  - ButtonGroup 的 `shape` 增加可选值 `square` 和 `circle`，并且移除默认值。`square` 和 `circle` 时，Button 子组件的在视觉上长和宽相等。此处变更不会影响旧代码，因为 ButtonGroup 的 `shape` 默认值不存在时，时，Button 子组件也会采取 `rect` 的默认值。
- 优化：
  - 给传入内部组件 props 的属性提供了更详细的类型声明。
  - 优化代码 & 完善测试用例。
  - 为大部分含有 canvas 的组件增加 `pollSizeChange` 属性，用于轮询尺寸变化更新渲染。
- 修复：
  - 修复在微任务中快速切换按钮 `loading` 状态时 canvas 渲染异常。
  - 修复在按钮 `size="small"` 时字体大小异常的问题。
  - 修复输入组件在 FormItem 中横向延申异常的问题。
]]]
[[[en
## v0.1.0

- New Features:
  - Added feedback components: Dialog, Popconfirm, Badge, Alert, Progress.
  - Added menu components: Menu, MenuItem, Submenu, MenuGroup.
  - Added additional navigation component: BackTop, DropDown.
  - Added the `cascade` property to Tooltip and Popover to maintain the display of nested floating windows.
  - Added multi-language internationalization module; text language for dialogs and confirmation popups can be adjusted via the exported `locale` from the entry file.
  - Added a new `variant` property to Link with values `'normal'` and `'underline'` (default), controlling whether to display the `'underline'`.
- Adjustment:
  - ⚠️ Note ⚠️ To facilitate the use of higher-order components and due to limitations in Vue's mechanism, paired components such as Row and Col, Container and Aside, Grid and GridItem, ButtonGroup and Button, InputGroup and various data input components, etc., when receiving corresponding `provide` data, will now no longer strictly require the type of the immediate parent component.
  - The `shape` property of ButtonGroup now accepts two additional optional values: `square` and `circle`, and its default value has been removed. When set to `square` or `circle`, the child Button components will visually have equal height and width. This change will not affect existing code, as child Button components will default to using `rect` when no `shape` value is provided for the ButtonGroup.
- Optimizations:
  - Provided more detailed type declarations for properties passed as props to internal components.
  - Optimized code & improved test coverage.
  - Added the `pollSizeChange` property to most components containing canvas for polling size changes to update rendering.
- Fixes:
  - Fixed abnormal canvas rendering when toggling the button `loading` state rapidly within micro tasks.
  - Fix the font size issue when button's size is `'small'`.
  - Fixed the abnormal horizontal extension of input components within a FormItem.
]]]

[[[zh
## v0.0.4

> hotfix

- 修复：
  - 优化了输入控件错误触发键盘操作提示边框的问题，优化了相关样式，后续会使用更合理的机制处理这一逻辑。
]]]

[[[en
## v0.0.4

> hotfix

- Fixes:
  - Optimized the issue where input controls incorrectly triggered keyboard operation hint borders. Related styles have been improved. A more reasonable mechanism will be used to handle this logic in the future.
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
  - 加入了 modern-normalize 的预设样式可供导入。
- 调整：
  - ⚠️需要注意⚠️ `'default'` 的 `shape` 属性重命名为 `'rect'`，旧有组件中的 `'default'` 依然生效。
  - ⚠️需要注意⚠️ ButtonGroup 增加 `theme` 属性，现在 ButtonGroup 和 Button 会将来自上级组件（例如 Form）注入的 `readonly` 属性作为 `disabled` 处理。
  - ⚠️需要注意⚠️ 部分组件内部 `size`、`variant`、`theme`、`shape` 的默认值实现方法发生变动，从 `withDefaults` 变为 `computed`，以适应嵌套组件属性优先级影响的实现。
  - ⚠️需要注意⚠️ 按需导入图标时，将不会自动导入组件库公共样式。
- 优化：
  - Select 组件增加 `label` 插槽。
  - InputGroup 增加 `readonly` 属性。
  - Main 组件增加 `soft` 属性设置柔和背景。
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
  - Added importable modern-normalize preset styles
- Adjustment:
  - ⚠️ Note ⚠️ The `shape` property `'default'` is renamed to `'rect'`, `'default'` in existing components remains valid.
  - ⚠️ Note ⚠️ ButtonGroup now has a `theme` property, and both ButtonGroup and Button treat `readonly` property injected from ancestor components (e.g., Form) as `disabled`.
  - ⚠️ Note ⚠️ Default value implementation for `size`, `variant`, `theme`, `shape` in some components changed from `withDefaults` to `computed` to support nested component property priority.
  - ⚠️ Note ⚠️ When importing icons on demand, component library common styles will no longer be automatically imported.
- Optimizations:
  - Add `label` slot to the Select component.
  - Add `readonly` property to InputGroup.
  - Add the `soft` property to the Main component to set a soft background.
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