<template>
	<px-table :data="data" :columns="columns"></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
	{ key: 1, name: 'Olivia', age: 28, email: 'olivia@example.com' },
	{ key: 2, name: 'James', age: 32, email: 'james@example.com' },
	{ key: 3, name: 'Sophia', age: 24, email: 'sophia@example.com' },
	{ key: 4, name: 'William', age: 29, email: 'william@example.com' },
	{ key: 5, name: 'Emma', age: 31, email: 'emma@example.com' }
])

const columns = [
	{
		key: 'name',
		label: 'Name',
		field: 'name',
		align: 'left'
	},
	{
		key: 'age',
		label: 'Age',
		field: 'age',
		align: 'center'
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email',
		align: 'right'
	}
]
</script>
