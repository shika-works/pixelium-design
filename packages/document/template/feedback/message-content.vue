<template>
	<px-button @click="call" theme="success">Content</px-button>
</template>
<script lang="ts" setup>
import { h } from 'vue'
import { Button } from '@pixelium/web-vue'
const call = () => {
	$message.info({
		content: () => h('div', {}, ['It can be a ', h(Button, {}, 'Button')])
	})
}
</script>
