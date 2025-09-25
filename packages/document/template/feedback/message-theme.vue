<template>
	<px-button style="margin-right: 8px" @click="callMessage('info')">Info</px-button>
	<px-button style="margin-right: 8px" theme="success" @click="callMessage('success')">Success</px-button>
	<px-button style="margin-right: 8px" theme="warning" @click="callMessage('warning')">Warning</px-button>
	<px-button style="margin-right: 8px" theme="danger" @click="callMessage('error')">Error</px-button>
	<px-button style="margin-right: 8px" color="#909399" @click="callMessage('loading')">Loading</px-button>
	<px-button style="margin-right: 8px" theme="sakura" @click="callMessage('sakura')">Sakura</px-button>
	<px-button theme="info" @click="callMessage('normal')">Normal</px-button>
</template>
<script lang="ts" setup>
const callMessage = (type: string) => {
	$message[type](`${type} message`)
}
</script>
