<template>
	<px-input-number
		placeholder="Please input number"
		v-model="input"
		:min="-114"
		:max="514"
	></px-input-number>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref()
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
