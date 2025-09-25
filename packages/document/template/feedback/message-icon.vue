<template>
	<px-button @click="call">Icon</px-button>
</template>
<script lang="ts" setup>
import { IconMinds } from '@pixelium/web-vue/icon-hn/es'
import { h } from 'vue'
const call = () => {
	$message.info({
		content: 'Minds Icon',
		icon: () => h(IconMinds)
	})
}
</script>
