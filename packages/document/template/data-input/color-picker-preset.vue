<template>
	<px-color-picker :preset="preset" v-model="value"></px-color-picker>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const preset = [
	'rgb(255, 0, 0)',
	'rgb(255, 255, 0)',
	'rgb(0, 255, 0)',
	'rgb(0, 255, 255)',
	'rgb(0, 0, 255)',
	'rgb(255, 0, 255)',
	'rgb(0, 0, 0)',
	'rgb(255, 255, 255)'
]
const value = ref('rgb(255, 163, 0)')
</script>

<style lang="css" scoped>
.px-color-picker {
	width: 320px;
}
</style>
