[[[zh
# 更新日志
]]]
[[[en
# Changelog
]]]

[[[zh
## v0.2.0
- 调整：
  - 收拢了表单输入组件聚焦相关逻辑，优化了可维护性和可读性，并添加相关测试用例。
  - ⚠️需要注意⚠️移除了 Slider 组件标尺和标记的 `tabindex`，只有调节器 thumb 可以聚焦，为 thumb 增加聚焦样式。
]]]
[[[en
## v0.2.0
- Adjustment:
  - Consolidated focus-related logic for form input components, improving maintainability and readability, and added related test cases.
  - ⚠️ Note ⚠️ Removed tabindex from Slider component tick marks and labels; only the slider thumb can receive focus, and focus styles were added to the thumb.
]]]

[[[zh
## v0.1.4
> fix
- 新增：
  - Form 组件新增 `enterSubmit` 属性控制回车是否触发提交，默认 `false`。
- 修复：
  - 修复在存在 `type="submit"` 按钮子组件的情况下，Form 组件按回车会触发提交的问题。
  - 修复 InputTag 按下回车以确认标签输入时，触发浏览器的表单提交的问题。
  - 修复了单独导入 Select 时，Select 组件多选的情况下，浮窗中 Tag 间隔消失的问题。
  - 修复 Select 组件在切换到 multiple 模式时的值处理逻辑，避免空值被错误转换为 `[null]` / `[undefined]`。
]]]
[[[en
## v0.1.4
> fix

- New Features:
  - Added `enterSubmit` property to the Form component to control whether the Enter key triggers submission. Defaults to `false`.
- Fixes:
  - Fixed an issue where the Form component would trigger submission upon pressing Enter when a child component with `type="submit"` was present.
  - Fixed an issue where pressing Enter in InputTag to confirm a tag would trigger the browser's default form submission.
  - Fixed missing margins for Tags in the Select floating overlay in multi-select mode when individual imported.
  - Fixed the Select component’s value handling when switching to multiple mode, preventing empty values from being incorrectly converted to `[null]` / `[undefined]`.
]]]

[[[zh
## v0.1.3
> fix
- 修复：
  - Select 和 AutoComplete 组件的虚拟滚动被意外地移除了。
  - 为以上修复补充测试用例。
]]]
[[[en
## v0.1.3
> fix
- Fixes:
  - The virtual scrolling for Select and AutoComplete components was accidentally removed.
  - Added test coverage for the above fix.
]]]

[[[zh
## v0.1.2
> fix
- 修复：
  - 修复 Textarea 组件在 Form 下无法换行的问题。
  - 修复 Button 组件 `shape="circle"` 和 `shape="square"` 的时候，padding 被错误添加，导致的 `size="small"` 时，宽度异常的问题。
  - 修复 Button 组件作为 ButtonGroup 子组件时，`shape="circle"` 失效的问题。
  - 修复 Button `shape="circle"` 和 `shape="square"` 的时候，在传入 `icon` 插槽或加载状态下，图标和内容一同展示的问题。
  - 为以上修复补充测试用例。
]]]
[[[en
## v0.1.2
> fix
- Fixes:
  - Fixed the issue where Textarea could not wrap in a Form.
  - Fixed the issue where Button with `shape="circle"` and `shape="square"` got incorrect extra padding, causing abnormal width when `size="small"`.
  - Fixed the issue where Button’s `shape="circle"` did not work when the Button was a child of ButtonGroup.
  - Fixed the issue where Button with `shape="circle"` and `shape="square"` displayed both icon and content together when `icon` slot was provided or in loading state.
  - Added test cases for the above fixes.
]]]

[[[zh
## v0.1.1
> hotfix
- 修复：
  - 修复 `MessageFunction` TS 类型丢失了静态方法的问题。
- 调整：
  - 把 mitt 依赖移动到 `"dependencies"` 配置中，并且在打包时视为外部依赖。
]]]
[[[en
## v0.1.1
> hotfix
- Fixes:
  - Fixed the `MessageFunction` TypeScript type missing static methods.
- Adjustment:
  - Moved the `mitt` dependency to the `"dependencies"` configuration and marked it as an external dependency during bundling.
]]]

