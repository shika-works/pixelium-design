<template>
	<px-table
		:data="data"
		:columns="columns"
		:pagination="{ hideWhenSinglePage: true }"
	></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
	{ key: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
	{ key: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
	{ key: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' }
])

const columns = [
	{
		key: 'name',
		label: 'Name',
		field: 'name'
	},
	{
		key: 'age',
		label: 'Age',
		field: 'age'
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email'
	}
]
</script>
