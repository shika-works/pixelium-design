<template>
	<px-table :data="data" :columns="columns">
		<template #status="{ record }">
			<px-tag :theme="record.status === 'active' ? 'success' : 'danger'">{{
				record.status
			}}</px-tag>
		</template>
		<template #status-label>
			Status
			<px-tag style="margin-left: 8px" theme="success">Active</px-tag>
			/
			<px-tag theme="danger">Inactive</px-tag>
		</template>
	</px-table>
</template>

<script setup lang="ts">
import { Button } from '@pixelium/web-vue'
import { h, ref } from 'vue'

const data = ref([
	{
		key: 1,
		name: 'Emma Johnson',
		age: 32,
		email: 'emma.johnson@example.com',
		status: 'active'
	},
	{
		key: 2,
		name: 'James Miller',
		age: 45,
		email: 'jmiller@test.net',
		status: 'inactive'
	},
	{
		key: 3,
		name: 'Sophia Chen',
		age: 28,
		email: 'schen@demo.org',
		status: 'active'
	},
	{
		key: 4,
		name: 'William Brown',
		age: 61,
		email: 'wbrown55@sample.co',
		status: 'inactive'
	},
	{
		key: 5,
		name: 'Olivia Davis',
		age: 39,
		email: 'odavis@mail.io',
		status: 'active'
	}
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
		field: 'email',
		cellProps: {
			style: {
				backgroundColor: 'wheat',
				color: 'var(--px-neutral-10)'
			}
		}
	},
	{
		key: 'status',
		labelSlotName: 'status-label',
		slotName: 'status'
	},
	{
		key: 'action',
		render: () => {
			return h(Button, { size: 'small' }, { default: () => 'Detail' })
		},
		labelRender: () => {
			return 'Actions'
		}
	}
]
</script>