[[[zh
## v0.1.0

- 新增：
  - 新增 notice 蓝色主题，对应 `'theme'` 和部分反馈组件的 `'type'` 属性的 `'notice'` 取值。
  - 新增反馈组件：Dialog、Popconfirm、Badge、Alert、Progress。
  - 新增导航组件：Menu、MenuItem、Submenu、MenuGroup、BackTop、DropDown、Breadcrumb、BreadcrumbItem、Pagination。
  - Tooltip 和 Popover 新增 `cascade` 属性，以维持嵌套浮窗的展示。
  - 新增多语言国际化模块，可以通过入口文件导出的 `locale` 调整对话框和确认弹出框的文本语言。
  - Link 新增属性 `variant` 取值为 `'normal'` 和 `'underline'`（默认），控制是否展示下划线。
  - VirtualList 新增插槽 `'scroll-container'` 自定义滚动容器，建议配合 `h` 函数或者 JSX 食用。
- 调整：
  - ⚠️需要注意⚠️ 移除形如 --px-primary|success|warning|danger|sakura-light|dark-number 的在项目中实际上未被使用到的 CSS 变量，例如 `--px-warning-light-1`。事实上组件的颜色直接源于 --px-color-light|dark-number 的 CSS 变量，例如：`--px-orange-light-1`。
  - ⚠️需要注意⚠️ 为更方便地使用高阶组件，受限于 Vue 的机制，Row 与 Col、Container 与 Aside、Grid 与 GridItem、ButtonGroup 与 Button、InputGroup 与各数据输入组件等配对组件，接收对应的 `provide` 数据时，现在对直接的亲代组件的类型不再做严格要求。
  - ButtonGroup 的 `shape` 增加可选值 `square` 和 `circle`，并且移除默认值。`square` 和 `circle` 时，Button 子组件的在视觉上长和宽相等。此处变更不会影响旧代码，因为 ButtonGroup 的 `shape` 默认值不存在时，时，Button 子组件也会采取 `rect` 的默认值。
  - 为 Switch 组件 canvas 绘制增加防抖，改为用 `transform` 来控制滑块位置，增加动画的流畅性（特便是高频率切换的时候）。
- 优化：
  - 给传入内部组件 props 的属性提供了更详细的类型声明。
  - 优化代码 & 完善测试用例。
  - 为大部分含有 canvas 的组件增加 `pollSizeChange` 属性，用于轮询尺寸变化更新渲染。
- 修复：
  - Vue 模板 `<style>` `lang` 属性错误设置导致样式重复。
  - 修复基于 OptionList 的下拉选项中，数据字体和字号 CSS 缺失的问题。
  - 修复在微任务中快速切换按钮 `loading` 状态时 canvas 渲染异常。
  - 修复在按钮 `size="small"` 时字体大小异常的问题。
  - 修复输入组件在 FormItem 中横向延申异常的问题。
  - 为 InputGroup 和 ButtonGroup 向子组件传递更新信息的 key 加上独特的 id，以防止影响其他组件下的子组件。另外，减少了检测子组件位置的频率。
  - 修复 Radio、Checkbox、Switch、Select、AutoComplete、Input、InputNumber、InputTag、Textarea、Slider 组件在内部点击时会触发 `focus` 和 `blur` 事件的问题。
  - 修复了输入控件的图标被聚焦时会出现焦点环的问题。
  - 修复了 Textarea 组件内部图标没有正常显示的问题。
  - 修复了 Slider 没有 emit `focus` 和 `blur` 事件的问题。
]]]
[[[en
## v0.1.0

- New Features:
  - Added notice blue theme, corresponding to the `'notice'` value of the `'theme'` property and some feedback components' `'type'` property.
  - Added feedback components: Dialog, Popconfirm, Badge, Alert, Progress.
  - Added navigation component: Menu, MenuItem, Submenu, MenuGroup, BackTop, DropDown, Breadcrumb, BreadcrumbItem, Pagination.
  - Added the `cascade` property to Tooltip and Popover to maintain the display of nested floating windows.
  - Added multi-language internationalization module; text language for dialogs and confirmation popups can be adjusted via the exported `locale` from the entry file.
  - Added a new `variant` property to Link with values `'normal'` and `'underline'` (default), controlling whether to display the `'underline'`.
  - VirtualList adds a new slot `'scroll-container'` for customizing the scroll container. It's recommended to use with the `h` function or JSX.
- Adjustment:
  - ⚠️ Note ⚠️ Removed unused CSS variables in the form of --px-primary|success|warning|danger|sakura-light|dark-number, such as `--px-warning-light-1`. In fact, component colors directly derive from the --px-color-light|dark-number CSS variables, for example: `--px-orange-light-1`.
  - ⚠️ Note ⚠️ To facilitate the use of higher-order components and due to limitations in Vue's mechanism, paired components such as Row and Col, Container and Aside, Grid and GridItem, ButtonGroup and Button, InputGroup and various data input components, etc., when receiving corresponding `provide` data, will now no longer strictly require the type of the immediate parent component.
  - The `shape` property of ButtonGroup now accepts two additional optional values: `square` and `circle`, and its default value has been removed. When set to `square` or `circle`, the child Button components will visually have equal height and width. This change will not affect existing code, as child Button components will default to using `rect` when no `shape` value is provided for the ButtonGroup.
  - Add debouncing to the canvas rendering of the Switch component, change the slider position control to use `transform`, and enhance the smoothness of animations (especially during high-frequency switching).
- Optimizations:
  - Provided more detailed type declarations for properties passed as props to internal components.
  - Optimized code & improved test coverage.
  - Added the `pollSizeChange` property to most components containing canvas for polling size changes to update rendering.
- Fixes:
  - Incorrect setting of the `lang` attribute in Vue template `<style>` tags leads to style duplication.
  - Fix the issue of missing CSS for data font and font size in OptionList-based dropdown options.
  - Fixed abnormal canvas rendering when toggling the button `loading` state rapidly within micro tasks.
  - Fix the font size issue when button's size is `'small'`.
  - Fixed the abnormal horizontal extension of input components within a FormItem.
  - Unique IDs have been added to the keys used by InputGroup and ButtonGroup to propagate updates to child components, preventing interference with child components in other groups. Additionally, the frequency of positional checks has been reduced.
  - Fix the issue where components such as Radio, Checkbox, Switch, Select, AutoComplete, Input, InputNumber, InputTag, Textarea, and Slider trigger `focus` and `blur` events when clicked internally.
  - Fixed an issue where a focus ring would appear when the icon inside an input control was focused.
  - Fixed an issue where icons inside the Textarea component were not displayed correctly.
  - Fixed the issue where Slider did not emit `focus` and `blur` events.
]]]

