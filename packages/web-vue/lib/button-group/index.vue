<template>
	<div class="pixelium px-button-group">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import type { ButtonGroupProps } from './type'
import { emitParentUpdate } from '../share/hook/use-index-of-children'
import { BUTTON_GROUP_UPDATE } from '../share/const/event-bus-key'
import { BUTTON_GROUP_PROVIDE } from '../share/const/provide-key'

defineOptions({
	name: 'ButtonGroup'
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false
})

provide(BUTTON_GROUP_PROVIDE, props)

emitParentUpdate(BUTTON_GROUP_UPDATE)
</script>
<style lang="less" src="./index.less"></style>
