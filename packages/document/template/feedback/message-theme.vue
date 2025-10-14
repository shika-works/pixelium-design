<template>
	<px-space>
		<px-button @click="callMessage('info')">Info</px-button>
		<px-button theme="success" @click="callMessage('success')">Success</px-button>
		<px-button theme="warning" @click="callMessage('warning')">Warning</px-button>
		<px-button theme="danger" @click="callMessage('error')">Error</px-button>
		<px-button color="#909399" @click="callMessage('loading')">Loading</px-button>
		<px-button theme="sakura" @click="callMessage('sakura')">Sakura</px-button>
		<px-button theme="info" @click="callMessage('normal')">Normal</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const callMessage = (type: string) => {
	const text = type.slice(0, 1).toUpperCase() + type.slice(1)
	$message[type](`${text} message`)
}
</script>
