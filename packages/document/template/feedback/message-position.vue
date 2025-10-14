<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="info" @click="callMessage('top-left')">Top Left</px-button>
			<px-button theme="info" @click="callMessage('top')">Top</px-button>
			<px-button theme="info" @click="callMessage('top-right')">Top Right</px-button>
		</px-space>
		<px-space>
			<px-button theme="info" @click="callMessage('bottom-left')">Bottom Left</px-button>
			<px-button theme="info" @click="callMessage('bottom')">Bottom</px-button>
			<px-button theme="info" @click="callMessage('bottom-right')">Bottom Right</px-button>
		</px-space>
	</px-space>
</template>
<script lang="ts" setup>
const textMap: Record<string, string> = {
	'top-eft': 'Top Left',
	top: 'Top',
	'top-right': 'Top Right',
	'bottom-left': 'Bottom Left',
	bottom: 'Bottom',
	'bottom-right': 'Bottom Right'
}
const callMessage = (placement: string) => {
	$message.info({
		content: `${textMap[placement]} Message`,
		placement
	})
}
</script>
