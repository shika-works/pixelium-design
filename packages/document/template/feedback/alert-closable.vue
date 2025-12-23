<template>
	<px-space direction="vertical">
		<px-alert closable @close="closeHandler('info')">Info</px-alert>
		<px-alert closable type="success" @close="closeHandler('success')">Success</px-alert>
		<px-alert closable type="warning" @close="closeHandler('warning')">Warning</px-alert>
		<px-alert closable type="error" @close="closeHandler('error')">Error</px-alert>
		<px-alert closable type="sakura" @close="closeHandler('sakura')">Sakura</px-alert>
		<px-alert closable type="loading" @close="closeHandler('loading')">Loading</px-alert>
		<px-alert closable type="normal" @close="closeHandler('normal')">Normal</px-alert>
	</px-space>
</template>
<script lang="ts" setup>
const closeHandler = (type: string) => {
	$message[type](`Closed ${type} alert`)
}
</script>
