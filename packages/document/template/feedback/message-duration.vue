<template>
	<px-button style="margin-right: 8px" @click="call(1000)">1s</px-button>
	<px-button style="margin-right: 8px" @click="call(3000)">3s</px-button>
	<px-button @click="call(10000)">10s</px-button>
</template>
<script lang="ts" setup>
const call = (duration: number) => {
	$message({
		content: `Message with Duration of ${duration}ms...`,
		duration: duration
	})
}
</script>
