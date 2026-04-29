<template>
	<px-space direction="vertical">
		<px-switch v-model="includeAlpha" active-label="Include Alpha"></px-switch>
		<px-color-picker :include-alpha="includeAlpha" v-model="value"></px-color-picker>
	</px-space>
	{{ value }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const includeAlpha = ref(false)
const value = ref('hwb(200, 23.92%, 0%, 0.75)')
</script>

<style lang="css" scoped>
.px-color-picker {
	width: 320px;
}
</style>
