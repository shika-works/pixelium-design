<template>
	<UploadProvider
		ref="providerRef"
		v-bind="$props"
		:size="sizeComputed"
		:disabled="disabledComputed"
		@update:file-list="emits('update:fileList', $event)"
		@change="forwardChange"
		@progress="forwardProgress"
		@finish="forwardFinish"
		@error="forwardError"
		@abort="forwardAbort"
		@remove="forwardRemove"
	>
		<template #default="{ upload }">
			<span class="pixelium px-upload" v-bind="$attrs">
				<slot name="trigger" :open="upload.open">
					<UploadDragger
						v-if="props.draggable"
						v-bind="props.uploadDraggerProps"
					></UploadDragger>
					<Button
						v-else
						:size="sizeComputed"
						:disabled="disabledComputed"
						v-bind="props.buttonProps"
						@click="upload.open"
					>
						<template #icon>
							<Upload></Upload>
						</template>
						{{ t('upload.uploadFile') }}
					</Button>
				</slot>
				<slot
					name="file-list"
					:file-list="upload.fileList"
					:remove="upload.remove"
					:abort="upload.abort"
					:submit="upload.submit"
					:retry="upload.retry"
					:download="upload.download"
				>
					<UploadImage
						v-if="props.mode === 'image'"
						v-bind="props.uploadImageProps"
					></UploadImage>
					<UploadFileList v-else v-bind="props.uploadFileListProps"></UploadFileList>
				</slot>
			</span>
		</template>
	</UploadProvider>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue'
import type { UploadEvents, UploadExpose, UploadProps } from './type'
import type { FileInfo, UploadProviderExpose } from '../upload-provider/type'
import { useLocale } from '../share/util/locale'
import Button from '../button/index.vue'
import UploadFileList from '../upload-file-list/index.vue'
import UploadImage from '../upload-image/index.vue'
import UploadProvider from '../upload-provider/index.vue'
import { FORM_ITEM_PROVIDE, FORM_PROVIDE } from '../share/const/provide-key'
import type { FormItemProvide } from '../form-item/type'
import type { FormProvide } from '../form/type'
import { createProvideComputed } from '../share/util/reactivity'
import UploadDragger from '../upload-dragger/index.vue'
// @ts-ignore
import Upload from '@hackernoon/pixel-icon-library/icons/SVG/regular/upload.svg'

defineOptions({
	name: 'Upload',
	inheritAttrs: false
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

const providerRef = ref<UploadProviderExpose | null>(null)

const forwardChange = (fileList: FileInfo[], e?: Event) => {
	emits('change', fileList, e)
	formItemProvide?.changeHandler()
}

const forwardProgress = (item: FileInfo, percent: number, e?: ProgressEvent) => {
	emits('progress', item, percent, e)
}

const forwardFinish = (item: FileInfo, response?: any, e?: ProgressEvent) => {
	emits('finish', item, response, e)
}

const forwardError = (item: FileInfo, error?: any, e?: ProgressEvent) => {
	emits('error', item, error, e)
}

const forwardAbort = (item: FileInfo) => {
	emits('abort', item)
}

const forwardRemove = (item: FileInfo, e?: MouseEvent) => {
	emits('remove', item, e)
}

defineExpose<UploadExpose>({
	open: () => providerRef.value?.open(),
	submit: (fileId?: string) => providerRef.value?.submit(fileId),
	retry: (fileId?: string) => providerRef.value?.retry(fileId),
	remove: (id: string) => providerRef.value?.remove(id),
	abort: (id?: string) => providerRef.value?.abort(id),
	clear: () => providerRef.value?.clear()
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
