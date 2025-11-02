<template>
	<div class="pixelium px-input-group" ref="slotWrapper">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { inject, provide, toRefs } from 'vue'
import type { InputGroupProps } from './type'
import { emitParentUpdate } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import {
	FORM_ITEM_PROVIDE,
	FORM_PROVIDE,
	INPUT_GROUP_PROVIDE
} from '../share/const/provide-key'
import type { FormProvide } from '../form/type'
import type { FormItemProvide } from '../form-item/type'
import { createProvideComputed } from '../share/util/reactivity'

defineOptions({
	name: 'InputGroup'
})

const props = withDefaults(defineProps<InputGroupProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false,
	readonly: false
})

const formProvide = inject<undefined | FormProvide>(FORM_PROVIDE)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const disabledComputed = createProvideComputed(
	'disabled',
	[formItemProvide, formProvide, props],
	'or'
)
const readonlyComputed = createProvideComputed(
	'readonly',
	[formItemProvide, formProvide, props],
	'or'
)
const sizeComputed = createProvideComputed('size', [formItemProvide, formProvide, props])

provide(INPUT_GROUP_PROVIDE, {
	...toRefs(props),
	disabled: disabledComputed,
	size: sizeComputed,
	readonly: readonlyComputed
})

emitParentUpdate(INPUT_GROUP_UPDATE)
</script>
<style lang="less" src="./index.less"></style>
