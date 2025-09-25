<template>
	<section
		class="pixelium px-container"
		:class="{
			'px-container__has-aside': !!aside,
			[`px-container__${props.direction}`]: !!props.direction
		}"
	>
		<slot></slot>
	</section>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
import type { ContainerProps } from './type'

defineOptions({ name: 'Container' })

const aside = ref(0)

provide('px-container-provide', aside)

const props = withDefaults(defineProps<ContainerProps>(), {})
</script>
<style lang="less" src="./index.less" />
