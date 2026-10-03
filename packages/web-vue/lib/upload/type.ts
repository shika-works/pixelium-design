import type { ComputedRef } from 'vue'
import type { ButtonProps, ButtonEvents } from '../button/type'
import type { UploadFileListProps } from '../upload-file-list/type'
import type { UploadImageProps } from '../upload-image/type'
import type { UploadDraggerProps } from '../upload-dragger/type'
import type { EmitEvent, RestAttrs } from '../share/type'

export type UploadData =
	| Record<string, string>
	| ((params: { file: FileInfo }) => Record<string, string>)

export type UploadHeaders =
	| Record<string, string>
	| ((params: { file: FileInfo }) => Record<string, string>)

export type UploadPatch = {
	url?: string
	thumbnailUrl?: string
	response?: any
}

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

export type CustomRequest = (options: UploadCustomRequestOptions) => any

export type CustomDownload = (params: { file: FileInfo }) => void

export type CreateThumbnailUrl = (params: {
	file: FileInfo
}) => string | undefined | Promise<string | undefined>

export type UploadProps = {
	/**
	 * @property {string[]} [accept]
	 * @version 0.2.1
	 */
	accept?: string[]
	/**
	 * @property {'small' | 'medium' | 'large'} [size='medium']
	 * @version 0.2.1
	 */
	size?: 'small' | 'medium' | 'large'
	/**
	 * @property {'file' | 'image'} [mode='file']
	 * @version 0.2.1
	 */
	mode?: 'file' | 'image'
	/**
	 * @property {'objectURL' | 'dataURL'} [thumbnailType='objectURL']
	 * @version 0.2.1
	 */
	thumbnailType?: 'objectURL' | 'dataURL'
	/**
	 * @property {CreateThumbnailUrl} [createThumbnailUrl]
	 * @version 0.2.1
	 */
	createThumbnailUrl?: CreateThumbnailUrl
	/**
	 * @property {boolean} [multiple=true]
	 * @version 0.2.1
	 */
	multiple?: boolean
	/**
	 * @property {boolean} [draggable=false]
	 * @version 0.2.1
	 */
	draggable?: boolean
	/**
	 * @property {boolean} [disabled=false]
	 * @version 0.2.1
	 */
	disabled?: boolean
	/**
	 * @property {boolean} [abortable=true]
	 * @version 0.2.1
	 */
	abortable?: boolean
	/**
	 * @property {boolean} [autoUpload=true]
	 * @version 0.2.1
	 */
	autoUpload?: boolean
	/**
	 * @property {number} [concurrency]
	 * @version 0.2.1
	 */
	concurrency?: number
	/**
	 * @property {string} [action]
	 * @version 0.2.1
	 */
	action?: string
	/**
	 * @property {string} [method='post']
	 * @version 0.2.1
	 */
	method?: string
	/**
	 * @property {string} [name='file']
	 * @version 0.2.1
	 */
	name?: string
	/**
	 * @property {UploadData} [data]
	 * @version 0.2.1
	 */
	data?: UploadData
	/**
	 * @property {UploadHeaders} [headers]
	 * @version 0.2.1
	 */
	headers?: UploadHeaders
	/**
	 * @property {boolean} [withCredentials=false]
	 * @version 0.2.1
	 */
	withCredentials?: boolean
	/**
	 * @property {XMLHttpRequestResponseType} [responseType='text']
	 * @version 0.2.1
	 */
	responseType?: XMLHttpRequestResponseType
	/**
	 * @property {(xhr: XMLHttpRequest) => boolean} [isErrorState]
	 * @version 0.2.1
	 */
	isErrorState?: (xhr: XMLHttpRequest) => boolean
	/**
	 * @property {CustomRequest} [customRequest]
	 * @version 0.2.1
	 */
	customRequest?: CustomRequest
	/**
	 * @property {CustomDownload} [customDownload]
	 * @version 0.2.1
	 */
	customDownload?: CustomDownload
	/**
	 * @property {FileInfo[]} [fileList]
	 * @version 0.2.1
	 */
	fileList?: FileInfo[]
	/**
	 * @property {FileInfo[]} [defaultFileList]
	 * @version 0.2.1
	 */
	defaultFileList?: FileInfo[]
	/**
	 * @property {ButtonProps & EmitEvent<ButtonEvents> & RestAttrs} [buttonProps]
	 * @version 0.2.1
	 */
	buttonProps?: ButtonProps & EmitEvent<ButtonEvents> & RestAttrs
	/**
	 * @property {UploadFileListProps} [uploadFileListProps]
	 * @version 0.2.1
	 */
	uploadFileListProps?: UploadFileListProps
	/**
	 * @property {UploadImageProps} [uploadImageProps]
	 * @version 0.2.1
	 */
	uploadImageProps?: UploadImageProps
	/**
	 * @property {UploadDraggerProps} [uploadDraggerProps]
	 * @version 0.2.1
	 */
	uploadDraggerProps?: UploadDraggerProps
}

