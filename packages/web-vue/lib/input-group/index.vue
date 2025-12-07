<template>
	<div class="pixelium px-input-group" ref="slotWrapper">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { inject, provide, ref, toRefs } from 'vue'
import type { InputGroupProps, InputGroupProvide } from './type'
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
import type { ChildrenInfo } from '../button-group/type'
import { usePropsDetect } from '../share/hook/use-props-detect'

defineOptions({
	name: 'InputGroup'
})

const props = withDefaults(defineProps<InputGroupProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false,
	readonly: false
})
const propsDetect = usePropsDetect(props, 'size')

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
const sizeComputed = createProvideComputed('size', () => [
	propsDetect.value.size && props,
	formItemProvide,
	formProvide,
	props
])

const childrenInfo = ref<ChildrenInfo[]>([])

provide<InputGroupProvide>(INPUT_GROUP_PROVIDE, {
	...toRefs(props),
	disabled: disabledComputed,
	size: sizeComputed,
	readonly: readonlyComputed,
	collectChildrenInfo: (info: ChildrenInfo) => {
		const idx = childrenInfo.value.findIndex((e) => e.id === info.id)
		if (idx >= 0) {
			childrenInfo.value[idx] = info
		} else {
			childrenInfo.value.push(info)
		}
	},
	removeChildrenInfo: (id: string) => {
		childrenInfo.value = childrenInfo.value.filter((e) => e.id != id)
	},
	childrenInfo
})

emitParentUpdate(INPUT_GROUP_UPDATE)
</script>
<style lang="less" src="./index.less"></style>
