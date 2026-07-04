<template>
	<px-space>
		<px-card
			v-if="visible"
			title="Closable Card"
			closable
			style="width: 300px"
			@close="closeHandler"
		>
			<p>Click the X icon in the header to close this card.</p>
		</px-card>
		<px-button v-if="!visible" @click="visible = true">Show Card</px-button>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)

const closeHandler = () => {
	visible.value = false
}
</script>