export type UploadEvents = {
	/**
	 * @event update:fileList
	 * @param {FileInfo[]} fileList
	 * @version 0.2.1
	 */
	'update:fileList': [fileList: FileInfo[]]
	/**
	 * @event beforeUpload
	 * @param {{ file: File; fileList: FileInfo[] }} params
	 * @version 0.2.1
	 */
	beforeUpload: [params: { file: File; fileList: FileInfo[] }]
	/**
	 * @event beforeRemove
	 * @param {{ file: FileInfo; fileList: FileInfo[] }} params
	 * @version 0.2.1
	 */
	beforeRemove: [params: { file: FileInfo; fileList: FileInfo[] }]
	/**
	 * @event change
	 * @param {FileInfo[]} fileList
	 * @param {Event} e
	 * @version 0.2.1
	 */
	change: [fileList: FileInfo[], e?: Event]
	/**
	 * @event progress
	 * @param {FileInfo} item
	 * @param {number} percent
	 * @param {ProgressEvent} e
	 * @version 0.2.1
	 */
	progress: [item: FileInfo, percent: number, e?: ProgressEvent]
	/**
	 * @event finish
	 * @param {FileInfo} item
	 * @param {any} response
	 * @param {ProgressEvent} e
	 * @version 0.2.1
	 */
	finish: [item: FileInfo, response?: any, e?: ProgressEvent]
	/**
	 * @event error
	 * @param {FileInfo} item
	 * @param {any} error
	 * @param {ProgressEvent} e
	 * @version 0.2.1
	 */
	error: [item: FileInfo, error?: any, e?: ProgressEvent]
	/**
	 * @event abort
	 * @param {FileInfo} item
	 * @version 0.2.1
	 */
	abort: [item: FileInfo]
	/**
	 * @event remove
	 * @param {FileInfo} item
	 * @param {MouseEvent} e
	 * @version 0.2.1
	 */
	remove: [item: FileInfo, e?: MouseEvent]
}

export type UploadSlots = {
	/**
	 * @slot trigger
	 * @param {() => void} open
	 * @version 0.2.1
	 */
	trigger: { open: () => void }
	/**
	 * @slot file-list
	 * @param {FileInfo[]} fileList
	 * @param {(id: string) => void} remove
	 * @param {(id?: string) => void} abort
	 * @param {(fileId?: string) => void} submit
	 * @param {(fileId?: string) => void} retry
	 * @param {(file: FileInfo) => void} download
	 * @version 0.2.1
	 */
	'file-list': {
		fileList: FileInfo[]
		remove: (id: string) => void
		abort: (id?: string) => void
		submit: (fileId?: string) => void
		retry: (fileId?: string) => void
		download: (file: FileInfo) => void
	}
}

export type UploadExpose = {
	/**
	 * @property {() => void} open
	 * @version 0.2.1
	 */
	open: () => void
	/**
	 * @property {(fileId?: string) => void} submit
	 * @version 0.2.1
	 */
	submit: (fileId?: string) => void
	/**
	 * @property {(fileId?: string) => void} retry
	 * @version 0.2.1
	 */
	retry: (fileId?: string) => void
	/**
	 * @property {(id: string) => void} remove
	 * @version 0.2.1
	 */
	remove: (id: string) => void
	/**
	 * @property {(id?: string) => void} abort
	 * @version 0.2.1
	 */
	abort: (id?: string) => void
	/**
	 * @property {() => void} clear
	 * @version 0.2.1
	 */
	clear: () => void
}

export type UploadProvide = {
	fileList: ComputedRef<FileInfo[]>
	mode: ComputedRef<'file' | 'image'>
	size: ComputedRef<'small' | 'medium' | 'large' | undefined>
	disabled: ComputedRef<boolean | undefined>
	abortable: ComputedRef<boolean>
	download: (file: FileInfo) => void
	open: () => void
	addFiles: (files: File[], e?: Event) => void
	submit: (fileId?: string) => void
	retry: (fileId?: string) => void
	abort: (id?: string) => void
	remove: (id: string, e?: MouseEvent) => void
}
