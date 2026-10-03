<template>
	<span class="pixelium px-upload">
		<slot name="trigger" :open="open">
			<UploadDragger v-if="props.draggable" v-bind="props.uploadDraggerProps"></UploadDragger>
			<Button
				v-else
				:size="sizeComputed"
				:disabled="disabledComputed"
				v-bind="props.buttonProps"
				@click="open"
			>
				<template #icon>
					<Upload></Upload>
				</template>
				{{ t('upload.uploadFile') }}
			</Button>
		</slot>
		<slot
			name="file-list"
			:file-list="fileListComputed"
			:remove="remove"
			:abort="abort"
			:submit="submit"
			:retry="retry"
			:download="download"
		>
			<UploadImage v-if="props.mode === 'image'" v-bind="props.uploadImageProps"></UploadImage>
			<UploadFileList v-else v-bind="props.uploadFileListProps"></UploadFileList>
		</slot>
		<input
			ref="inputRef"
			class="px-upload-input"
			type="file"
			hidden
			:accept="acceptText"
			:multiple="props.multiple"
			:disabled="disabledComputed"
			@change="inputChangeHandler"
		/>
	</span>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, shallowRef, watch } from 'vue'
import type {
	FileInfo,
	UploadCustomRequestOptions,
	UploadEvents,
	UploadExpose,
	UploadPatch,
	UploadProvide,
	UploadProps
} from './type'
import { useControlledMode } from '../share/hook/use-controlled-mode'
import { useLocale } from '../share/util/locale'
import Button from '../button/index.vue'
import UploadFileList from '../upload-file-list/index.vue'
import UploadImage from '../upload-image/index.vue'
import { nanoid } from 'nanoid'
import { FORM_ITEM_PROVIDE, FORM_PROVIDE, UPLOAD_PROVIDE } from '../share/const/provide-key'
import type { FormItemProvide } from '../form-item/type'
import type { FormProvide } from '../form/type'
import { createProvideComputed } from '../share/util/reactivity'
import { isImageFile, matchAccept } from '../share/util/file'
import UploadDragger from '../upload-dragger/index.vue'
// @ts-ignore
import Upload from '@hackernoon/pixel-icon-library/icons/SVG/regular/upload.svg'

defineOptions({
	name: 'Upload'
})

const props = withDefaults(
	defineProps<
		UploadProps & {
			onBeforeUpload?: (params: {
				file: File
				fileList: FileInfo[]
			}) => boolean | void | Promise<boolean | void>
			onBeforeRemove?: (params: {
				file: FileInfo
				fileList: FileInfo[]
			}) => boolean | void | Promise<boolean | void>
		}
	>(),
	{
		mode: 'file',
		thumbnailType: 'objectURL',
		multiple: true,
		disabled: false,
		abortable: true,
		draggable: false,
		autoUpload: true,
		method: 'post',
		name: 'file',
		withCredentials: false,
		responseType: 'text'
	}
)

const emits = defineEmits<Omit<UploadEvents, 'onBeforeRemove' | 'onBeforeUpload'>>()

const [t] = useLocale()

const beforeUploadHandler = () => props.onBeforeUpload

const beforeRemoveHandler = () => props.onBeforeRemove

const [fileList, commitFileList, controlledMode] = useControlledMode('fileList', props, emits, {
	defaultField: 'defaultFileList',
	transform: (val) => val ?? []
})

const updateFileList = (next: FileInfo[]) => {
	commitFileList(next)
	if (controlledMode.value) {
		fileList.value = next
	}
}

const inputRef = shallowRef<HTMLInputElement | null>(null)

const objectUrls = new Map<string, string>()
const xhrMap = new Map<string, XMLHttpRequest>()
const activeRequests = new Map<string, () => void>()
const queuedIds = new Set<string>()
const requestControllers = new Map<string, AbortController>()
const abortedIds = new Set<string>()

const acceptText = computed(() => (props.accept?.length ? props.accept.join(',') : undefined))

const formProps = inject<undefined | FormProvide>(FORM_PROVIDE, undefined)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, formProps, props],
	'nullish',
	(val) => val || 'medium'
)
const disabledComputed = createProvideComputed(
	'disabled',
	[formItemProvide, formProps, props],
	(pre, value, cur) => {
		return pre || value || ('readonly' in cur && cur['readonly'].value)
	}
)

const fileListComputed = computed(() => fileList.value ?? [])

