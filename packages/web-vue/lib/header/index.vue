<template>
	<header
		class="pixelium px-header"
		:class="{
			'px-header__dark': !darkMode && !!props.dark,
			'px-header__bordered': !!props.bordered
		}"
		:style="{
			minHeight: minHeight
		}"
	>
		<slot></slot>
	</header>
</template>
<script setup lang="ts">
import { isNullish, isNumber } from 'parsnip-kit'
import { computed } from 'vue'
import { useDarkMode } from '../share/hook/use-dark-mode'
import type { HeaderProps } from './type'

defineOptions({ name: 'Header' })

const props = withDefaults(defineProps<HeaderProps>(), {
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
<style lang="less" src="../share/style/index.css" />
