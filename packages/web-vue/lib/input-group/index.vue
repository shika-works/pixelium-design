<template>
	<div class="pixelium px-input-group" ref="slotWrapper">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import type { InputGroupProps } from './type'
import { emitParentUpdate } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import { INPUT_GROUP_PROVIDE } from '../share/const/provide-key'

defineOptions({
	name: 'InputGroup'
})

const props = withDefaults(defineProps<InputGroupProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false
})

provide(INPUT_GROUP_PROVIDE, props)

emitParentUpdate(INPUT_GROUP_UPDATE)
</script>
<style lang="less" src="./index.less"></style>
