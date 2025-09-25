<template>
	<px-button @click="call">Closable Message</px-button>
</template>
<script lang="ts" setup>
const call = () => {
	$message({
		content: 'Closable Message...',
		closable: true
	})
}
</script>
