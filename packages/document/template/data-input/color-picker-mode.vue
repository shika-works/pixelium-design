<template>
	<px-space direction="vertical">
		<px-select :options="options" v-model="mode"></px-select>
		<px-color-picker v-model="value" :mode="mode"></px-color-picker>
		{{ value }}
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('hsl(136, 100%, 50%, 0.75)')
const options = ['rgb', 'hex', 'hsv', 'hsl', 'hwb'].map((e) => ({
	label: e.toUpperCase(),
	value: e
}))
const mode = ref('rgb')
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
.px-color-picker {
	width: 320px;
}
</style>
