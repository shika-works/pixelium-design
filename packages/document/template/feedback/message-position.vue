<template>
	<div style="margin-bottom: 8px">
		<px-button style="margin-right: 8px" theme="info" @click="callMessage('topLeft')">Top Left</px-button>
		<px-button style="margin-right: 8px" theme="info" @click="callMessage('top')">Top</px-button>
		<px-button theme="info" @click="callMessage('topRight')">Top Right</px-button>
	</div>
	<div>
		<px-button style="margin-right: 8px" theme="info" @click="callMessage('bottomLeft')">Bottom Left</px-button>
		<px-button style="margin-right: 8px" theme="info" @click="callMessage('bottom')">Bottom</px-button>
		<px-button theme="info" @click="callMessage('bottomRight')">Bottom Right</px-button>
	</div>
</template>
<script lang="ts" setup>
const textMap: Record<string, string> = {
	topLeft: 'Top Left',
	top: 'Top',
	topRight: 'Top Right',
	bottomLeft: 'Bottom Left',
	bottom: 'Bottom',
	bottomRight: 'Bottom Right'
}
const callMessage = (position: string) => {
	$message.info({
		content: `${textMap[position]} Message`,
		position
	})
}
</script>
