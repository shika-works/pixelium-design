<template>
	<div>
		<px-space>
			<px-button @click="logCurrentData" theme="info">Log Current Data</px-button>
			<px-button @click="logPaginatedData" theme="info">Log Paginated Data</px-button>
		</px-space>
		<px-space style="margin-top: 16px">
			<px-button @click="expand1stRow">Expand 1st Row</px-button>
			<px-button @click="clearExpand" theme="warning">Clear Expand</px-button>
		</px-space>
		<px-space style="margin-top: 16px">
			<px-button @click="select2ndRow">Select 2nd Row</px-button>
			<px-button @click="clearSelect" theme="warning">Clear Select</px-button>
			<px-button @click="selectAll">Select All</px-button>
		</px-space>
		<px-space style="margin-top: 16px">
			<px-button @click="sort1stCol">Sort 1st Col</px-button>
			<px-button @click="clearSort" theme="warning">Clear Sort</px-button>
			<px-button @click="filter2stCol">FIlter 2st Col</px-button>
			<px-button @click="clearFilter" theme="warning">Clear Filter</px-button>
		</px-space>
		<div style="margin-top: 16px">expandedKeys: {{ expandedKeys }}</div>
		<div style="margin-top: 16px">selectedKeys: {{ selectedKeys }}</div>
		<div style="margin-top: 16px">sortOrder: {{ sortOrder }}</div>
		<div style="margin-top: 16px">filterValue: {{ filterValue }}</div>
		<px-table
			style="margin-top: 16px"
			:data="data"
			:columns="columns"
			row-key="id"
			expandable
			v-model:expanded-keys="selectedKeys"
			v-model:selected-keys="expandedKeys"
			v-model:sort-order="sortOrder"
			v-model:filter-value="filterValue"
			:selection="{
				multiple: true,
				showSelectAll: true
			}"
			ref="tableRef"
		></px-table>
	</div>
</template>

<script setup lang="ts">
import type { TableData, Table, SortOrder, FilterValue, TableColumn } from '@pixelium/web-vue'

// When On-demand Import
// import type { TableData, Table, SortOrder, FilterValue } from '@pixelium/web-vue/es'
import { h, ref } from 'vue'

const tableRef = ref<null | InstanceType<typeof Table>>(null)

const logCurrentData = () => {
	console.log(tableRef.value?.getCurrentData())
}
const logPaginatedData = () => {
	console.log(tableRef.value?.getPaginatedData())
}

const filter2stCol = () => {
	tableRef.value?.filter('name', ['C'])
}
const clearFilter = () => {
	tableRef.value?.clearFilter()
}

const sort1stCol = () => {
	tableRef.value?.sort('id', 'desc')
}
const clearSort = () => {
	tableRef.value?.clearSort()
}

const select2ndRow = () => {
	tableRef.value?.select(1002, true)
}
const clearSelect = () => {
	tableRef.value?.clearSelect()
}
const selectAll = () => {
	tableRef.value?.selectAll(true)
}

const expand1stRow = () => {
	tableRef.value?.expand(1001, true)
}
const clearExpand = () => {
	tableRef.value?.clearExpand()
}

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

function generateData(count: number, startId: number = 1001) {
	const firstNames = [
		'Emma',
		'James',
		'Sophia',
		'Michael',
		'Olivia',
		'Liam',
		'Ava',
		'Noah',
		'Isabella',
		'William',
		'Mia',
		'Ethan',
		'Charlotte',
		'Alexander',
		'Amelia',
		'Benjamin',
		'Harper',
		'Daniel',
		'Evelyn',
		'Matthew'
	]
	const lastNames = [
		'Johnson',
		'Wilson',
		'Chen',
		'Brown',
		'Davis',
		'Miller',
		'Garcia',
		'Rodriguez',
		'Martinez',
		'Taylor',
		'Anderson',
		'Thomas',
		'Jackson',
		'White',
		'Harris',
		'Martin',
		'Thompson',
		'Moore',
		'Walker',
		'Clark'
	]
	const cities = [
		'New York',
		'Los Angeles',
		'Chicago',
		'Miami',
		'Seattle',
		'Houston',
		'Phoenix',
		'Philadelphia',
		'San Antonio',
		'San Diego',
		'Dallas',
		'San Jose',
		'Austin',
		'Jacksonville',
		'Fort Worth',
		'Columbus',
		'Charlotte',
		'San Francisco',
		'Indianapolis',
		'Denver'
	]
	const streetNames = [
		'Main Street',
		'Oak Avenue',
		'Pine Road',
		'Beach Boulevard',
		'Lakeview Drive',
		'Maple Lane',
		'Cedar Street',
		'Elm Avenue',
		'Hill Road',
		'Park Boulevard',
		'River Drive',
		'Sunset Avenue',
		'Mountain Road',
		'Valley Drive',
		'Ocean Boulevard',
		'Forest Lane',
		'Spring Avenue',
		'Summer Road',
		'Winter Drive',
		'Autumn Lane'
	]

	const data = []

	for (let i = 0; i < count; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
		const city = cities[Math.floor(Math.random() * cities.length)]
		const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
		const streetNumber = Math.floor(Math.random() * 900) + 100

		const aptTypes = ['Apt', 'Suite', 'Unit', '#', null]
		const aptType = aptTypes[Math.floor(Math.random() * aptTypes.length)]
		const aptNumber = aptType
			? Math.floor(Math.random() * 20) +
				1 +
				(Math.random() > 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 5)) : '')
			: ''

		let address = `${streetNumber} ${streetName}`
		if (aptType && aptNumber) {
			address += `, ${aptType} ${aptNumber}`
		}

		const item = {
			id: startId + i,
			name: `${firstName} ${lastName}`,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
			city: city,
			address: address,
			expand: expandRender
		}

		data.push(item)
	}

	return data
}

const data = ref(generateData(50))

const columns: TableColumn[] = [
	{
		key: 'id',
		label: 'ID',
		field: 'id',
		fixed: 'left',
		sortable: {
			orders: ['asc', 'desc']
		}
	},
	{
		key: 'name',
		label: 'Name',
		field: 'name',
		filterable: {
			filterOptions: Array.from({ length: 26 }, (_, i) => ({
				label: `${String.fromCharCode(65 + i)}...`,
				value: String.fromCharCode(65 + i)
			})),
			filterMethod: (value: string[], record: TableData) => {
				if (value.length) {
					return record.name[0] === value[0]
				} else {
					return true
				}
			}
		}
	}
]

const expandedKeys = ref<number[]>([])
const selectedKeys = ref<number[]>([])
const sortOrder = ref<SortOrder>({})
const filterValue = ref<FilterValue>({})
</script>
