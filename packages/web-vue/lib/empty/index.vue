<template>
	<div class="pixelium px-empty">
		<div class="px-empty-icon-wrapper">
			<slot name="image">
				<FileDelete class="px-empty-icon"></FileDelete>
			</slot>
		</div>
		<div class="px-empty-description">
			<slot name="description">
				{{ props.description }}
			</slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import FileDelete from 'pixelarticons/svg/file-delete.svg'
import type { EmptyProps } from './type'

defineOptions({
	name: 'Empty'
})

const props = withDefaults(defineProps<EmptyProps>(), {
	description: 'No Data'
})
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
