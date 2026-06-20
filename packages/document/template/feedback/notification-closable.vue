<template>
	<px-space>
		<px-button theme="notice" @click="callNotification">Closable</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const callNotification = () => {
	$notification.notice({
		content: `Closable`,
		closable: true
	})
}
</script>
