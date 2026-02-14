<template>
	<px-space>
		<px-badge dot>
			<px-button>Messages</px-button>
		</px-badge>
		<px-badge dot>
			<IconBell :size="24"></IconBell>
		</px-badge>
	</px-space>
</template>
<script setup lang="ts">
import { IconBell } from '@pixelium/web-vue/icon-hn/es'
</script>
