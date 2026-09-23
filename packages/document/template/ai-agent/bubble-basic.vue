<template>
	<div class="bubble-demo">
		<px-bubble>Hi! I am a bubble with a tail at the bottom-left corner.</px-bubble>
		<px-bubble class="from-user" tail-placement="bottom-right" variant="primary">
			Bubbles are great for chats, comments and annotations.
		</px-bubble>
	</div>
</template>

<style scoped>
.bubble-demo {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	max-width: 560px;
}
.from-user {
	align-self: flex-end;
}
</style>
