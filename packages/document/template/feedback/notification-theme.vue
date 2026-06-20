<template>
	<px-space>
		<px-button @click="callNotification('info')">Info</px-button>
		<px-button theme="notice" @click="callNotification('notice')">Notice</px-button>
		<px-button theme="success" @click="callNotification('success')">Success</px-button>
		<px-button theme="warning" @click="callNotification('warning')">Warning</px-button>
		<px-button theme="danger" @click="callNotification('error')">Error</px-button>
		<px-button color="#909399" @click="callNotification('loading')">Loading</px-button>
		<px-button theme="sakura" @click="callNotification('sakura')">Sakura</px-button>
		<px-button theme="info" @click="callNotification('normal')">Normal</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const callNotification = (type: string) => {
	const text = type.slice(0, 1).toUpperCase() + type.slice(1)
	$notification[type](`${text} notification`)
}
</script>
