<template>
	<px-virtual-list :list="list" style="height: 500px" :estimated-height="20"></px-virtual-list>
</template>
<script lang="ts" setup>
import { ref, h } from 'vue'

const list = ref(
	Array.from({ length: 10000 })
		.fill(0)
		.map((_, index) => ({
			render: () => h('div', { style: `height: ${20 + index / 100}px;` }, [`Item #${index}`])
		}))
)
</script>
