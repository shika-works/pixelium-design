<template>
	<px-input-number
		placeholder="Please input number"
		v-model="input"
		:precision="4"
	></px-input-number>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref(1919.81)
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
