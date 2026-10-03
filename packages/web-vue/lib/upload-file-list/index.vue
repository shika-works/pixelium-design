<template>
	<ul class="pixelium px-upload-file-list" :class="`px-upload-file-list__${sizeComputed}`">
		<li v-for="item in fileListComputed" :key="item.id" class="px-upload-file-list-item">
			<ImageIcon v-if="isImageFile(item)" class="px-upload-file-list-icon"></ImageIcon>
			<FileIcon v-else class="px-upload-file-list-icon"></FileIcon>
			<div class="px-upload-file-list-body">
				<a
					v-if="item.url"
					class="px-upload-file-list-name px-upload-file-list-name__link"
					:href="item.url"
					:download="item.name"
					@click="downloadHandler(item, $event)"
				>
					{{ item.name }}
				</a>
				<span
					v-else
					class="px-upload-file-list-name"
					:class="{ 'px-upload-file-list-name__error': item.state === 'error' }"
				>
					{{ item.name }}
				</span>
				<Progress
					v-show="pixelSize"
					v-if="
						showProgressComputed && (item.state === 'uploading' || item.state === 'queueing')
					"
					class="px-upload-file-list-progress"
					:percentage="item.progress"
					:size="pixelSize * 4 || undefined"
				></Progress>
			</div>
			<div class="px-upload-file-list-actions">
				<span
					v-if="item.state === 'pending'"
					class="px-upload-file-list-action"
					:class="{ 'px-upload-file-list-action__disabled': disabledComputed }"
					@click="submit(item.id)"
				>
					<Upload class="px-upload-file-list-action-icon"></Upload>
				</span>
				<span
					v-else-if="
						abortableComputed && (item.state === 'uploading' || item.state === 'queueing')
					"
					class="px-upload-file-list-action"
					:class="{ 'px-upload-file-list-action__disabled': disabledComputed }"
					@click="abort(item.id)"
				>
					<Pause class="px-upload-file-list-action-icon"></Pause>
				</span>
				<span
					v-else-if="item.state === 'error'"
					class="px-upload-file-list-action"
					:class="{ 'px-upload-file-list-action__disabled': disabledComputed }"
					@click="retry(item.id)"
				>
					<Refresh class="px-upload-file-list-action-icon"></Refresh>
				</span>
				<span
					class="px-upload-file-list-action"
					:class="{ 'px-upload-file-list-action__disabled': disabledComputed }"
					@click="remove(item.id)"
				>
					<Times class="px-upload-file-list-action-icon"></Times>
				</span>
			</div>
		</li>
	</ul>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { UploadFileListProps } from './type'
import type { FileInfo, UploadProvide } from '../upload/type'
import { UPLOAD_PROVIDE } from '../share/const/provide-key'
import { isImageFile } from '../share/util/file'
import Progress from '../progress/index.vue'
// @ts-ignore
import Upload from '@hackernoon/pixel-icon-library/icons/SVG/regular/upload.svg'
// @ts-ignore
import Refresh from '@hackernoon/pixel-icon-library/icons/SVG/regular/refresh.svg'
// @ts-ignore
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
// @ts-ignore
import Pause from '@hackernoon/pixel-icon-library/icons/SVG/regular/pause.svg'
// @ts-ignore
import ImageIcon from '@hackernoon/pixel-icon-library/icons/SVG/regular/image.svg'
// @ts-ignore
import FileIcon from 'pixelarticons/svg/file.svg'
import { usePixelSize } from '../share/hook/use-pixel-size.ts'

defineOptions({
	name: 'UploadFileList'
})

const props = withDefaults(defineProps<UploadFileListProps>(), {
	size: 'medium',
	abortable: true,
	showProgress: true
})

const uploadProvide = inject<UploadProvide | undefined>(UPLOAD_PROVIDE, undefined)

const fileListComputed = computed(() => uploadProvide?.fileList.value ?? [])

const sizeComputed = computed(() => uploadProvide?.size.value ?? props.size)

const disabledComputed = computed(() => !!uploadProvide?.disabled.value)

const abortableComputed = computed(
	() => props.abortable && (uploadProvide?.abortable.value ?? true)
)

const showProgressComputed = computed(() => !!props.showProgress)

const withEnabled = (action: (id: string) => void) => (id: string) => {
	if (!disabledComputed.value) {
		action(id)
	}
}

const submit = withEnabled((id) => uploadProvide?.submit(id))

const downloadHandler = (item: FileInfo, e: MouseEvent) => {
	if (!uploadProvide) {
		return
	}
	e.preventDefault()
	uploadProvide.download(item)
}

const abort = withEnabled((id) => uploadProvide?.abort(id))

const retry = withEnabled((id) => uploadProvide?.retry(id))

const remove = withEnabled((id) => uploadProvide?.remove(id))

const pixelSize = usePixelSize()
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
