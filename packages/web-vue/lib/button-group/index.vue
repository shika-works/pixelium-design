<template>
	<div class="pixelium px-button-group">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { inject, provide, ref, toRefs } from 'vue'
import type { ButtonGroupProps, ButtonGroupProvide, ChildrenInfo } from './type'
import { emitParentUpdate } from '../share/hook/use-index-of-children'
import { BUTTON_GROUP_UPDATE } from '../share/const/event-bus-key'
import {
	BUTTON_GROUP_PROVIDE,
	FORM_ITEM_PROVIDE,
	FORM_PROVIDE
} from '../share/const/provide-key'
import type { FormProvide } from '../form/type'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'

defineOptions({
	name: 'ButtonGroup'
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
	shape: 'rect',
	disabled: false
})

const formProvide = inject<undefined | FormProvide>(FORM_PROVIDE)
const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE)

const sizeComputed = createProvideComputed(
	'size',
	() => [props.size && props, formItemProvide, formProvide, props],
	'nullish',
	(val) => val || 'medium'
)
const disabledComputed = createProvideComputed(
	'disabled',
	[formItemProvide, formProvide, props],
	(pre, value, cur) => {
		return pre || value || ('readonly' in cur && cur['readonly'].value)
	}
)

const childrenInfo = ref<ChildrenInfo[]>([])

provide<ButtonGroupProvide>(BUTTON_GROUP_PROVIDE, {
	...toRefs(props),
	size: sizeComputed,
	disabled: disabledComputed,
	childrenInfo,
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
	}
})

emitParentUpdate(BUTTON_GROUP_UPDATE)
</script>
<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
