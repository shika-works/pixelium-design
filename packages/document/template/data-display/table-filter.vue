<template>
	<px-table :data="data" :columns="columns" v-model:filter-value="filterValue"></px-table>
	<div style="margin-top: 16px">filterValue: {{ filterValue }}</div>
</template>

<script setup lang="ts">
import type { FilterValue, TableData } from '@pixelium/web-vue'

// If On-demand Import
// import type { FilterValue, TableData } from '@pixelium/web-vue/es'
import { ref } from 'vue'

const columns = [
	{
		label: 'Name',
		field: 'name',
		key: 'name'
	},
	{
		label: 'Base Salary',
		field: 'baseSalary',
		key: 'baseSalary',
		filterable: {
			filterOptions: [{ label: '> 7000', value: 7000 }],
			filterMethod: (value: number[], record: TableData, field?: string) => {
				return value[0] ? record.baseSalary > value[0] : true
			}
		}
	},
	{
		label: 'Bonus',
		field: 'bonus',
		key: 'bonus',
		filterable: {
			filterOptions: [{ label: '> 500', value: 500 }],
			filterMethod: (value: number[], record: TableData, field?: string) => {
				return value[0] ? record.bonus > value[0] : true
			}
		}
	},
	{
		label: 'Total',
		field: 'total',
		key: 'total',
		filterable: {
			filterOptions: [{ label: '> 10000', value: 500 }],
			filterMethod: (value: number[], record: TableData, field?: string) => {
				return value[0] ? record.total > value[0] : true
			}
		}
	},
	{
		label: 'Status',
		field: 'status',
		key: 'status',
		filterable: {
			multiple: true,
			filterOptions: [
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' }
			],
			defaultFilterValue: ['active']
		}
	}
]

const data = ref([
	{
		name: 'James Wilson',
		baseSalary: 8500,
		bonus: 420,
		total: 8920,
		status: 'active'
	},
	{
		name: 'Sarah Johnson',
		baseSalary: 5200,
		bonus: 780,
		total: 5900,
		status: 'inactive'
	},
	{
		name: 'Michael Brown',
		baseSalary: 11200,
		bonus: 150,
		total: 11350,
		status: 'active'
	},
	{
		name: 'Emily Davis',
		baseSalary: 3400,
		bonus: 0,
		total: 3400,
		status: 'inactive'
	},
	{
		name: 'Robert Taylor',
		baseSalary: 9800,
		bonus: 920,
		total: 10820,
		status: 'active'
	},
	{
		name: 'Jennifer Miller',
		baseSalary: 6300,
		bonus: 310,
		total: 6610,
		status: 'active'
	},
	{
		name: 'David Anderson',
		baseSalary: 7600,
		bonus: 650,
		total: 8250,
		status: 'inactive'
	},
	{
		name: 'Lisa Martinez',
		baseSalary: 4500,
		bonus: 230,
		total: 4730,
		status: 'active'
	},
	{
		name: 'William Thomas',
		baseSalary: 10500,
		bonus: 870,
		total: 11370,
		status: 'inactive'
	},
	{
		name: 'Amanda Clark',
		baseSalary: 2900,
		bonus: 0,
		total: 2900,
		status: 'active'
	}
])

const filterValue = ref<FilterValue>({})
</script>
