<template>
	<span class="pixelium px-upload-provider">
		<slot :upload="uploadScope"></slot>
		<input
			ref="inputRef"
			class="px-upload-input"
			type="file"
			hidden
			:accept="acceptText"
			:multiple="multiple"
			:disabled="disabled"
			@change="inputChangeHandler"
		/>
	</span>
</template>
<script setup lang="ts">
import { computed, provide, shallowRef } from 'vue'
import type {
	UploadProvide,
	UploadProviderEvents,
	UploadProviderExpose,
	UploadProviderProps,
	UploadProviderScope
} from './type'
import { UPLOAD_PROVIDE } from '../share/const/provide-key'
import { useUpload } from './use-upload'

defineOptions({
	name: 'UploadProvider',
	inheritAttrs: false
})

const props = withDefaults(defineProps<UploadProviderProps>(), {
	mode: 'file',
	thumbnailType: 'objectURL',
	multiple: true,
	disabled: false,
	abortable: true,
	autoUpload: true,
	method: 'post',
	name: 'file',
	withCredentials: false,
	responseType: 'text'
})

const emits = defineEmits<UploadProviderEvents>()

const inputRef = shallowRef<HTMLInputElement | null>(null)

const {
	fileList,
	acceptText,
	download,
	open,
	addFiles,
	inputChangeHandler,
	submit,
	retry,
	abort,
	remove,
	clear
} = useUpload(props, emits, { inputRef })

const uploadScope = computed<UploadProviderScope>(() => ({
	fileList: fileList.value,
	mode: props.mode,
	size: props.size,
	disabled: props.disabled,
	abortable: props.abortable,
	download,
	open,
	addFiles,
	submit,
	retry,
	abort,
	remove,
	clear
}))

provide<UploadProvide>(UPLOAD_PROVIDE, {
	fileList,
	mode: computed(() => props.mode),
	size: computed(() => props.size),
	disabled: computed(() => props.disabled),
	abortable: computed(() => props.abortable),
	download,
	open,
	addFiles,
	submit,
	retry,
	abort,
	remove: (id: string, e?: MouseEvent) => void remove(id, e)
})

defineExpose<UploadProviderExpose>({
	open,
	addFiles,
	submit,
	retry,
	remove: (id: string) => void remove(id),
	abort,
	clear
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
