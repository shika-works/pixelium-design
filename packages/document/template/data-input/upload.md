[[[zh
# 上传 Upload

合成进化
]]]
[[[en
# Upload

Synthetic Evolution
]]]

[[[zh
## 基础使用

`action` 指定上传地址，也可以使用 `customRequest` 完全接管请求过程。文件列表由 UploadFileList 渲染，展示每个文件的名称、进度和操作入口。
]]]
[[[en
## Basic Usage

`action` sets the upload address, while `customRequest` takes over the request entirely. The file list is rendered by UploadFileList and shows the name, the progress and the actions of every file.
]]]

<preview path="./upload-basic.vue"></preview>

[[[zh
## 图片模式

把 `mode` 设为 `'image'` 时改由 UploadImage 渲染卡片网格：图片显示缩略图并支持点击预览，其它文件显示类型图标。`thumbnailType` 决定缩略图的生成方式，`createThumbnailUrl` 可以完全自定义缩略图地址。
]]]
[[[en
## Image Mode

Set `mode` to `'image'` to let UploadImage render a grid of cards: images show their thumbnail and support click preview, while other files show a type icon. `thumbnailType` decides how the thumbnail is created, and `createThumbnailUrl` customizes the thumbnail address entirely.
]]]

<preview path="./upload-mode-image.vue"></preview>

[[[zh
## 拖拽上传

设置 `draggable` 后，内置的上传按钮会替换成 UploadDragger：整个像素虚线区域都可以接收拖入的文件，点击它同样会打开文件选择框，拖入的文件与选择框选中的文件走同一套流程。需要自己决定它摆放的位置时，把 UploadDragger 放进 `trigger` 插槽即可。
]]]
[[[en
## Drag & Drop

With `draggable` on, the built-in trigger button is replaced by UploadDragger: the whole pixel dashed zone accepts dropped files and also opens the picker when clicked, and dropped files go through the same flow as picked ones. Place UploadDragger inside the `trigger` slot yourself when you want to decide where it sits.
]]]

<preview path="./upload-dragger.vue"></preview>

[[[zh
## 禁用

`disabled` 设为 `true` 后，Upload 会忽略选取、拖入以及列表内的各项操作，内置按钮、UploadDragger 与 UploadFileList / UploadImage 的操作入口都会呈现禁用样式。
]]]
[[[en
## Disabled

With `disabled` set to `true`, Upload ignores picking, dropping and every action inside the list, and the built-in button, UploadDragger and the UploadFileList / UploadImage entries all render in their disabled style.
]]]

<preview path="./upload-disabled.vue"></preview>

[[[zh
## 手动上传与中断

`autoUpload` 设为 `false` 时文件先停留在待上传状态，再通过 Upload 暴露的 `submit` 方法开始上传，失败的文件可以用 `retry` 重试。`abort` 会把进行中和排队中的文件都标记为失败并保留在列表中，同时触发 `abort` 事件而不触发 `error` 事件；`abortable` 设为 `false` 时 Upload 会忽略中断调用，UploadFileList 与 UploadImage 也会隐藏中断入口。
]]]
[[[en
## Manual Upload and Abort

With `autoUpload` set to `false`, files stay pending until `submit` is exposed by Upload and called to start them; failed files can be retried with `retry`. `abort` marks both the running and the queued files as failed and keeps them in the list, triggering `abort` instead of `error`, while setting `abortable` to `false` makes Upload ignore abort calls and hides the abort affordance in UploadFileList and UploadImage.
]]]

<preview path="./upload-manual.vue"></preview>

[[[zh
## 选取限制

`accept` 限定可选的文件类型，支持扩展名、MIME 类型，以及 `audio/*`、`image/*`、`video/*` 三种通配；`multiple` 控制一次能否选取多个文件。`beforeUpload` 事件可以进一步校验文件，处理函数返回 `false` 时该文件不会进入列表。
]]]
[[[en
## Picking Limits

`accept` limits the file types that can be picked, supporting extensions, MIME types, and the `audio/*`, `image/*`, `video/*` wildcards; `multiple` controls whether several files can be picked at once. The `beforeUpload` event validates a file further, and the file stays out of the list when its handler returns `false`.
]]]

<preview path="./upload-limit.vue"></preview>

[[[zh
## 并发

`concurrency` 限制同时进行的上传数量：一次选取多个文件时，超出的文件会先进入排队，处于 `queueing` 状态且进度恒为零，等前面的上传结束后依次开始。
]]]
[[[en
## Concurrency

`concurrency` limits how many uploads run at the same time: when several files are picked, the extra ones are queued with the `queueing` state and a progress of zero, starting one after another as the running uploads finish.
]]]

<preview path="./upload-concurrency.vue"></preview>

