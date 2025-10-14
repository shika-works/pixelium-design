<template>
	<px-space>
		<IconUser :size="40"></IconUser>
		<IconUser :size="32"></IconUser>
		<IconUser :size="24"></IconUser>
		<IconUser style="font-size: 24px"></IconUser>
		<IconUser style="font-size: 32px"></IconUser>
		<IconUser style="font-size: 40px"></IconUser>
	</px-space>
	<px-space style="margin-top: 8px">
		<IconMessage color="rgba(0, 168, 145, 1)"></IconMessage>
		<IconMessage color="rgba(0, 180, 42, 1)"></IconMessage>
		<IconMessage color="rgba(255, 125, 0, 1)"></IconMessage>
		<IconMessage style="color: rgba(255, 125, 0, 1)"></IconMessage>
		<IconMessage style="color: rgba(0, 180, 42, 1)"></IconMessage>
		<IconMessage style="color: rgba(0, 168, 145, 1)"></IconMessage>
	</px-space>
</template>
<script setup lang="ts">
import { IconUser, IconMessage } from '@pixelium/web-vue/icon-hn/es'
</script>
