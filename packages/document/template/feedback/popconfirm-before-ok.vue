<template>
	<px-popconfirm content="This will run an async check" :onBeforeOk="beforeOk">
		<px-button>Async Confirm</px-button>
	</px-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const calls = ref(0)
const beforeOk = async () => {
	calls.value += 1
	if (calls.value % 2 === 1) {
		await new Promise((r) => setTimeout(r, 500))
		return false
	}
	await new Promise((r) => setTimeout(r, 500))
	return true
}
</script>
