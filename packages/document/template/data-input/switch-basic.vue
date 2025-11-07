<template>
	<px-space>
		<px-switch v-model="value"></px-switch>
		<px-switch :default-value="true"></px-switch>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(false)
</script>
