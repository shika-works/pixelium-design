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
import { CONTAINER_PROVIDE } from '../share/const/provide-key'

defineOptions({ name: 'Container' })

const aside = ref(0)

provide(CONTAINER_PROVIDE, aside)

const props = withDefaults(defineProps<ContainerProps>(), {})
</script>
<style lang="less" src="./index.less" />
<style lang="less" src="../share/style/index.css" />
