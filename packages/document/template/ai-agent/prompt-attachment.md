[[[zh
# 提示词附件 PromptAttachment

Prompt 的附件能力由 `uploadConfig` 开启，附件列表由 PromptAttachment 渲染。它读取 Prompt 内置上传模块的文件列表，逐个展示缩略图、名称、进度与操作入口，自身不持有文件数据。
]]]
[[[en
# PromptAttachment

The attachment ability of Prompt is enabled by `uploadConfig`, and the attachment list is rendered by PromptAttachment. It reads the file list of the upload module inside Prompt and shows the thumbnail, the name, the progress and the actions of every file, keeping no file data of its own.
]]]

[[[zh
## 基础使用

给 Prompt 传入 `uploadConfig` 后，选中的文件会交给上传模块，附件区默认渲染 PromptAttachment。`uploadConfig` 的类型是 `PromptUploadConfig`，它继承了上传配置（`accept`、`multiple`、`action`、`customRequest`、`defaultFileList` 等），并额外提供 `draggable` 与 `pasteable` 控制拖入与粘贴。

`abortable` 控制上传中与排队中的文件能否中断，`showProgress` 控制上传进度，`previewable` 控制图片缩略图能否预览。需要改动这些默认值时，在 `attachment` 插槽里自己放一个 PromptAttachment 即可。
]]]
[[[en
## Basic Usage

Once `uploadConfig` is given to Prompt, the selected files are handed to the upload module and the attachment area renders PromptAttachment by default. The type of `uploadConfig` is `PromptUploadConfig`: it extends the upload configuration (`accept`, `multiple`, `action`, `customRequest`, `defaultFileList` and so on) and adds `draggable` and `pasteable` to control dropping and pasting.

`abortable` controls whether the running and the queued uploads can be aborted, `showProgress` controls the upload progress and `previewable` controls whether the image thumbnails can be previewed. Place your own PromptAttachment in the `attachment` slot to change these defaults.
]]]

<preview path="./prompt-attachment-basic.vue"></preview>

[[[zh
## 附件操作

`attachment`、`start`、`end`、`send` 插槽的作用域都会给出附件上传的操作：`fileList` 是当前文件列表，`open` 与 `addFiles` 添加文件，`submit`、`retry` 与 `abort` 控制上传，`remove` 与 `clear` 移除文件，`download` 交给 `customDownload` 处理。`submit`、`retry` 与 `abort` 不传文件 id 时作用于全部对应文件。

下面的例子关闭了 `autoUpload`，新文件会先停在待上传状态，再通过作用域里的 `submit` 统一上传。
]]]
[[[en
## Attachment Actions

The scope of the `attachment`, `start`, `end` and `send` slots provides the attachment actions: `fileList` is the current file list, `open` and `addFiles` add files, `submit`, `retry` and `abort` control the uploads, `remove` and `clear` drop files, and `download` is handed to `customDownload`. `submit`, `retry` and `abort` run on every matching file when no file id is given.

The following example turns `autoUpload` off, so new files stay pending until the `submit` of the scope uploads them all.
]]]

<preview path="./prompt-attachment-scope.vue"></preview>

[[[zh
## 独立使用

PromptAttachment 从上传上下文读取文件列表，所以并不只属于 Prompt：把它放进 Upload 的 `file-list` 插槽，就能用同一套卡片替换默认的文件列表，Upload 的 `accept`、`multiple`、`customRequest`、`draggable` 等配置照常生效。
]]]
[[[en
## Standalone Usage

PromptAttachment reads its file list from the upload context, so it is not limited to Prompt: placed in the `file-list` slot of Upload, it replaces the default file list with the same cards, while the `accept`, `multiple`, `customRequest`, `draggable` and other options of Upload keep working.
]]]

<preview path="./prompt-attachment-upload.vue"></preview>

## API
[[[api zh
abortable: 是否允许中断附件列表中进行中和排队中的上传。
showProgress: 是否展示附件列表的上传进度。
previewable: 是否允许预览附件列表中的图片。

draggable: 是否允许把文件拖入 Prompt 的输入区域。
pasteable: 是否允许把文件粘贴到 Prompt 的输入区域。
]]]
[[[api en
abortable: Whether the running and the queued uploads of the attachment list can be aborted.
showProgress: Whether the upload progress is shown in the attachment list.
previewable: Whether the images of the attachment list can be previewed.

draggable: Whether files can be dropped into the input area of Prompt.
pasteable: Whether files can be pasted into the input area of Prompt.
]]]

### PromptUploadScope

[[[zh
附件相关插槽的作用域类型，PromptAttachment 也从这里读取文件列表。
]]]
[[[en
The scope type of the attachment slots; PromptAttachment reads its file list from it as well.
]]]

```ts
export type UploadProviderScope = {
	fileList: FileInfo[]
	mode: UploadProviderProps['mode']
	size: UploadProviderProps['size']
	disabled: boolean | undefined
	abortable: boolean | undefined
	download: (file: FileInfo) => void
	open: () => void
	addFiles: (files: File[], e?: Event) => void
	submit: (fileId?: string) => void
	retry: (fileId?: string) => void
	abort: (id?: string) => void
	remove: (id: string, e?: MouseEvent) => Promise<void>
	clear: () => void
}

export type PromptUploadScope = UploadProviderScope
```

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