const findItem = (id: string) => fileListComputed.value.find((item) => item.id === id)

const patchItem = (id: string, patch: Partial<FileInfo>): FileInfo | undefined => {
	let changed: FileInfo | undefined
	updateFileList(
		fileListComputed.value.map((item) => {
			if (item.id !== id) {
				return item
			}
			changed = { ...item, ...patch }
			return changed
		})
	)
	return changed
}

const addItems = (items: FileInfo[]) => {
	updateFileList([...fileListComputed.value, ...items])
}

const resolveVariant = <T,>(
	value: T | ((params: { file: FileInfo }) => T) | undefined,
	file: FileInfo
): T | undefined => {
	if (typeof value === 'function') {
		return (value as (params: { file: FileInfo }) => T)({ file })
	}
	return value
}

const readAsDataUrl = (file: File) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(String(reader.result ?? ''))
		reader.onerror = () => reject(reader.error)
		reader.readAsDataURL(file)
	})

const revokeObjectUrl = (id: string) => {
	const url = objectUrls.get(id)
	if (url) {
		URL.revokeObjectURL(url)
		objectUrls.delete(id)
	}
}

const createThumbnail = async (item: FileInfo): Promise<string | undefined> => {
	const file = item.file
	if (props.mode !== 'image' || !file || !isImageFile(file)) {
		return undefined
	}
	if (props.thumbnailType === 'dataURL') {
		return readAsDataUrl(file)
	}
	const cached = objectUrls.get(item.id)
	if (cached) {
		return cached
	}
	const url = URL.createObjectURL(file)
	objectUrls.set(item.id, url)
	return url
}

const thumbnailCache = new Map<string, string | undefined>()

const resolveThumbnail = async (item: FileInfo): Promise<string | undefined> => {
	if (props.createThumbnailUrl && !thumbnailCache.has(item.id)) {
		try {
			thumbnailCache.set(item.id, await props.createThumbnailUrl({ file: item }))
		} catch {
			thumbnailCache.set(item.id, undefined)
		}
	}
	const cached = thumbnailCache.get(item.id)
	if (cached) {
		return cached
	}
	try {
		return item.thumbnailUrl ?? (await createThumbnail(item))
	} catch {
		return item.thumbnailUrl
	}
}

watch(
	() => props.createThumbnailUrl,
	() => thumbnailCache.clear()
)

onBeforeUnmount(() => {
	fileListComputed.value.forEach((item) => cancelRequest(item.id))
	objectUrls.forEach((url) => URL.revokeObjectURL(url))
	objectUrls.clear()
	thumbnailCache.clear()
})

const runRequest = (item: FileInfo): Promise<void> => {
	queuedIds.delete(item.id)
	if (
		abortedIds.has(item.id) ||
		!item.file ||
		activeRequests.has(item.id) ||
		!findItem(item.id)
	) {
		return Promise.resolve()
	}
	const controller = new AbortController()
	requestControllers.set(item.id, controller)
	const isAborted = () => abortedIds.has(item.id)
	const current = () => findItem(item.id) ?? item
	let settled = false
	let release: () => void = () => {}
	const done = new Promise<void>((resolve) => {
		release = resolve
	})
	const settle = () => {
		if (activeRequests.get(item.id) === settle) {
			activeRequests.delete(item.id)
		}
		release()
	}
	const isCurrent = () => activeRequests.get(item.id) === settle
	const releaseController = () => {
		if (requestControllers.get(item.id) === controller) {
			requestControllers.delete(item.id)
		}
	}

	const finalize = async (state: FileInfo['state'], patch?: UploadPatch, e?: Event) => {
		if (settled || isAborted() || !isCurrent()) {
			return
		}
		settled = true
		settle()
		xhrMap.delete(item.id)
		const thumbnailUrl =
			patch?.thumbnailUrl ?? (await resolveThumbnail({ ...current(), ...patch }))
		if (isAborted()) {
			return
		}
		const nextPatch: Partial<FileInfo> = { state, thumbnailUrl }
		if (patch && 'url' in patch) {
			nextPatch.url = patch.url
		}
		if (patch && 'response' in patch) {
			nextPatch.response = patch.response
		}
		const next = patchItem(item.id, nextPatch) ?? item
		if (state === 'finished') {
			emits('finish', next, patch?.response, e as ProgressEvent)
		} else {
			emits('error', next, patch?.response, e as ProgressEvent)
		}
		releaseController()
	}

	const options: UploadCustomRequestOptions = {
		get file() {
			return current()
		},
		action: props.action,
		withCredentials: props.withCredentials,
		data: props.data,
		headers: props.headers,
		signal: controller.signal,
		setProgress: (e) => {
			if (settled || isAborted()) {
				return
			}
			patchItem(item.id, { progress: e.percent })
			emits('progress', current(), e.percent)
		},
		setFinish: (patch) => void finalize('finished', patch),
		setError: (patch) => void finalize('error', patch)
	}

	activeRequests.set(item.id, settle)
	patchItem(item.id, { state: 'uploading', progress: 0 })

	const customRequest = props.customRequest
	if (customRequest) {
		Promise.resolve()
			.then(() => customRequest(options))
			.then(
				(response) => {
					if (isCurrent() && !isAborted() && response !== undefined) {
						patchItem(item.id, { response })
					}
					releaseController()
					settle()
				},
				() => {
					releaseController()
					settle()
				}
			)
		return done
	}

	if (props.action) {
		try {
			runXhr(item, finalize)
		} catch (error) {
			void finalize('error', { response: error })
		}
		return done
	}

	patchItem(item.id, { state: 'pending' })
	settle()
	return done
}

