<template>
	<px-select
		v-model="value"
		:options="options"
		placeholder="Please Select"
		@focus="focusHandler"
		:loading="loading"
	></px-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(null)

const options = ref<string[]>([])
const loading = ref(false)

const list = ['Ready to work', 'Work, work', 'Work completed']

const focusHandler = () => {
	options.value = []
	loading.value = true
	setTimeout(() => {
		options.value = list
		loading.value = false
	}, 5000)
}
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
