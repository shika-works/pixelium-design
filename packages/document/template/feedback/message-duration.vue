<template>
	<px-space>
		<px-button @click="call(1000)">1s</px-button>
		<px-button @click="call(3000)">3s</px-button>
		<px-button @click="call(10000)">10s</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const call = (duration: number) => {
	$message({
		content: `Message with Duration of ${duration}ms...`,
		duration: duration
	})
}
</script>
