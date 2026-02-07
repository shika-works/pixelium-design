<template>
	<div style="display: flex; align-items: center">
		<px-switch
			active-label="Fixed"
			inactive-label="Unfixed"
			v-model="summaryFixed"
			style="margin-right: 16px"
		></px-switch>
		Placement:
		<px-switch
			active-label="Start"
			inactive-label="End"
			v-model="summaryStart"
			style="margin-left: 8px"
		></px-switch>
	</div>
	<px-table
		:data="data"
		:columns="columns"
		:summary="summary"
		style="margin-top: 16px"
		:table-area-props="{ style: 'max-height: 300px' }"
	></px-table>
</template>

<script setup lang="ts">
import type { TableOptionsArg } from '@pixelium/web-vue'
// If on-demand import
// import type { TableOptionsArg } from '@pixelium/web-vue/es'

import { computed, ref } from 'vue'

const columns = [
	{
		label: 'Name',
		field: 'name',
		key: 'name'
	},
	{
		label: 'Base Salary',
		field: 'baseSalary',
		key: 'baseSalary'
	},
	{
		label: 'Bonus',
		field: 'bonus',
		key: 'bonus'
	},
	{
		label: 'Total',
		field: 'total',
		key: 'total'
	},
	{
		label: 'Status',
		field: 'status',
		key: 'status'
	}
]

const data = ref([
	{
		name: 'Emma Johnson',
		baseSalary: 8500,
		bonus: 420,
		total: 8920,
		status: 'active'
	},
	{
		name: 'David Smith',
		baseSalary: 6500,
		bonus: 780,
		total: 7280,
		status: 'inactive'
	},
	{
		name: 'Sophia Williams',
		baseSalary: 11200,
		bonus: 150,
		total: 11350,
		status: 'active'
	},
	{
		name: 'Michael Brown',
		baseSalary: 4200,
		bonus: 0,
		total: 4200,
		status: 'inactive'
	},
	{
		name: 'Olivia Davis',
		baseSalary: 9800,
		bonus: 920,
		total: 10720,
		status: 'active'
	},
	{
		name: 'James Wilson',
		baseSalary: 7300,
		bonus: 310,
		total: 7610,
		status: 'active'
	},
	{
		name: 'Sarah Miller',
		baseSalary: 10500,
		bonus: 850,
		total: 11350,
		status: 'inactive'
	},
	{
		name: 'Robert Taylor',
		baseSalary: 4200,
		bonus: 190,
		total: 4390,
		status: 'active'
	},
	{
		name: 'Jennifer Anderson',
		baseSalary: 8900,
		bonus: 0,
		total: 8900,
		status: 'inactive'
	},
	{
		name: 'Thomas Clark',
		baseSalary: 11500,
		bonus: 970,
		total: 12470,
		status: 'active'
	}
])

const summaryData = [
	{
		baseSalary: 0,
		bonus: 0,
		total: 0
	},
	{
		baseSalary: 0,
		bonus: 0,
		total: 0
	}
]
data.value.forEach((record) => {
	summaryData[0].baseSalary += record.baseSalary
	summaryData[0].bonus += record.bonus
	summaryData[0].total += record.total
})
summaryData[1].baseSalary = parseFloat(
	(summaryData[0].baseSalary / data.value.length).toFixed(4)
)
summaryData[1].bonus = parseFloat((summaryData[0].bonus / data.value.length).toFixed(4))
summaryData[1].total = parseFloat((summaryData[0].total / data.value.length).toFixed(4))

const summaryFixed = ref(false)
const summaryStart = ref(false)
const summary = computed(() => {
	return {
		data: summaryData,
		summaryText: ['Sum', 'Average'],
		fixed: summaryFixed.value,
		placement: summaryStart.value ? 'start' : 'end',
		spanMethod: ({ rowIndex, colIndex, record, column }: TableOptionsArg) => {
			if (colIndex === 3) {
				return {
					colspan: 2
				}
			}
		}
	}
})
</script>
