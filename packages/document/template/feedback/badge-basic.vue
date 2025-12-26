<template>
	<px-space>
		<px-badge value="8">
			<px-button>Inbox</px-button>
			<template #icon>
				<IconEnvelope></IconEnvelope>
			</template>
		</px-badge>
	</px-space>
</template>

<script setup lang="ts">
import { IconEnvelope } from '@pixelium/web-vue/icon-hn/es'
</script>
