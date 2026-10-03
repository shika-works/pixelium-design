<template>
	<div
		class="pixelium px-upload-dragger"
		:class="[
			sizeComputed ? `px-upload-dragger__${sizeComputed}` : undefined,
			{
				'px-upload-dragger__drag-over': dragOver,
				'px-upload-dragger__disabled': disabledComputed
			}
		]"
		@click="clickHandler"
		@dragover.prevent="dragOverHandler"
		@dragleave="dragLeaveHandler"
		@drop.prevent="dropHandler"
	>
		<slot name="icon">
			<CloudUpload class="px-upload-dragger-icon"></CloudUpload>
		</slot>
		<span class="px-upload-dragger-text">
			<slot>{{ textComputed }}</slot>
		</span>
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { UploadDraggerProps } from './type'
import type { UploadProvide } from '../upload/type'
import { UPLOAD_PROVIDE } from '../share/const/provide-key'
import { useDropZone } from '../share/hook/use-drop-zone'
import { useLocale } from '../share/util/locale'
// @ts-ignore
import CloudUpload from '@hackernoon/pixel-icon-library/icons/SVG/regular/cloud-upload.svg'

defineOptions({
	name: 'UploadDragger'
})

const props = defineProps<UploadDraggerProps>()

const [t] = useLocale()

const uploadProvide = inject<UploadProvide | undefined>(UPLOAD_PROVIDE, undefined)

const sizeComputed = computed(() => uploadProvide?.size.value)

const disabledComputed = computed(() => !!uploadProvide?.disabled.value)

const textComputed = computed(() => props.text ?? t('upload.draggerText'))

const { dragOver, dragOverHandler, dragLeaveHandler, dropHandler } = useDropZone({
	isEnabled: () => !disabledComputed.value,
	onDrop: (files, e) => uploadProvide?.addFiles(files, e)
})

const clickHandler = () => {
	if (disabledComputed.value) {
		return
	}
	uploadProvide?.open()
}
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
