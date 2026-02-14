<template>
	<px-table :data="data" :columns="columns" v-model:sort-order="sortOrder"></px-table>
	<div style="margin-top: 16px">sortOrder: {{ sortOrder }}</div>
</template>

<script setup lang="ts">
import type { SortOrder, TableData } from '@pixelium/web-vue'

// If On-demand Import
// import type { SortOrder, TableData } from '@pixelium/web-vue/es'
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
		sortable: {
			orders: ['asc', 'desc'] as const,
			sortMethod: (a: TableData, b: TableData, order: 'asc' | 'desc', field?: string) => {
				const res = a.name.length - b.name.length
				return order === 'desc' ? -res : res
			},
			defaultSortOrder: 'asc' as const,
			multiple: true,
			priority: 2
		}
	},
	{
		key: 'age',
		label: 'Age',
		field: 'age',
		sortable: {
			orders: ['asc'] as const,
			multiple: true
		}
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email',
		sortable: {
			orders: ['asc', 'desc'] as const,
			multiple: true,
			priority: 1
		}
	}
]

const sortOrder = ref<SortOrder>({})
</script>