[[[zh
## v0.0.5
> hotfix
- 修复：
  - ⚠️需要注意⚠️ 修复 `setPixelSize` 函数设置 CSS 变量异常的问题，并且增加 `dynamicComponentSize` 参数控制像素尺寸对绝大部分组件尺寸计算的影响，避免引起修复前后组件尺寸变化的问题。
  - 修复 Tag 组件 `line-height` 没有正确设置的问题，这会导致 `size="small"` 的 Tag 被撑高。
  - 修复 Select `size="small"` 时高度没有正确设置的问题。
  - 修复 InputTag 组件高度相关 CSS 没有被正确设置（虽然视觉上看起来是没有问题的）。
]]]
[[[en
## v0.0.5
> hotfix
- Fixes:
  - ⚠️ Note ⚠️ Fix the issue where the `setPixelSize` function incorrectly set CSS custom properties, and add a `dynamicComponentSize` parameter to control how pixel size affects size calculations for most components, preventing size differences before and after the fix.
  - Fixed an issue where the Tag component's `line-height` was not set correctly, causing Tags with `size="small"` to be taller than intended.
  - Fix the issue where the height is not correctly set when using Select `size="small"`.
  - Fix the problem where the CSS related to the height of the InputTag component is not properly configured (even though it appears visually correct).
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