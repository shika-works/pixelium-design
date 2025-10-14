<template>
	<px-space>
		<px-button @click="callMessage('info')">Info, Closable</px-button>
		<px-button theme="success" @click="callMessage('success')">Success, Closable</px-button>
		<px-button theme="warning" @click="callMessage('warning')">Warning, Closable</px-button>
		<px-button theme="danger" @click="callMessage('error')">Error, Closable</px-button>
		<px-button color="#909399" @click="callMessage('loading')">Loading, Closable</px-button>
		<px-button theme="sakura" @click="callMessage('sakura')">Sakura, Closable</px-button>
		<px-button theme="info" @click="callMessage('normal')">Normal, Closable</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const callMessage = (type: string) => {
	const text = type.slice(0, 1).toUpperCase() + type.slice(1)
	$message[type]({
		content: `${text} message, closable`,
		closable: true
	})
}
</script>
