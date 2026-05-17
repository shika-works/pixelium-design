<template>
	<px-space>
		<px-button theme="warning" @click="callNotification">10s</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const callNotification = () => {
	$notification.warning({
		content: `Close after 10s`,
		closable: true,
		duration: 10 * 1000
	})
}
</script>
