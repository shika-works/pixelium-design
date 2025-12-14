<template>
	<main
		class="pixelium px-main"
		:class="{
			'px-main__soft': props.soft
		}"
	>
		<slot></slot>
	</main>
</template>
<script setup lang="ts">
import type { MainProps } from './type'

defineOptions({ name: 'Main' })

const props = withDefaults(defineProps<MainProps>(), {
	soft: false
})
</script>
<style lang="less" src="./index.less" />

<style lang="less" src="../share/style/index.css" />
