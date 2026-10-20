<template>
	<px-space direction="vertical" :width="480" :margin="{ y: 12 }">
		<px-action-list :items="items" collapsible :max-display-items="2" default-collapsed />
		<px-action-list collapsible :max-display-items="3" default-collapsed fold-placement="end">
			<px-action-list-item
				v-for="(item, index) in items"
				:key="item.title"
				:index="index"
				:status="item.status"
				:title="item.title"
				:content="item.content"
			/>
		</px-action-list>
	</px-space>
</template>

<script setup lang="ts">
import type { ActionListItemData } from '@pixelium/web-vue'

const items: ActionListItemData[] = [
	{ status: 'success', title: 'Understand the request', content: 'The goal is clear.' },
	{ status: 'success', title: 'Search the web', content: 'Found 6 sources.' },
	{ status: 'running', title: 'Read the sources', content: 'Reading page 2 of 6...' },
	{ status: 'pending', title: 'Write the summary' },
	{ status: 'pending', title: 'Review the summary' }
]
</script>
