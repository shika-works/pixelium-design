<template>
	<px-action-list :items="items" />
</template>

<script setup lang="ts">
import type { ActionListItemData } from '@pixelium/web-vue'

const items: ActionListItemData[] = [
	{
		status: 'success',
		title: 'Search the web',
		content: 'Found 12 sources about pixel rendering.',
		detail: 'Kept the 12 most relevant pages of the query as candidates.'
	},
	{
		status: 'running',
		title: 'Read the sources',
		content: 'Reading page 3 of 12...'
	},
	{
		status: 'pending',
		title: 'Write the summary',
		content: 'Waiting for the previous step to finish.'
	},
	{
		title: 'Ask the user to review',
		content: 'No status is set, so the row stays pending.'
	}
]
</script>
