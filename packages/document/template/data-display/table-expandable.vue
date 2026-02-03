<template>
	<div>
		<px-table
			:data="data0"
			:columns="columns"
			row-key="id"
			expandable
			v-model:expanded-keys="expandedKeys"
		></px-table>
		<px-table
			style="margin-top: 16px"
			:data="data1"
			:columns="columns"
			row-key="id"
			expandable
			v-model:expanded-keys="expandedKeys"
		>
			<template #expand="{ record }">
				<div>
					<div v-for="key in keys" style="display: flex; align-items: center; gap: 8px">
						<div style="color: gray; margin-right: 16px">{{ key }}:</div>
						<div>{{ record[key] }}</div>
					</div>
				</div>
			</template>
		</px-table>
		<div style="margin-top: 16px">expandedKeys: {{ expandedKeys }}</div>
	</div>
</template>

<script setup lang="ts">
import type { TableData } from '@pixelium/web-vue'

// When On-demand Import
// import type { TableData } from '@pixelium/web-vue/es'
import { h, ref } from 'vue'

const keys = ['email', 'city', 'address']
const expandRender = ({ record }: { record: TableData }) => {
	return h(
		'div',
		{},
		keys.map((e) => {
			return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
				h('div', { style: 'color: gray; margin-right: 16px' }, e + ': '),
				h('div', {}, record[e])
			])
		})
	)
}
const data0 = ref([
	{
		id: 1001,
		name: 'Emma Johnson',
		email: 'emma.johnson@example.com',
		city: 'New York',
		address: '123 Main Street, Apt 4B',
		expand: expandRender
	},
	{
		id: 1002,
		name: 'James Wilson',
		email: 'j.wilson@example.com',
		city: 'Los Angeles',
		address: '456 Oak Avenue',
		expand: expandRender
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
		address: '321 Beach Boulevard',
		expand: expandRender
	},
	{
		id: 1005,
		name: 'Olivia Davis',
		email: 'olivia.davis@example.com',
		city: 'Seattle',
		address: '654 Lakeview Drive',
		expand: expandRender
	}
])
const data1 = ref([
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
		expand: false
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
	}
]

const expandedKeys = ref<number[]>([])
</script>
