<template>
	<div class="pixelium px-input-group" ref="slotWrapper">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { inject, provide, ref, toRefs, useId } from 'vue'
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

defineOptions({
	name: 'InputGroup'
})

const props = withDefaults(defineProps<InputGroupProps>(), {
	shape: 'rect',
	disabled: false,
	readonly: false
})

const formProvide = inject<undefined | FormProvide>(FORM_PROVIDE, undefined)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

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
const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, formProvide, props],
	'nullish',
	(val) => val || 'medium'
)
const pollSizeComputed = createProvideComputed(
	'pollSizeChange',
	[formItemProvide, formProvide, props],
	'or'
)

const childrenInfo = ref<ChildrenInfo[]>([])

const id = useId()

provide<InputGroupProvide>(INPUT_GROUP_PROVIDE, {
	...toRefs(props),
	disabled: disabledComputed,
	size: sizeComputed,
	readonly: readonlyComputed,
	pollSizeChange: pollSizeComputed,
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
	childrenInfo,
	id
})

emitParentUpdate(INPUT_GROUP_UPDATE + `-${id}`)
</script>
<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
