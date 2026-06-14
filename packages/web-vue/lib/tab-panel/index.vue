<template>
	<div
		v-show="active"
		class="px-tab-panel"
		:class="{
			[`px-tab-panel__${tabsProvide?.placement.value}`]: !!tabsProvide?.placement.value
		}"
		role="tabpanel"
		:aria-hidden="!active"
	>
		<slot />
	</div>
</template>
<script setup lang="ts">
import type { TabPanelProps } from './type'
import { TAB_PROVIDE } from '../share/const/provide-key.ts'
import type { TabProvide } from '../tab/type.ts'
import { computed, inject } from 'vue'

defineOptions({
	name: 'TabPanel'
})

const props = withDefaults(defineProps<TabPanelProps>(), {
	title: ''
})

const tabsProvide = inject<TabProvide | null>(TAB_PROVIDE, null)

const active = computed(() => {
	return tabsProvide?.active.value === props.index
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
