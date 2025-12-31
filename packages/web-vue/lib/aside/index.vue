<template>
	<aside
		class="pixelium px-aside"
		:class="{
			'px-aside__dark': !darkMode && !!props.dark,
			'px-aside__bordered': !!props.bordered,
			[`px-aside__${props.side}`]: true
		}"
		:style="{
			width: width
		}"
	>
		<slot></slot>
	</aside>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, type Ref } from 'vue'
import type { AsideProps } from './type'
import { useDarkMode } from '../share/hook/use-dark-mode'
import { isNullish, isNumber } from 'parsnip-kit'
import { CONTAINER_PROVIDE } from '../share/const/provide-key'

defineOptions({ name: 'Aside' })

const asideCounter = inject<Ref<number> | undefined>(CONTAINER_PROVIDE, undefined)

onMounted(() => {
	if (asideCounter) {
		asideCounter.value += 1
	}
})

onBeforeUnmount(() => {
	if (asideCounter) {
		asideCounter.value -= 1
	}
})

const props = withDefaults(defineProps<AsideProps>(), {
	dark: false,
	bordered: false,
	side: 'left'
})

const darkMode = useDarkMode()

const width = computed(() => {
	return isNullish(props.width)
		? undefined
		: isNumber(props.width)
			? `${props.width}px`
			: props.width
})
</script>
<style lang="less" src="./index.less" />
<style lang="less" src="../share/style/index.css" />
