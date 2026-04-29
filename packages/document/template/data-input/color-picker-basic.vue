<template>
	<px-space>
		<px-color-picker v-model="value"></px-color-picker>
		<px-color-picker v-model:color="color"></px-color-picker>
	</px-space>
	{{ value }}
	<br />
	{{ color }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('rgb(151, 0, 255, 0.75)')
const color = ref({
	format: 'rgb',
	color: { r: 151, g: 0, b: 255, a: 191 }
})
</script>

<style lang="css" scoped>
.px-color-picker {
	width: 320px;
}
</style>
