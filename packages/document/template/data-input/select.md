[[[zh
# Select

这是一个常见的选择器，使用下拉菜单展示并选择内容。
]]]
[[[en
# Select

A common selector that presents and selects content via a drop-down menu.
]]]

[[[zh
## 基础使用

传入 `modelValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultValue` 属性作为默认值。
]]]
[[[en
## Basic Usage

Pass `modelValue` to enter controlled mode.  
Omit it or pass `undefined` for uncontrolled mode, in which you can supply a `defaultValue` prop as the initial value.
]]]
<preview path="./select-basic.vue"></preview>

[[[zh
## 禁用选项

`options` 中，选项置 `disabled` 为 `true` 可禁用选项。
]]]
[[[en
## Disabled Options

Inside `options`, set an option's `disabled` field to `true` to disable that option.
]]]
<preview path="./select-disabled-option.vue"></preview>

[[[zh
## 分组

`options` 中，也支持传入选项组。

]]]
[[[en
## Groups

The `options` array also supports option groups.
]]]
<preview path="./select-group.vue"></preview>

[[[zh
## 远程加载
设置 `loading` 属性和监听 `focus` 事件，实现加载搜索时的 UI 变化。

]]]
[[[en
## Remote Loading

Set the `loading` prop and listen to the `focus` event to reflect UI changes while data is being fetched or searched.
]]]
<preview path="./select-remote.vue"></preview>

[[[zh
## 多选
设置 `multiple` 属性开启多选模式。

]]]
[[[en
## Multiple Selection

Add the `multiple` prop to enable multi-select mode.
]]]
<preview path="./select-multiple.vue"></preview>

[[[zh
## 折叠标签

多选时，设置 `collapseTags` 属性可开启折叠标签（默认为 `false`），`maxDisplayTags` 属性设置最大展示标签，`collapseTagsPopover` 设置折叠后是否通过弹出框展示被折叠的标签（默认为 `true`）。
]]]
[[[en
## Collapsed Tags

In multi-select mode, set `collapseTags` to `true` (default `false`) to collapse selected tags.  
`maxDisplayTags` controls how many tags remain visible, and `collapseTagsPopover` (default `true`) decides whether collapsed tags are shown in a popover.
]]]
<preview path="./select-collapse.vue"></preview>

[[[zh
## 搜索选项

设置 `filterable` 属性可开启搜索选项。

对于搜索的输入，传入 `inputValue` 进入受控模式。不传或者为 `undefined` 则为非受控模式，此时可以传入 `defaultInputValue` 属性作为默认值。

]]]
[[[en
## Searchable Options

Set `filterable` to make the drop-down searchable.  
For the search input itself, pass `inputValue` for controlled mode; otherwise supply `defaultInputValue` for uncontrolled mode.
]]]
<preview path="./select-filterable.vue"></preview>

[[[zh
## 添加选项

设置 `creatable` 属性可添加选项，添加的选项类型为 `string`，注意要开启 `filterable`。
]]]
[[[en
## Adding Options

Set `creatable` to allow new options to be added (type `string`). `filterable` must also be enabled.
]]]
<preview path="./select-creatable.vue"></preview>

[[[zh
## 更多配置
选择器 Select 还拥有 Input、InputTag、AutoComplete 组件的部分功能。
]]]
[[[en
## More Options

The Select component also inherits parts of Input, InputTag, and AutoComplete functionalities.
]]]
<preview path="./select-more.vue"></preview>

## API

