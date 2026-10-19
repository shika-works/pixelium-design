<template>
	<px-space direction="vertical" :width="480" :margin="{ y: 8 }">
		<px-button @click="toggleAll">{{ allExpanded ? 'Collapse all' : 'Expand all' }}</px-button>
		<px-action-list :expanded="expanded" @update:expanded="expanded = $event">
			<px-action-list-item
				index="search"
				title="Search the web"
				content="12 sources found"
				detail="Kept the 12 most relevant pages of the query as candidates."
			/>
			<px-action-list-item
				index="read"
				title="Read the sources"
				content="Page 3 of 12"
				detail="Extracted the key points of every page and stored them as notes for the summary."
			/>
			<px-action-list-item
				index="write"
				title="Write the summary"
				content="Waiting"
				detail="Drafted a 200-word summary from the notes and asked the user to review it."
			/>
			<px-action-list-item
				index="skip"
				:expandable="false"
				title="Keep this row closed"
				content="A detail is set, but expandable is false."
				detail="This row never expands, no matter how many times its header is clicked."
			/>
		</px-action-list>
	</px-space>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ActionListItemIndex } from '@pixelium/web-vue'

const expandableIndices: ActionListItemIndex[] = ['search', 'read', 'write']

const expanded = ref<ActionListItemIndex[]>(['search'])

const allExpanded = computed(() => expanded.value.length === expandableIndices.length)

const toggleAll = () => {
	expanded.value = allExpanded.value ? [] : [...expandableIndices]
}
</script>
