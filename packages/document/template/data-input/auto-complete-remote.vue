<template>
	<px-auto-complete
		placeholder="Please input"
		v-model="input"
		:options="options"
		:loading="loading"
		append
		@input="inputHandler"
	></px-auto-complete>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')
const loading = ref(false)

const options = ref<string[]>([])

const data = [
	'pear',
	'plum',
	'cherry',
	'blueberry',
	'raspberry',
	'blackberry',
	'lemon',
	'lime',
	'pomegranate',
	'apricot'
]

const inputHandler = () => {
	options.value = []
	loading.value = true
	setTimeout(() => {
		options.value = data
		loading.value = false
	}, 6000)
}
</script>

<style lang="css" scoped>
.px-auto-complete {
	width: 320px;
}
</style>
