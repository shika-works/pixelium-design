<template>
	<li
		ref="wrapperRef"
		class="px-prompt-attachment-item"
		:class="{ 'px-prompt-attachment-item__disabled': disabledComputed }"
	>
		<canvas ref="canvasRef" class="px-prompt-attachment-item-canvas"></canvas>
		<div class="px-prompt-attachment-item-thumb">
			<Image
				v-if="showThumb(item)"
				class="px-prompt-attachment-item-thumb-image"
				:src="item.thumbnailUrl ?? item.url"
				:alt="item.name"
				object-fit="cover"
				:previewable="previewableComputed"
				:preview-src="item.url ?? item.thumbnailUrl"
			></Image>
			<ImageIcon
				v-else-if="isImageFile(item)"
				class="px-prompt-attachment-item-thumb-icon"
			></ImageIcon>
			<FileIcon v-else class="px-prompt-attachment-item-thumb-icon"></FileIcon>
		</div>
		<div class="px-prompt-attachment-item-body">
			<a
				v-if="item.url"
				class="px-prompt-attachment-item-name px-prompt-attachment-item-name__link"
				:href="item.url"
				:download="item.name"
				@click="downloadHandler(item, $event)"
			>
				{{ item.name }}
			</a>
			<span
				v-else
				class="px-prompt-attachment-item-name"
				:class="{ 'px-prompt-attachment-item-name__error': item.state === 'error' }"
			>
				{{ item.name }}
			</span>
			<Progress
				v-if="showProgressComputed && (item.state === 'uploading' || item.state === 'queueing')"
				class="px-prompt-attachment-item-progress"
				:percentage="item.progress"
				:gap="0"
				:border-width="0"
				:size="INTERVAL_MINI"
			></Progress>
		</div>
		<div class="px-prompt-attachment-item-actions">
			<span
				v-if="item.state === 'pending'"
				class="px-prompt-attachment-item-action"
				:class="{ 'px-prompt-attachment-item-action__disabled': disabledComputed }"
				@click="submit(item.id)"
			>
				<Upload class="px-prompt-attachment-item-action-icon"></Upload>
			</span>
			<span
				v-else-if="
					abortableComputed && (item.state === 'uploading' || item.state === 'queueing')
				"
				class="px-prompt-attachment-item-action"
				:class="{ 'px-prompt-attachment-item-action__disabled': disabledComputed }"
				@click="abort(item.id)"
			>
				<Pause class="px-prompt-attachment-item-action-icon"></Pause>
			</span>
			<span
				v-else-if="item.state === 'error'"
				class="px-prompt-attachment-item-action"
				:class="{ 'px-prompt-attachment-item-action__disabled': disabledComputed }"
				@click="retry(item.id)"
			>
				<Refresh class="px-prompt-attachment-item-action-icon"></Refresh>
			</span>
			<span
				class="px-prompt-attachment-item-action"
				:class="{ 'px-prompt-attachment-item-action__disabled': disabledComputed }"
				@click="remove(item.id)"
			>
				<Times class="px-prompt-attachment-item-action-icon"></Times>
			</span>
		</div>
	</li>
</template>
<script setup lang="ts">
import { computed, inject, shallowRef } from 'vue'
import type { PromptAttachmentItemProps } from './type'
import type { FileInfo, UploadProvide } from '../upload-provider/type'
import { UPLOAD_PROVIDE } from '../share/const/provide-key'
import { isImageFile } from '../share/util/file'
import { useDraw } from './draw'
import Image from '../image/index.vue'
import { INTERVAL_MINI } from '../share/const/style.ts'
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

defineOptions({
	name: 'PromptAttachmentItem'
})

const props = withDefaults(defineProps<PromptAttachmentItemProps>(), {
	abortable: true,
	showProgress: true,
	previewable: true
})

const uploadProvide = inject<UploadProvide | undefined>(UPLOAD_PROVIDE, undefined)

const disabledComputed = computed(() => !!uploadProvide?.disabled.value)

const abortableComputed = computed(
	() => props.abortable && (uploadProvide?.abortable.value ?? true)
)

const previewableComputed = computed(() => !!props.previewable)

const showProgressComputed = computed(() => !!props.showProgress)

const showThumb = (item: FileInfo) => isImageFile(item) && !!(item.thumbnailUrl ?? item.url)

const withEnabled = (action: (id: string) => void) => (id: string) => {
	if (!disabledComputed.value) {
		action(id)
	}
}

const submit = withEnabled((id) => uploadProvide?.submit(id))

const abort = withEnabled((id) => uploadProvide?.abort(id))

const retry = withEnabled((id) => uploadProvide?.retry(id))

const remove = withEnabled((id) => uploadProvide?.remove(id))

const downloadHandler = (item: FileInfo, e: MouseEvent) => {
	if (!uploadProvide) {
		return
	}
	e.preventDefault()
	uploadProvide.download(item)
}

const wrapperRef = shallowRef<HTMLElement | null>(null)
const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

useDraw(wrapperRef, canvasRef, {
	disabled: disabledComputed
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
