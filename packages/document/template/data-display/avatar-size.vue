<template>
	<px-space>
		<px-avatar size="small">
			<IconUser></IconUser>
		</px-avatar>
		<px-avatar>
			<IconUser></IconUser>
		</px-avatar>
		<px-avatar size="large">
			<IconUser style="font-size: 16px"></IconUser>
		</px-avatar>
		<px-avatar :size="50">
			<IconUser style="font-size: 18px"></IconUser>
		</px-avatar>
	</px-space>
</template>

<script setup lang="ts">
import { IconUser } from '@pixelium/web-vue/icon-hn/es'
</script>
