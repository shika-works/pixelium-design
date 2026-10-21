<template>
	<div class="bubble-demo">
		<px-bubble tail-placement="bottom-left">bottom-left</px-bubble>
		<px-bubble tail-placement="bottom-right">bottom-right</px-bubble>
		<px-bubble tail-placement="top-left">top-left</px-bubble>
		<px-bubble tail-placement="top-right">top-right</px-bubble>
		<px-bubble :tail="false">tail=false</px-bubble>
		<px-bubble :tail-width="4" :tail-height="3">tailWidth=4, tailHeight=3</px-bubble>
	</div>
</template>

<style scoped>
.bubble-demo {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 16px;
}
</style>
