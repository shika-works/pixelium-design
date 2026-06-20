<template>
	<px-tab
		creatable
		:default-active="tabList[0]?.index"
		@close="handleClose"
		@create="handleCreate"
	>
		<px-tab-panel
			v-for="tab in tabList"
			:key="tab.index"
			:index="tab.index"
			:title="tab.title"
			closable
		>
			<p>Content of {{ tab.title }}</p>
		</px-tab-panel>
	</px-tab>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let count = 3
const tabList = ref([
	{ index: '1', title: 'Tab 1' },
	{ index: '2', title: 'Tab 2' },
	{ index: '3', title: 'Tab 3' }
])

const handleClose = (index: string | number | symbol) => {
	const idx = tabList.value.findIndex((tab) => tab.index === index)
	if (idx !== -1) {
		tabList.value.splice(idx, 1)
	}
}

const handleCreate = () => {
	count++
	tabList.value.push({
		index: String(count),
		title: `Tab ${count}`
	})
}
</script>
