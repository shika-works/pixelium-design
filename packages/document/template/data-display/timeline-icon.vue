<template>
	<px-timeline>
		<px-timeline-item
			title="With icon"
			content="The `icon` slot replaces the default dot with an icon."
			mark="2026-01"
			footer="v1.0.0"
			theme="primary"
		>
			<template #icon>
				<IconHome></IconHome>
			</template>
		</px-timeline-item>
		<px-timeline-item
			title="With icon"
			content="Any icon from the icon library can be placed inside the slot."
			mark="2026-03"
			footer="v1.1.0"
			theme="success"
		>
			<template #icon>
				<IconCog></IconCog>
			</template>
		</px-timeline-item>
		<px-timeline-item
			title="With icon"
			content="The icon inherits the theme color of the item."
			mark="2026-06"
			footer="v2.0.0"
			theme="warning"
		>
			<template #icon>
				<IconEnvelope></IconEnvelope>
			</template>
		</px-timeline-item>
	</px-timeline>
</template>

<script setup lang="ts">
import { IconHome, IconCog, IconEnvelope } from '@pixelium/web-vue/icon-hn/es'
</script>
