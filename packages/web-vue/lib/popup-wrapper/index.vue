<template>
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
	>
		<slot> </slot>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from 'vue'
import { useZIndex } from '../share/hook/use-z-index'
import type { PopupWrapperEvents, PopupWrapperProps } from './type'
import { isNumber } from 'parsnip-kit'
import { usePopupWrapperManager } from './use-popup-wrapper-manager'

defineOptions({
	name: 'PopupWrapper'
})

const props = withDefaults(defineProps<PopupWrapperProps>(), {
	root: 'body',
	destroyOnHide: false,
	preventDocumentScroll: false,
	escToClose: false
})

const emits = defineEmits<PopupWrapperEvents>()

const id = useId()

const [currentZIndex, next, release] = useZIndex('popup')

const innerVisible = ref(!!props.visible)

let timer: any

const popupWrapperInfo = {
	id,
	escKeydownHandler: (e: KeyboardEvent) => {
		if (!props.escToClose) {
			return
		}
		emits('escKeydown', e)
	},
	needPreventDocumentScroll: () => {
		return props.preventDocumentScroll
	},
	getZIndex: () => {
		return props.zIndex ?? currentZIndex.value
	}
}

const [activate, hide] = usePopupWrapperManager(popupWrapperInfo)

const processVisible = (value: boolean) => {
	if (timer) {
		clearTimeout(timer)
		timer = undefined
	}
	if (value) {
		innerVisible.value = true
		next()
		activate()
	} else {
		release()
		hide()
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
