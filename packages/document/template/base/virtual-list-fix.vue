<template>
	<px-virtual-list
		:list="list"
		style="height: 500px"
		fixed-height
		:estimated-height="20"
	></px-virtual-list>
</template>
<script lang="ts" setup>
import { shallowRef, h } from 'vue'

const list = shallowRef(
	Array.from({ length: 10000 })
		.fill(0)
		.map((_, index) => ({
			render: () => h('div', { style: `height: 20px;` }, [`Item #${index}`])
		}))
)
</script>