[[[zh
## 下载

文件带有 `url` 时，UploadFileList 会把文件名渲染成下载链接，UploadImage 会显示下载入口；也可以用 `customDownload` 接管下载。
]]]
[[[en
## Download

When a file carries an `url`, UploadFileList renders its name as a download link and UploadImage shows a download affordance, while `customDownload` can take the download over.
]]]

<preview path="./upload-download.vue"></preview>

[[[zh
## 自定义文件列表

`fileList` 与 `defaultFileList` 分别用于受控和非受控地维护文件列表，需要完全自定义时可以用 `file-list` 插槽替换掉整个列表区域。
]]]
[[[en
## Custom File List

`fileList` and `defaultFileList` keep the file list in controlled and uncontrolled mode respectively, and the whole list area can be replaced through the `file-list` slot.
]]]

<preview path="./upload-custom.vue"></preview>

[[[zh
## 手动组合

上传的三个子组件都可以单独摆放：UploadFileList 与 UploadImage 放进 `file-list` 插槽，UploadDragger 放进 `trigger` 插槽，它们仍然通过 Upload 提供的上下文共享文件列表与各项操作。
]]]
[[[en
## Manual Composition

All three sub components can be placed by hand: put UploadFileList or UploadImage inside the `file-list` slot and UploadDragger inside the `trigger` slot - they still share the file list and the actions through the context provided by Upload.
]]]

<preview path="./upload-compose.vue"></preview>

## API

[[[api zh
accept: 限定可选的文件类型。
size: Upload 的尺寸。
mode: 文件列表的展示模式。
thumbnailType: 缩略图的生成方式。
createThumbnailUrl: 自定义缩略图地址。
multiple: 是否允许一次选取多个文件。
disabled: 是否禁用 Upload。
abortable: 是否允许中断进行中和排队中的上传。
draggable: 是否用 UploadDragger 替换内置的上传按钮。
autoUpload: 选取文件后是否自动开始上传。
concurrency: 同时进行的上传数量上限，未设置或不大于 0 时不限制。
action: 上传请求的地址。
method: 上传请求使用的方法。
name: 上传文件在请求中的字段名。
data: 附加在上传请求中的数据。
headers: 上传请求的请求头。
withCredentials: 跨域上传时是否携带凭据。
responseType: 上传请求期望的响应类型。
isErrorState: 判断上传请求是否失败。
customRequest: 自定义上传请求。
customDownload: 自定义下载行为。
fileList: 受控的文件列表。
defaultFileList: 非受控模式下默认的文件列表。
buttonProps: 内置 Button 的属性。
uploadFileListProps: 传给 UploadFileList 的属性，尺寸沿用 Upload 的尺寸。
uploadImageProps: 传给 UploadImage 的属性，尺寸沿用 Upload 的尺寸。
uploadDraggerProps: 传给 UploadDragger 的属性。

events.update:fileList: 文件列表变化时触发。
events.beforeUpload: 文件加入列表前触发，需返回 Promise<boolean | void> | boolean | void 类型的数据判断是否成功，await 后值为 false 时该文件不会加入列表。
events.beforeRemove: 文件移除前触发，需返回 Promise<boolean | void> | boolean | void 类型的数据判断是否成功，await 后值为 false 时取消移除。
events.change: 文件列表变化时触发（新增、移除或清空）。
events.progress: 上传进度变化时触发。
events.finish: 文件上传完成时触发。
events.error: 文件上传失败时触发。
events.abort: 文件被中止时触发。
events.remove: 文件被移除时触发。

slots.trigger: 触发选取文件的区域。
slots.file-list: 文件列表区域，作用域提供文件列表与各项操作，其中未指定文件的操作作用于全部对应文件。

uploadExpose.open: 打开文件选择框。
uploadExpose.submit: 开始上传待上传的文件，未指定文件时处理全部待上传的文件。
uploadExpose.retry: 重试上传失败的文件，未指定文件时处理全部上传失败的文件。
uploadExpose.abort: 中断进行中和排队中的上传，未指定文件时中断全部进行中和排队中的上传。
uploadExpose.remove: 从列表中移除文件。
uploadExpose.clear: 清空文件列表。
]]]

