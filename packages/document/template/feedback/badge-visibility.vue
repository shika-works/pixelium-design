<template>
	<px-space>
		<px-badge :visible="show" value="5">
			<px-button theme="info">Toggle</px-button>
		</px-badge>
		<px-button @click="show = !show">Toggle Badge</px-button>
	</px-space>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>
