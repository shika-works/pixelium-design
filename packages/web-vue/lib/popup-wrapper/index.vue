<template>
	<Teleport :to="props.root || 'body'">
		<div
			v-show="destroyOnHide === false ? innerVisible : true"
			v-if="destroyOnHide !== false ? innerVisible : true"
			:class="{
				pixelium: true,
				'px-popup-wrapper': true,
				'px-popup-wrapper__fixed': props.position === 'fixed'
			}"
			:style="{
				zIndex: props.zIndex ?? currentZIndex
			}"
			v-bind="$attrs"
		>
			<slot> </slot>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useZIndex } from '../share/hook/use-z-index'
import type { PopupWrapperProps } from './type'
import { isNumber } from 'parsnip-kit'

defineOptions({
	name: 'PopupWrapper'
})

const props = withDefaults(defineProps<PopupWrapperProps>(), {
	root: 'body',
	destroyOnHide: false
})

const [currentZIndex, next, release] = useZIndex('popup')

const innerVisible = ref(!!props.visible)

let timer: any

const processVisible = (value: boolean) => {
	if (timer) {
		clearTimeout(timer)
		timer = undefined
	}
	if (value) {
		innerVisible.value = true
		next()
	} else {
		release()
		if (isNumber(props.closeDelay)) {
			timer = setTimeout(() => {
				innerVisible.value = false
			}, props.closeDelay)
		} else {
			innerVisible.value = false
		}
	}
}

watch(
	() => props.visible,
	(val) => {
		processVisible(!!val)
	}
)

defineExpose({
	updateRenderState: () => {
		nextTick(() => {
			processVisible(!!props.visible)
		})
	}
})

onMounted(() => {
	nextTick(() => {
		processVisible(!!props.visible)
	})
})
</script>

<style lang="less" src="./index.less" />
