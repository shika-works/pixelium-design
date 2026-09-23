<template>
	<div class="bubble-demo">
		<px-bubble>Default (shape="rect")</px-bubble>
		<px-bubble shape="round">shape="round"</px-bubble>
		<px-bubble shape="round" :border-radius="8">round + borderRadius=8 (radius wins)</px-bubble>
		<px-bubble :border-radius="12">borderRadius=12</px-bubble>
		<px-bubble :border-radius="[16, 0, 16, 0]">[16, 0, 16, 0]</px-bubble>
		<px-bubble shape="round" tail-placement="top-right">The tail corner stays square</px-bubble>
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