[[[api zh
modelValue: 选择器的值（受控模式），支持 `v-model`。
defaultValue: 选择器的默认值（非受控模式）。
options: 选项列表。
placeholder: 占位符文本。
disabled: 是否禁用。
readonly: 是否只读。
clearable: 是否显示清除按钮。
loading: 是否显示加载状态。
inputValue: 搜索选项输入的文本值（受控模式），支持 `v-model`。
defaultInputValue: 搜索选项输入的默认文本值（非受控模式）。
filterable: 可否搜索选项。
shouldShowPopover: 是否展示弹出框的函数。
filter: 筛选选项的函数。
creatable: 可否创建选项，需要开启 `filterable`。
collapseTags: 是否开启折叠标签。
maxDisplayTags: 展示标签的最大数量，开启 `collapseTags` 后生效。
collapseTagsPopover: 是否在弹出框中展示被折叠的标签，开启 `collapseTags` 后生效。
tagTheme: 标签的 `theme` 属性，设置标签主题颜色。
tagVariant: 标签的 `variant` 属性，设置标签样式变体。
tagColor: 标签的 `color` 属性，自定义标签颜色。
size: 选择器尺寸。
shape: 选择器形状。
borderRadius: 圆角半径，优先级高于 `shape`，与 CSS `border-radius` 行为一致；单值或长度为 1 的数组 → 四角同时生效；长度为 2 的数组 → [左上 & 右下, 右上 & 左下]；长度为 3 的数组 → [左上, 右上 & 左下, 右下]；长度为 4 的数组 → 按顺时针顺序依次作用于四角。
status: 表单验证状态。
events.input: 搜索选项输入时的回调。
events.update:modelValue: 更新 `modelValue` 的回调。
events.update:inputValue: 更新 `inputValue` 的回调。
events.change: 选择器内容变化时的回调。
events.inputChange: 搜索选项内容变化时的回调。
events.clear: 点击清除文本按钮，清除内容时的回调。
events.blur: 失焦时的回调。
events.focus: 聚焦时的回调。
events.select: 选中选项的回调。
events.tagClose: 关闭标签时的回调。
slots.prefix: 前缀内容。
slots.suffix: 后缀内容。
slots.option: 选项内容。
slots.group-label: 选项组的标签名。
slots.tag: 标签内容。
selectExpose.focus: 聚焦当前控件。
selectExpose.blur: 取消聚焦当前控件。
selectExpose.clear: 清空当前输入内容。
]]]

[[[api en
modelValue: Current value (controlled), supports `v-model`.
defaultValue: Default value when uncontrolled.
options: Array of options.
placeholder: Placeholder text.
disabled: Disable the whole selector.
readonly: Make the selector read-only.
clearable: Show a clear button.
loading: Show loading state.
inputValue: Search input text (controlled), supports `v-model`.
defaultInputValue: Default search input text when uncontrolled.
filterable: Enable search within options.
shouldShowPopover: Function to determine whether to show the popover.
filter: Function to filter options.
creatable: Allow creating new options; requires `filterable`.
collapseTags: Collapse selected tags in multi-select mode.
maxDisplayTags: Max number of visible tags when `collapseTags` is on.
collapseTagsPopover: Show collapsed tags in a popover when `collapseTags` is on.
tagTheme: `theme` prop for tags (color theme).
tagVariant: `variant` prop for tags (style variant).
tagColor: `color` prop for tags (custom color).
size: Size of the selector.
shape: Shape of the selector.
borderRadius: Border-radius value; higher priority than `shape`. Single value or 1-item array → all corners; 2-item array → [top-left & bottom-right, top-right & bottom-left]; 3-item array → [top-left, top-right & bottom-left, bottom-right]; 4-item array → clockwise order for all four corners.
status: Form validation status.
events.input: Fired on search input.
events.update:modelValue: Fired when `modelValue` changes.
events.update:inputValue: Fired when `inputValue` changes.
events.change: Fired when selection changes.
events.inputChange: Fired when search input content changes.
events.clear: Fired when the clear button is clicked.
events.blur: Fired when the selector loses focus.
events.focus: Fired when the selector gains focus.
events.select: Fired when an option is selected.
events.tagClose: Fired when a tag is closed.
slots.prefix: Prefix content.
slots.suffix :Suffix content.
slots.option: Custom option content.
slots.group-label: Custom group-label content.
slots.tag: Custom tag content.
selectExpose.focus: Focus the selector.
selectExpose.blur: Blur the selector.
selectExpose.clear: Clear the current input.
]]]