const taskQueue: { id: string; run: () => Promise<void> }[] = []
let runningCount = 0

const pump = () => {
	const limit = props.concurrency
	if (!limit || limit <= 0) {
		return
	}
	while (runningCount < limit && taskQueue.length) {
		const task = taskQueue.shift()
		if (!task) {
			return
		}
		runningCount++
		void Promise.resolve()
			.then(() => task.run())
			.catch(() => {})
			.finally(() => {
				runningCount--
				pump()
			})
	}
}

const runRequests = (items: FileInfo[]) => {
	const tasks = items.map((item) => {
		abortedIds.delete(item.id)
		queuedIds.add(item.id)
		return { id: item.id, run: () => runRequest(item) }
	})
	if (!props.concurrency || props.concurrency <= 0) {
		tasks.forEach((task) => void task.run())
		return
	}
	taskQueue.push(...tasks)
	const enqueued = new Set(tasks.map((task) => task.id))
	updateFileList(
		fileListComputed.value.map(
			(item): FileInfo =>
				enqueued.has(item.id) ? { ...item, state: 'queueing', progress: 0 } : item
		)
	)
	pump()
}

const isRequestRunning = (item: FileInfo) =>
	activeRequests.has(item.id) || queuedIds.has(item.id)

const cancelRequest = (id: string) => {
	xhrMap.get(id)?.abort()
	xhrMap.delete(id)
	requestControllers.get(id)?.abort()
	requestControllers.delete(id)
	abortedIds.add(id)
	queuedIds.delete(id)
	for (let index = taskQueue.length - 1; index >= 0; index--) {
		if (taskQueue[index].id === id) {
			taskQueue.splice(index, 1)
		}
	}
	const settle = activeRequests.get(id)
	if (settle) {
		settle()
	}
}

const runXhr = (
	item: FileInfo,
	finalize: (state: FileInfo['state'], patch?: UploadPatch, e?: Event) => void
) => {
	const xhr = new XMLHttpRequest()
	xhrMap.set(item.id, xhr)
	xhr.open(props.method.toUpperCase(), props.action as string)
	xhr.withCredentials = !!props.withCredentials
	xhr.responseType = props.responseType
	const headers = resolveVariant(props.headers, item)
	if (headers) {
		Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
	}
	xhr.upload.onprogress = (e) => {
		if (!e.lengthComputable) {
			return
		}
		const percent = Math.ceil((e.loaded / e.total) * 100)
		patchItem(item.id, { progress: percent })
		emits('progress', findItem(item.id) ?? item, percent, e)
	}
	xhr.onload = (e) => {
		const failed = props.isErrorState
			? props.isErrorState(xhr)
			: xhr.status < 200 || xhr.status >= 300
		finalize(failed ? 'error' : 'finished', { response: xhr.response }, e)
	}
	xhr.onerror = (e) => finalize('error', undefined, e)
	const formData = new FormData()
	const data = resolveVariant(props.data, item)
	if (data) {
		Object.entries(data).forEach(([key, value]) => formData.append(key, value))
	}
	if (item.file) {
		formData.append(props.name, item.file)
	}
	xhr.send(formData)
}

