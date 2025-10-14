<template>
	<px-space direction="vertical">
		<px-input-number
			placeholder="Please input number"
			v-model="input1"
			:step="2"
			:min="-13"
			:max="23"
		></px-input-number>
		<px-input-number
			placeholder="Please input number"
			v-model="input2"
			:step="2"
			strick-step
			:min="-13"
			:max="23"
		></px-input-number>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input1 = ref(0)
const input2 = ref(0)
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
