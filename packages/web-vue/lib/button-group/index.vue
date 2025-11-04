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
