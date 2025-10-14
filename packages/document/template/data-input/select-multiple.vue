<template>
	<px-select
		v-model="value"
		:options="options"
		placeholder="Please Select"
		multiple
	></px-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[]>([])

const options = ref<string[]>(['Ready for action', 'Locked and loaded', 'I await your command'])
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
