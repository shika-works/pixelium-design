<template>
	<footer
		class="pixelium px-footer"
		:class="{
			'px-footer__dark': !darkMode && !!props.dark,
			'px-footer__bordered': !!props.bordered
		}"
		:style="{
			minHeight: minHeight
		}"
	>
		<slot></slot>
	</footer>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import type { FooterProps } from './type'
import { isNullish, isNumber } from 'parsnip-kit'

defineOptions({ name: 'Footer' })

const props = withDefaults(defineProps<FooterProps>(), {
	dark: false
})

const darkMode = useDarkMode()

const minHeight = computed(() => {
	return isNullish(props.minHeight)
		? undefined
		: isNumber(props.minHeight)
			? `${props.minHeight}px`
			: props.minHeight
})
</script>
<style lang="less" src="./index.less" />
