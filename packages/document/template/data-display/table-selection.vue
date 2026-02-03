<template>
	<div>
		<px-switch
			style="margin-bottom: 16px"
			active-label="Multiple"
			v-model="selection.multiple"
		></px-switch>
		<px-table
			:data="data"
			:columns="columns"
			row-key="id"
			:selection="selection"
			:scroll="{ x: 1500 }"
			v-model:selected-keys="selectedKeys"
		></px-table>
		<div style="margin-top: 16px">selectedKeys: {{ selectedKeys }}</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
	{
		id: 1001,
		name: 'Emma Johnson',
		email: 'emma.johnson@example.com',
		city: 'New York',
		address: '123 Main Street, Apt 4B'
	},
	{
		id: 1002,
		name: 'James Wilson',
		email: 'j.wilson@example.com',
		city: 'Los Angeles',
		address: '456 Oak Avenue',
		disabled: true
	},
	{
		id: 1003,
		name: 'Sophia Chen',
		email: 'sophia.chen@example.com',
		city: 'Chicago',
		address: '789 Pine Road, Suite 12'
	},
	{
		id: 1004,
		name: 'Michael Brown',
		email: 'm.brown@example.com',
		city: 'Miami',
		address: '321 Beach Boulevard'
	},
	{
		id: 1005,
		name: 'Olivia Davis',
		email: 'olivia.davis@example.com',
		city: 'Seattle',
		address: '654 Lakeview Drive'
	}
])

const columns = [
	{
		key: 'id',
		label: 'ID',
		field: 'id',
		fixed: 'left'
	},
	{
		key: 'name',
		label: 'Name',
		field: 'name'
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email'
	},
	{
		key: 'city',
		label: 'City',
		field: 'city'
	},
	{
		key: 'address',
		label: 'Address',
		field: 'address'
	}
]

const selection = ref({
	multiple: false,
	showSelectAll: true
})

const selectedKeys = ref<number[]>([])
</script>
