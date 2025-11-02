<template>
	<div class="pixelium px-button-group">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { inject, provide, toRefs } from 'vue'
import type { ButtonGroupProps } from './type'
import { emitParentUpdate } from '../share/hook/use-index-of-children'
import { BUTTON_GROUP_UPDATE } from '../share/const/event-bus-key'
import { BUTTON_GROUP_PROVIDE, FORM_PROVIDE } from '../share/const/provide-key'
import type { FormProvide } from '../form/type'
import { createProvideComputed } from '../share/util/reactivity'

defineOptions({
	name: 'ButtonGroup'
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false
})

const formProvide = inject<undefined | FormProvide>(FORM_PROVIDE)

const sizeComputed = createProvideComputed('size', [formProvide, props])
const disabledComputed = createProvideComputed(
	'disabled',
	[formProvide, props],
	(pre, value, cur) => {
		return pre || value || ('readonly' in cur && cur['readonly'].value)
	}
)

provide(BUTTON_GROUP_PROVIDE, {
	...toRefs(props),
	size: sizeComputed,
	disabled: disabledComputed
})

emitParentUpdate(BUTTON_GROUP_UPDATE)
</script>
<style lang="less" src="./index.less"></style>
