<template>
	<px-checkbox
		v-model="all"
		@change="selectAllChangeHandler"
		:indeterminate="group.length > 0 && group.length < options.length"
		>Select All</px-checkbox
	>
	<br />
	<br />
	<px-checkbox-group v-model="group" @change="groupChangeHandler">
		<px-checkbox v-for="option in options" :key="option" :value="option">
			{{ option }}
		</px-checkbox>
	</px-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const group = ref<string[]>([])
const all = ref(false)

const options = ['Blue Jazz', 'Carrot', 'Coffee Bean', 'Parsnip']

const selectAllChangeHandler = (value: boolean) => {
	if (value) {
		group.value = [...options]
	} else {
		group.value = []
	}
}

const groupChangeHandler = (value: string[]) => {
	if (value.length === options.length) {
		all.value = true
	} else {
		all.value = false
	}
}
</script>
