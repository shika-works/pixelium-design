<template>
	<px-table :data="data" :columns="columns" :spanMethod="spanMethod"></px-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { TableOptionsArg } from '@pixelium/web-vue'
// If on-demand import
// import type { TableOptionsArg } from '@pixelium/web-vue/es'

const data = ref([
	{
		buildingType: 'Blacksmith',
		coord: '(23, 18)',
		level: 3,
		income: 1800,
		maintain: 450
	},
	{
		buildingType: 'Blacksmith',
		coord: '(25, 20)',
		level: 4,
		income: 2400,
		maintain: 600
	},
	{
		buildingType: 'Tavern',
		coord: '(34, 27)',
		level: 2,
		income: 1600,
		maintain: 400
	},
	{
		buildingType: 'Tavern',
		coord: '(36, 25)',
		level: 5,
		income: 3200,
		maintain: 800
	},
	{
		buildingType: 'Market',
		coord: '(41, 33)',
		level: 3,
		income: 2100,
		maintain: 525
	},
	{
		buildingType: 'Market',
		coord: '(43, 35)',
		level: 6,
		income: 4000,
		maintain: 1000
	},
	{
		buildingType: 'Farm',
		coord: '(15, 12)',
		level: 2,
		income: 900,
		maintain: 225
	},
	{
		buildingType: 'Farm',
		coord: '(18, 14)',
		level: 4,
		income: 2000,
		maintain: 500
	},
	{
		buildingType: 'Barracks',
		coord: '(9, 39)',
		level: 3,
		income: 1500,
		maintain: 375
	},
	{
		buildingType: 'Barracks',
		coord: '(11, 37)',
		level: 5,
		income: 2800,
		maintain: 700
	},
	{
		buildingType: 'Town Hall',
		coord: '(12, 45)',
		level: 5
	}
])

const columns = [
	{
		key: 'buildingType',
		label: 'BuildingType',
		field: 'buildingType'
	},
	{
		key: 'coord',
		label: 'Coord',
		field: 'coord'
	},
	{
		key: 'level',
		label: 'Level',
		field: 'level'
	},
	{
		key: 'income',
		label: 'Income',
		field: 'income'
	},
	{
		label: 'Maintain',
		field: 'maintain',
		key: 'maintain'
	}
]

const spanMethod = ({ rowIndex, colIndex, record, column }: TableOptionsArg) => {
	const curBuildingType = record.buildingType
	if (colIndex === 0) {
		if (data.value[rowIndex - 1]?.buildingType === curBuildingType) {
			return
		}
		let rowspan = 0
		for (let i = rowIndex; i < data.value.length; i++) {
			if (data.value[i].buildingType !== curBuildingType) {
				break
			}
			rowspan++
		}
		return {
			rowspan
		}
	}
	if (curBuildingType === 'Town Hall' && colIndex === 2) {
		return { colspan: 3 }
	}
}
</script>
