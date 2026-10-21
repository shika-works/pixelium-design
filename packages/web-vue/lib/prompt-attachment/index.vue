<template>
	<ul class="pixelium px-prompt-attachment" :class="`px-prompt-attachment__${sizeComputed}`">
		<PromptAttachmentItem
			v-for="item in fileListComputed"
			:key="item.id"
			:item="item"
			:abortable="props.abortable"
			:show-progress="props.showProgress"
			:previewable="props.previewable"
		></PromptAttachmentItem>
	</ul>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { PromptAttachmentProps } from './type'
import type { UploadProvide } from '../upload-provider/type'
import { UPLOAD_PROVIDE } from '../share/const/provide-key'
import PromptAttachmentItem from '../prompt-attachment-item/index.vue'

defineOptions({
	name: 'PromptAttachment'
})

const props = withDefaults(defineProps<PromptAttachmentProps>(), {
	abortable: true,
	showProgress: true,
	previewable: true
})

const uploadProvide = inject<UploadProvide | undefined>(UPLOAD_PROVIDE, undefined)

const fileListComputed = computed(() => uploadProvide?.fileList.value ?? [])

const sizeComputed = computed(() => uploadProvide?.size.value ?? 'medium')
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
