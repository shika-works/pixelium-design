<template>
	<px-action-list
		:default-expanded="['search']"
		line-variant="dashed"
		collapsible
		:max-display-items="3"
		default-collapsed
	>
		<template #fold="{ collapsed, hiddenCount, total }">
			{{ collapsed ? hiddenCount + ' more steps' : 'Show less' }}
		</template>
		<px-action-list-item index="search" status="success" content="Found 12 sources.">
			<template #icon>
				<IconSearch></IconSearch>
			</template>
			<template #title>
				<span style="color: #0960bd">Search the web</span>
			</template>
			<template #detail>
				<div style="color: #86909c">
					The detail slot renders anything, from styled text to another component.
				</div>
			</template>
		</px-action-list-item>
		<px-action-list-item
			index="read"
			status="running"
			title="Read the sources"
			content="Page 3 of 12"
		>
			<template #content>
				<span style="color: #00b42a">The content slot sits next to the title.</span>
			</template>
			<template #detail>
				<div style="color: #d97706">Expanded through the detail slot.</div>
			</template>
		</px-action-list-item>
		<px-action-list-item
			index="write"
			status="pending"
			title="Write the summary"
			content="Waiting for the previous step."
		/>
		<px-action-list-item index="review" status="pending" title="Review the summary" />
		<px-action-list-item index="publish" status="pending" title="Publish the summary" />
	</px-action-list>
</template>

<script setup lang="ts">
import { IconSearch } from '@pixelium/web-vue/icon-hn/es'
</script>
