<template>
	<div
		class="pixelium px-input-group-label"
		:class="{
			[`px-input-group-label__${sizeComputed}`]: sizeComputed,
			'px-input-group-label__inner': !!inputGroupProvide
		}"
		ref="labelRef"
	>
		<canvas ref="canvasRef" class="px-input-group-label-canvas"></canvas>
		<slot></slot>
	</div>
</template>
<script lang="ts" setup>
import { computed, inject, ref, shallowRef, toRef, useSlots } from 'vue'
import type { InputGroupLabelProps } from './type'
import { useDraw } from './draw'
import { useIndexOfChildren } from '../share/hook/use-index-of-children'
import { INPUT_GROUP_UPDATE } from '../share/const/event-bus-key'
import type { InputGroupProvide } from '../input-group/type'
import { FORM_ITEM_PROVIDE, INPUT_GROUP_PROVIDE } from '../share/const/provide-key'
import { createProvideComputed } from '../share/util/reactivity'
import type { FormItemProvide } from '../form-item/type'

defineOptions({
	name: 'InputGroupLabel'
})

const props = withDefaults(defineProps<InputGroupLabelProps>(), {})

const inputGroupProvide = inject<undefined | InputGroupProvide>(INPUT_GROUP_PROVIDE, undefined)

const [index, first, last] = inputGroupProvide
	? useIndexOfChildren(INPUT_GROUP_UPDATE + `-${inputGroupProvide.id}`)
	: [ref(0), ref(false), ref(false)]

const formItemProvide = inject<undefined | FormItemProvide>(FORM_ITEM_PROVIDE, undefined)

const borderRadiusComputed = createProvideComputed('borderRadius', [inputGroupProvide, props])
const sizeComputed = createProvideComputed(
	'size',
	() => [inputGroupProvide, props.size && props, formItemProvide, props],
	'nullish',
	(val) => val || 'medium'
)
const shapeComputed = createProvideComputed(
	'shape',
	[inputGroupProvide, props],
	'nullish',
	(val) => val || 'rect'
)
const pollSizeChangeComputed = createProvideComputed(
	'pollSizeChange',
	[inputGroupProvide, props],
	'or'
)

const nextIsTextButton = computed(() => {
	if (index.value >= 0) {
		return inputGroupProvide
			? !!(
					inputGroupProvide?.childrenInfo.value.find((e) => e.index === index.value + 1)
						?.variant === 'text'
				)
			: false
	} else {
		return false
	}
})

const hoverFlag = ref(false)
const activeFlag = ref(false)

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const labelRef = shallowRef<HTMLDivElement | null>(null)

const slots = useSlots()

useDraw(labelRef, canvasRef, {
	borderRadiusComputed,
	shapeComputed,
	sizeComputed,
	hoverFlag,
	activeFlag,
	nextIsTextButton,
	first,
	last,
	innerInputGroup: !!inputGroupProvide,
	pollSizeChangeComputed,
	backgroundColor: toRef(props, 'backgroundColor'),
	slots
})
</script>

<style lang="less" src="./index.less"></style>

<style src="../share/style/index.css" />
