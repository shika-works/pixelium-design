<template>
	<px-space direction="vertical">
		<px-auto-complete
			placeholder="Please input"
			v-model="input"
			:options="options"
		></px-auto-complete>
		<px-auto-complete
			placeholder="Please input"
			:options="options"
			default-value="test"
		></px-auto-complete>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')

const options = ref<string[]>([
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
])
</script>

<style lang="css" scoped>
.px-auto-complete {
	width: 320px;
}
</style>
