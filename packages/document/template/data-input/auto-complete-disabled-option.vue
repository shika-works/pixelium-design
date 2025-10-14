<template>
	<px-auto-complete
		placeholder="Please input"
		v-model="input"
		:options="options"
	></px-auto-complete>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')

const options = ref(
	[
		'apple',
		'banana',
		'orange',
		'grape',
		'strawberry',
		'kiwi',
		'mango',
		'pineapple',
		'watermelon',
		'peach'
	].map((item, index) => {
		return {
			label: item,
			value: item,
			disabled: (index & 1) === 1
		}
	})
)
</script>

<style lang="css" scoped>
.px-auto-complete {
	width: 320px;
}
</style>
