<template>
	<div
		v-show="visible"
		@click="scrollToTop"
		class="pixelium px-back-top"
		:style="{
			bottom: `${props.bottom}px`,
			right: `${props.right}px`,
			zIndex: props.zIndex
		}"
	>
		<slot name="trigger">
			<Button theme="info" shape="square" v-bind="props.buttonProps">
				<div class="px-back-top-icon-wrapper">
					<slot name="icon">
						<ArrowBarUp class="px-back-top-icon"></ArrowBarUp>
					</slot>
				</div>
			</Button>
		</slot>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Button from '../button/index.vue'
import { FIXED_Z_INDEX } from '../share/const'
import type { BackTopProps } from './type'
import { isString } from 'parsnip-kit'
import ArrowBarUp from 'pixelarticons/svg/arrow-bar-up.svg'

defineOptions({
	name: 'BackTop',
	inheritAttrs: false
})

const props = withDefaults(defineProps<BackTopProps>(), {
	visibilityHeight: 200,
	right: 40,
	bottom: 40,
	zIndex: FIXED_Z_INDEX
})

const visible = ref(false)
let scrollContainer: HTMLElement | Window = window

const getScrollContainer = (root?: HTMLElement | string | Window): HTMLElement | Window => {
	if (!root) {
		return window
	}

	if (isString(root)) {
		const element = document.querySelector(root)
		return (element as HTMLElement) || window
	}

	return root
}

const setScrollContainer = (root?: HTMLElement | string | Window) => {
	scrollContainer.removeEventListener('scroll', handleScroll)
	scrollContainer = getScrollContainer(root)
	scrollContainer.addEventListener('scroll', handleScroll)
	handleScroll()
}

const handleScroll = () => {
	let scrollTop = 0
	if (scrollContainer === window) {
		scrollTop =
			window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
	} else {
		scrollTop = (scrollContainer as HTMLElement).scrollTop
	}

	visible.value = scrollTop >= props.visibilityHeight
}

const scrollToTop = () => {
	if (scrollContainer === window) {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	} else {
		;(scrollContainer as HTMLElement).scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}
}

watch(
	() => props.root,
	(newRoot) => {
		nextTick(() => {
			setScrollContainer(newRoot)
		})
	},
	{ immediate: true }
)

watch(
	() => props.visibilityHeight,
	() => {
		handleScroll()
	}
)

onMounted(() => {
	if (!props.root) {
		setScrollContainer(props.root)
	}
})

onUnmounted(() => {
	scrollContainer.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
