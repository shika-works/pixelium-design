<template>
	<div class="pixelium px-button-group" ref="slotWrapper">
		<slot />
	</div>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { ButtonGroupProps } from './type'
import { inBrowser } from '../share/util/env'

defineOptions({
	name: 'ButtonGroup'
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
	shape: 'default',
	size: 'medium',
	disabled: false,
	variant: 'primary'
})

provide('px-button-group-props', props)

const slotWrapper = ref<null | HTMLDivElement>(null)

const callback = () => {
	nextTick(() => {
		if (slotWrapper.value) {
			slotWrapper.value.querySelectorAll('[data-px-button]').forEach((el) => el.dispatchEvent(new CustomEvent('slot-changed')))
		}
	})
}

if (inBrowser()) {
	const mutationObserver = new MutationObserver(callback)
	onMounted(() => {
		nextTick(() => {
			slotWrapper.value && mutationObserver.observe(slotWrapper.value, { childList: true })
		})
		callback()
	})

	onBeforeUnmount(() => {
		mutationObserver.disconnect()
	})
}
</script>
<style lang="less" src="./index.less"></style>