[[[api en
accept: Limits the file types that can be picked.
size: The size of Upload.
mode: The presentation mode of the file list.
thumbnailType: How the thumbnail of a file is created.
createThumbnailUrl: Customizes the thumbnail address of a file.
multiple: Whether several files can be picked at once.
disabled: Whether Upload is disabled.
abortable: Whether the running and the queued uploads can be aborted.
draggable: Whether the built-in trigger button is replaced by UploadDragger.
autoUpload: Whether the upload starts right after the files are picked.
concurrency: The maximum number of uploads running at the same time; no limit when it is not set or not greater than zero.
action: The address of the upload request.
method: The method used by the upload request.
name: The field name of the uploaded file in the request.
data: The extra data attached to the upload request.
headers: The headers of the upload request.
withCredentials: Whether credentials are sent with a cross-origin upload.
responseType: The expected response type of the upload request.
isErrorState: Decides whether an upload request failed.
customRequest: Takes over the upload request.
customDownload: Takes over the download.
fileList: The file list in controlled mode.
defaultFileList: The initial file list in uncontrolled mode.
buttonProps: Properties of the internal Button.
uploadFileListProps: Properties passed to UploadFileList, whose size still follows Upload.
uploadImageProps: Properties passed to UploadImage, whose size still follows Upload.
uploadDraggerProps: Properties passed to UploadDragger.

events.update:fileList: Triggered when the file list changes.
events.beforeUpload: Triggered before a file joins the list; return a Promise<boolean | void> | boolean | void to decide the result, and the file stays out when the awaited value is false.
events.beforeRemove: Triggered before a file is removed; return a Promise<boolean | void> | boolean | void to decide the result, and the removal is cancelled when the awaited value is false.
events.change: Triggered when the file list changes (files added, removed or cleared).
events.progress: Triggered when the progress of an upload changes.
events.finish: Triggered when a file finishes uploading.
events.error: Triggered when a file fails to upload.
events.abort: Triggered when a file is aborted.
events.remove: Triggered when a file is removed.

slots.trigger: The area that triggers picking files.
slots.file-list: The file list area, whose scope provides the file list and the actions, and the actions run on every matching file when no file is given.

uploadExpose.open: Opens the file picker.
uploadExpose.submit: Starts uploading the pending files, handling every pending file when none is given.
uploadExpose.retry: Retries the files that failed to upload, handling every failed file when none is given.
uploadExpose.abort: Aborts the running and the queued uploads, aborting every running or queued upload when none is given.
uploadExpose.remove: Removes a file from the list.
uploadExpose.clear: Clears the file list.
]]]

[[[api upload-file-list zh
size: UploadFileList 的尺寸，未设置时沿用 Upload 的尺寸。
abortable: 是否允许中断进行中和排队中的上传，与 Upload 同时允许时才会展示中断入口。
showProgress: 是否展示上传进度。
]]]
[[[api upload-file-list en
size: The size of UploadFileList, inheriting the size of Upload when it is not set.
abortable: Whether the running and the queued uploads can be aborted, showing the abort affordance only when Upload allows it as well.
showProgress: Whether the upload progress is shown.
]]]

[[[api upload-image zh
size: UploadImage 的尺寸，未设置时沿用 Upload 的尺寸。
abortable: 是否允许中断进行中和排队中的上传，与 Upload 同时允许时才会展示中断入口。
previewable: 是否允许点击缩略图进行预览。
showProgress: 是否展示上传进度。
]]]
[[[api upload-image en
size: The size of UploadImage, inheriting the size of Upload when it is not set.
abortable: Whether the running and the queued uploads can be aborted, showing the abort affordance only when Upload allows it as well.
previewable: Whether the thumbnails can be previewed by click.
showProgress: Whether the upload progress is shown.
]]]

[[[api upload-dragger zh
text: 拖拽区域的提示文字。

slots.default: 拖拽区域的提示内容。
slots.icon: 拖拽区域的图标。
]]]
[[[api upload-dragger en
text: The hint text of the drop zone.

slots.default: The hint content of the drop zone.
slots.icon: The icon of the drop zone.
]]]

### FileInfo

```ts
export interface FileInfo {
	id: string
	name: string
	type?: string
	file?: File
	state: 'pending' | 'queueing' | 'uploading' | 'finished' | 'error'
	progress: number
	url?: string
	thumbnailUrl?: string
	response?: any
}
```

### UploadData

```ts
export type UploadData =
	| Record<string, string>
	| ((params: { file: FileInfo }) => Record<string, string>)
```

### UploadHeaders

```ts
export type UploadHeaders =
	| Record<string, string>
	| ((params: { file: FileInfo }) => Record<string, string>)
```

### UploadPatch

```ts
export type UploadPatch = {
	url?: string
	thumbnailUrl?: string
	response?: any
}
```

### UploadCustomRequestOptions

```ts
export interface UploadCustomRequestOptions {
	file: FileInfo
	action?: string
	withCredentials?: boolean
	data?: UploadData
	headers?: UploadHeaders
	signal: AbortSignal
	setProgress: (e: { percent: number }) => void
	setFinish: (patch?: UploadPatch) => void
	setError: (patch?: UploadPatch) => void
}
```

### CustomRequest

```ts
export type CustomRequest = (options: UploadCustomRequestOptions) => any
```

### CustomDownload

```ts
export type CustomDownload = (params: { file: FileInfo }) => void
```

### CreateThumbnailUrl

```ts
export type CreateThumbnailUrl = (params: {
	file: FileInfo
}) => string | undefined | Promise<string | undefined>
```

[[[slice emit-event]]]

[[[slice rest-attrs]]]
