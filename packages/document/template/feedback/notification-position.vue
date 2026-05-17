<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="info" @click="callNotification('top-left')">Top Left</px-button>
			<px-button theme="info" @click="callNotification('top-right')">Top Right</px-button>
			<px-button theme="info" @click="callNotification('bottom-left')">Bottom Left</px-button>
			<px-button theme="info" @click="callNotification('bottom-right')">Bottom Right</px-button>
		</px-space>
	</px-space>
</template>
<script lang="ts" setup>
const textMap: Record<string, string> = {
	'top-left': 'Top Left',
	'top-right': 'Top Right',
	'bottom-left': 'Bottom Left',
	'bottom-right': 'Bottom Right'
}
const callNotification = (placement: string) => {
	$notification.info({
		title: 'Title',
		content: `${textMap[placement]} Message`,
		placement
	})
}
</script>