const createItems = async (files: File[], e?: Event) => {
	const results = await Promise.all(
		files.map(async (file): Promise<FileInfo | null> => {
			const allowed = await beforeUploadHandler()?.({ file, fileList: fileListComputed.value })
			if (allowed === false) {
				return null
			}
			return {
				id: nanoid(),
				name: file.name,
				type: file.type,
				file,
				state: 'pending',
				progress: 0
			}
		})
	)
	const accepted = results.filter((item): item is FileInfo => item !== null)
	if (!accepted.length) {
		return
	}
	addItems(accepted)
	emits('change', fileListComputed.value, e)
	accepted.forEach((item) => {
		void resolveThumbnail(item).then((url) => {
			if (url) {
				patchItem(item.id, { thumbnailUrl: url })
			}
		})
	})
	if (props.autoUpload) {
		runRequests(accepted)
	}
}

const addFiles = (files: File[], e?: Event) => {
	if (!files.length) {
		return
	}
	const accept = props.accept
	const accepted = accept?.length ? files.filter((file) => matchAccept(file, accept)) : files
	const targets = props.multiple ? accepted : accepted.slice(0, 1)
	if (targets.length) {
		void createItems(targets, e)
	}
}

const inputChangeHandler = (e: Event) => {
	const target = e.target as HTMLInputElement
	const files = Array.from(target.files ?? [])
	target.value = ''
	addFiles(files, e)
}

const open = () => {
	if (disabledComputed.value) {
		return
	}
	inputRef.value?.click()
}

const submit = (fileId?: string) =>
	runRequests(
		fileListComputed.value.filter(
			(item) =>
				item.state === 'pending' &&
				(fileId === undefined || item.id === fileId) &&
				!isRequestRunning(item)
		)
	)

const retry = (fileId?: string) =>
	runRequests(
		fileListComputed.value.filter(
			(item) =>
				item.state === 'error' &&
				(fileId === undefined || item.id === fileId) &&
				!isRequestRunning(item)
		)
	)

const remove = async (id: string, e?: MouseEvent) => {
	const item = findItem(id)
	if (!item) {
		return
	}
	const allowed = await beforeRemoveHandler()?.({
		file: item,
		fileList: fileListComputed.value
	})
	if (allowed === false) {
		return
	}
	cancelRequest(id)
	revokeObjectUrl(id)
	thumbnailCache.delete(id)
	updateFileList(fileListComputed.value.filter((entry) => entry.id !== id))
	emits('remove', item, e)
	emits('change', fileListComputed.value, e)
}

const isActiveRequest = (item: FileInfo) => activeRequests.has(item.id)

const abort = (id?: string) => {
	if (!props.abortable) {
		return
	}
	const targets = fileListComputed.value.filter(
		(item) =>
			(isActiveRequest(item) || queuedIds.has(item.id)) && (id === undefined || item.id === id)
	)
	if (!targets.length) {
		return
	}
	const ids = new Set(targets.map((item) => item.id))
	ids.forEach((targetId) => cancelRequest(targetId))
	const next = fileListComputed.value.map(
		(item): FileInfo => (ids.has(item.id) ? { ...item, state: 'error' } : item)
	)
	updateFileList(next)
	next.forEach((item) => {
		if (ids.has(item.id)) {
			emits('abort', item)
		}
	})
}

const download = (item: FileInfo) => {
	if (!item.url) {
		return
	}
	if (props.customDownload) {
		props.customDownload({ file: item })
		return
	}
	const anchor = document.createElement('a')
	anchor.href = item.url
	anchor.download = item.name
	anchor.click()
}

const clear = () => {
	fileListComputed.value.forEach((item) => cancelRequest(item.id))
	taskQueue.length = 0
	queuedIds.clear()
	objectUrls.forEach((url) => URL.revokeObjectURL(url))
	objectUrls.clear()
	thumbnailCache.clear()
	updateFileList([])
	emits('change', fileListComputed.value)
}

provide<UploadProvide>(UPLOAD_PROVIDE, {
	fileList: fileListComputed,
	mode: computed(() => props.mode),
	size: sizeComputed,
	disabled: disabledComputed,
	abortable: computed(() => props.abortable),
	download,
	open,
	addFiles,
	submit,
	retry,
	abort,
	remove: (id: string, e?: MouseEvent) => void remove(id, e)
})

defineExpose<UploadExpose>({
	open,
	submit,
	retry,
	remove: (id: string) => void remove(id),
	abort,
	clear
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
