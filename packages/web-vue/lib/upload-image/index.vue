<template>
	<div class="pixelium px-upload-image" :class="`px-upload-image__${sizeComputed}`">
		<div
			v-for="item in fileListComputed"
			:key="item.id"
			class="px-upload-image-item corner-gradient-light"
		>
			<Image
				v-if="showThumb(item)"
				class="px-upload-image-thumb"
				:src="item.thumbnailUrl ?? item.url"
				:alt="item.name"
				object-fit="contain"
				:previewable="previewableComputed"
				:preview-src="item.url ?? item.thumbnailUrl"
			></Image>
			<div v-else-if="item.state !== 'error'" class="px-upload-image-icon">
				<ImageIcon v-if="isImageFile(item)" class="px-upload-image-file-icon"></ImageIcon>
				<FileIcon v-else class="px-upload-image-file-icon"></FileIcon>
			</div>
			<div
				v-if="item.state === 'uploading' || item.state === 'queueing'"
				class="px-upload-image-mask"
			>
				<Mask :z-index="0" :grid="false" :color="maskColorComputed"></Mask>
				<div class="px-upload-image-content">
					<Progress
						v-if="showProgressComputed"
						class="px-upload-image-progress"
						:percentage="item.progress"
						size="small"
					></Progress>
					<div class="px-upload-image-actions">
						<span
							v-if="abortableComputed"
							class="px-upload-image-action"
							:class="{ 'px-upload-image-action__disabled': disabledComputed }"
							@click="abort(item.id)"
						>
							<Pause class="px-upload-image-action-icon"></Pause>
						</span>
					</div>
				</div>
			</div>
			<div v-else-if="item.state === 'pending'" class="px-upload-image-mask">
				<Mask :z-index="0" :grid="false" :color="maskColorComputed"></Mask>
				<div class="px-upload-image-content">
					<div class="px-upload-image-actions">
						<span
							class="px-upload-image-action"
							:class="{ 'px-upload-image-action__disabled': disabledComputed }"
							@click="submit(item.id)"
						>
							<Upload class="px-upload-image-action-icon"></Upload>
						</span>
					</div>
				</div>
			</div>
			<div v-else-if="item.state === 'error'" class="px-upload-image-content">
				<ImageIcon
					v-if="isImageFile(item)"
					class="px-upload-image-file-icon px-upload-image-file-icon__error"
				></ImageIcon>
				<FileIcon
					v-else
					class="px-upload-image-file-icon px-upload-image-file-icon__error"
				></FileIcon>
				<div class="px-upload-image-actions">
					<span
						class="px-upload-image-action"
						:class="{ 'px-upload-image-action__disabled': disabledComputed }"
						@click="retry(item.id)"
					>
						<Refresh class="px-upload-image-action-icon"></Refresh>
					</span>
				</div>
			</div>
			<div class="px-upload-image-corner">
				<span v-if="item.url" class="px-upload-image-download" @click="downloadHandler(item)">
					<Download class="px-upload-image-action-icon"></Download>
				</span>
				<span
					class="px-upload-image-remove"
					:class="{ 'px-upload-image-remove__disabled': disabledComputed }"
					@click="remove(item.id)"
				>
					<Times class="px-upload-image-action-icon"></Times>
				</span>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { UploadImageProps } from './type'
import type { FileInfo, UploadProvide } from '../upload/type'
import { UPLOAD_PROVIDE } from '../share/const/provide-key'
import { isImageFile } from '../share/util/file'
import { useDarkMode } from '../share/hook/use-dark-mode'
import Image from '../image/index.vue'
import Progress from '../progress/index.vue'
import Mask from '../mask/index.vue'
// @ts-ignore
import Upload from '@hackernoon/pixel-icon-library/icons/SVG/regular/upload.svg'
// @ts-ignore
import Refresh from '@hackernoon/pixel-icon-library/icons/SVG/regular/refresh.svg'
// @ts-ignore
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
// @ts-ignore
import Download from '@hackernoon/pixel-icon-library/icons/SVG/regular/download.svg'
// @ts-ignore
import Pause from '@hackernoon/pixel-icon-library/icons/SVG/regular/pause.svg'
// @ts-ignore
import ImageIcon from '@hackernoon/pixel-icon-library/icons/SVG/regular/image.svg'
// @ts-ignore
import FileIcon from 'pixelarticons/svg/file.svg'

defineOptions({
	name: 'UploadImage'
})

const props = withDefaults(defineProps<UploadImageProps>(), {
	size: 'medium',
	abortable: true,
	previewable: true,
	showProgress: true
})

const uploadProvide = inject<UploadProvide | undefined>(UPLOAD_PROVIDE, undefined)

const darkMode = useDarkMode()

const fileListComputed = computed(() => uploadProvide?.fileList.value ?? [])

const sizeComputed = computed(() => uploadProvide?.size.value ?? props.size)

const disabledComputed = computed(() => !!uploadProvide?.disabled.value)

const abortableComputed = computed(
	() => props.abortable && (uploadProvide?.abortable.value ?? true)
)

const previewableComputed = computed(() => !!props.previewable)

const showProgressComputed = computed(() => !!props.showProgress)

const maskColorComputed = computed(() =>
	darkMode.value ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'
)

const showThumb = (item: FileInfo) => isImageFile(item) && !!(item.thumbnailUrl ?? item.url)

const withEnabled = (action: (id: string) => void) => (id: string) => {
	if (!disabledComputed.value) {
		action(id)
	}
}

const submit = withEnabled((id) => uploadProvide?.submit(id))

const downloadHandler = (item: FileInfo) => uploadProvide?.download(item)

const abort = withEnabled((id) => uploadProvide?.abort(id))

const retry = withEnabled((id) => uploadProvide?.retry(id))

const remove = withEnabled((id) => uploadProvide?.remove(id))
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
