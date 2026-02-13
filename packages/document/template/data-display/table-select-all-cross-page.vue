<template>
	<div style="display: flex; align-items: center">
		Superset for Select All State Reference
		<px-switch
			style="margin-left: 16px"
			v-model="supersetWasAllData"
			active-label="All Data"
		></px-switch>
	</div>
	<px-table
		style="margin-top: 16px"
		:data="data"
		rowKey="id"
		:columns="columns"
		:pagination="{
			showTotal: true,
			showSize: true
		}"
		v-model:page-size="pageSize"
		v-model:page="page"
		:selection="{
			selectAllMethod,
			supersetSelectAllRef,
			multiple: true
		}"
		v-model:selected-keys="selectedKeys"
		ref="tableRef"
	>
		<template #footer>
			<div
				v-if="!crossPageSelectAll && currentPageSelectAll"
				style="color: var(--px-neutral-8)"
			>
				Select all on current page
			</div>
			<div v-if="crossPageSelectAll" style="color: var(--px-primary-6)">
				Select all across all pages
			</div>
		</template>
	</px-table>
</template>

<script lang="ts" setup>
import type { DialogReturn, TableData } from '@pixelium/web-vue'
import { Button, Dialog, Table } from '@pixelium/web-vue'

// On-demand import
// import type { DialogReturn, TableData } from '@pixelium/web-vue/es'
// import { Button, Dialog, Table } from '@pixelium/web-vue/es'

import { ref, h, computed, watch, nextTick } from 'vue'

function intersection<T>(arr1: T[], arr2: T[]): T[] {
	const map = new Map<any, { value: T; count: number }>()
	const len1 = arr1.length
	for (let i = 0; i < len1; i++) {
		const key = arr1[i]
		const gotVal = map.get(key)
		if (!gotVal) {
			map.set(key, { value: arr1[i], count: 1 })
		} else {
			gotVal.count += 1
		}
	}
	const len2 = arr2.length
	for (let i = 0; i < len2; i++) {
		const key = arr2[i]
		const gotVal = map.get(key)
		if (!gotVal) {
			map.set(key, { value: arr2[i], count: 1 })
		} else {
			gotVal.count += 1
		}
	}
	const ans: T[] = []
	for (const data of map.values()) {
		if (data.count > 1) {
			ans.push(data.value)
		}
	}
	return ans
}

function union<T>(arr1: T[], arr2: T[]): T[] {
	const map = new Map<any, T>()
	const len1 = arr1.length
	for (let i = 0; i < len1; i++) {
		const key = arr1[i]
		if (!map.has(key)) {
			map.set(key, arr1[i])
		}
	}
	const len2 = arr2.length
	for (let i = 0; i < len2; i++) {
		const key = arr2[i]
		if (!map.has(key)) {
			map.set(key, arr2[i])
		}
	}
	return [...map.values()]
}

function difference<T>(arr1: T[], arr2: T[]): T[] {
	const map = new Map<any, { value: T; count: number }>()
	const len1 = arr1.length
	for (let i = 0; i < len1; i++) {
		const key = arr1[i]
		if (!map.has(key)) {
			map.set(key, { value: arr1[i], count: 1 })
		}
	}
	const len2 = arr2.length
	for (let i = 0; i < len2; i++) {
		const key = arr2[i]
		const gotVal = map.get(key)
		if (gotVal) {
			gotVal.count++
		}
	}
	const ans: T[] = []
	for (const data of map.values()) {
		if (data.count === 1) {
			ans.push(data.value)
		}
	}
	return ans
}

const getKeys = (data: TableData[]) => data.filter((e) => !e.disabled).map((e) => e.id)

const pageSize = ref(10)
const page = ref(1)

const supersetWasAllData = ref(false)
const supersetSelectAllRef = computed(() => {
	return supersetWasAllData.value ? 'all' : 'current'
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const selectedKeys = ref<number[]>([])
const currentPageSelectAll = ref(false)
const crossPageSelectAll = ref(false)
watch([page, pageSize, selectedKeys], () => {
	nextTick(() => {
		const currentData = tableRef.value?.getCurrentData() || []
		const paginatedData = tableRef.value?.getPaginatedData() || []
		currentPageSelectAll.value =
			difference(getKeys(paginatedData), selectedKeys.value).length === 0
		crossPageSelectAll.value = difference(getKeys(currentData), selectedKeys.value).length === 0
	})
})

const selectAllMethod = async (
	value: boolean,
	preState: { value: boolean; indeterminate: boolean },
	extra: {
		originData: TableData[]
		currentData: TableData[]
		paginatedData: TableData[]
		selectedKeys: any[]
		page: number
		pageSize: number
	}
) => {
	const paginatedDataKeys = getKeys(extra.paginatedData)
	const currentDataKeys = getKeys(extra.currentData)
	let selectedKeys: any[] = []
	const clearPageHandler = (dialogReturn: DialogReturn) => {
		dialogReturn.close()
		selectedKeys = difference(extra.selectedKeys, paginatedDataKeys)
	}
	const pageOnlyHandler = (dialogReturn: DialogReturn) => {
		dialogReturn.close()
		selectedKeys = getKeys(extra.paginatedData)
	}
	const pageAddHandler = (dialogReturn: DialogReturn) => {
		dialogReturn.close()
		selectedKeys = union(extra.selectedKeys, paginatedDataKeys)
	}
	const selectAllHandler = (dialogReturn: DialogReturn) => {
		dialogReturn.close()
		selectedKeys = union(extra.selectedKeys, currentDataKeys)
	}
	const clearAllHandler = (dialogReturn: DialogReturn) => {
		dialogReturn.close()
		selectedKeys = difference(extra.selectedKeys, currentDataKeys)
	}
	let dialogReturn: DialogReturn
	if (value) {
		const currentPageHasIntersection =
			extra.selectedKeys.length &&
			intersection(paginatedDataKeys, extra.selectedKeys).length > 0
		const allDataHasIntersection =
			supersetWasAllData.value &&
			extra.selectedKeys.length &&
			intersection(currentDataKeys, extra.selectedKeys).length > 0
		dialogReturn = Dialog.warning({
			title: 'Select All',
			content: 'Select one action to perform:',
			footer: () => {
				return h('div', {}, [
					currentPageHasIntersection && allDataHasIntersection
						? h(
								'div',
								{
									style:
										'display: flex; justify-content: end; align-items: center; gap: 8px; margin-bottom: 8px'
								},
								{
									default: () => [
										currentPageHasIntersection
											? h(
													Button,
													{
														theme: 'info',
														onClick: () => clearPageHandler(dialogReturn),
														pollSizeChange: true
													},
													{ default: () => 'Clear Page' }
												)
											: null,
										allDataHasIntersection
											? h(
													Button,
													{
														theme: 'warning',
														onClick: () => clearAllHandler(dialogReturn),
														pollSizeChange: true
													},
													{ default: () => 'Clear All' }
												)
											: null
									]
								}
							)
						: null,
					h(
						'div',
						{ style: 'display: flex; justify-content: end; align-items: center; gap: 8px;' },
						{
							default: () => [
								h(
									Button,
									{
										theme: 'info',
										onClick: () => pageOnlyHandler(dialogReturn),
										pollSizeChange: true
									},
									{ default: () => 'This Page Only' }
								),
								h(
									Button,
									{
										theme: 'primary',
										onClick: () => pageAddHandler(dialogReturn),
										pollSizeChange: true
									},
									{ default: () => 'Add This Page' }
								),
								h(
									Button,
									{
										theme: 'primary',
										onClick: () => selectAllHandler(dialogReturn),
										pollSizeChange: true
									},
									{ default: () => 'Select All' }
								)
							]
						}
					)
				])
			}
		})
	} else {
		dialogReturn = Dialog.warning({
			title: 'Clear Select All',
			content: 'Select one action to perform:',
			footer: () => {
				return h(
					'div',
					{ style: 'display: flex; justify-content: end; align-items: center; gap: 8px' },
					{
						default: () => [
							h(
								Button,
								{
									theme: 'info',
									onClick: () => clearPageHandler(dialogReturn),
									pollSizeChange: true
								},
								{ default: () => 'Clear Page' }
							),
							h(
								Button,
								{
									theme: 'warning',
									onClick: () => clearAllHandler(dialogReturn),
									pollSizeChange: true
								},
								{ default: () => 'Clear All' }
							)
						]
					}
				)
			}
		})
	}
	await dialogReturn
	return selectedKeys
}

const columns = [
	{
		key: 'id',
		label: 'ID',
		field: 'id'
	},
	{
		key: 'user',
		label: 'User',
		field: 'user'
	},
	{
		key: 'email',
		label: 'Email',
		field: 'email'
	},
	{
		key: 'register',
		label: 'Register',
		field: 'register'
	}
]

const firstNames = [
	'John',
	'Emma',
	'Michael',
	'Sarah',
	'David',
	'Lisa',
	'Robert',
	'Jennifer',
	'William',
	'Jessica',
	'James',
	'Amanda',
	'Christopher',
	'Melissa',
	'Daniel',
	'Stephanie',
	'Matthew',
	'Laura',
	'Joshua',
	'Michelle'
]

const lastNames = [
	'Smith',
	'Johnson',
	'Williams',
	'Brown',
	'Jones',
	'Miller',
	'Davis',
	'Garcia',
	'Rodriguez',
	'Wilson',
	'Martinez',
	'Anderson',
	'Taylor',
	'Thomas',
	'Jackson',
	'White',
	'Harris',
	'Martin',
	'Thompson',
	'Moore'
]

function generateRandomData(count: number) {
	const data: any[] = []
	const currentDate = new Date()

	for (let i = 1; i <= count; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
		const fullName = `${firstName} ${lastName}`

		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

		const randomDaysAgo = Math.floor(Math.random() * 365)
		const registerDate = new Date(currentDate)
		registerDate.setDate(registerDate.getDate() - randomDaysAgo)
		const registerDateStr = registerDate.toISOString().split('T')[0]

		data.push({
			id: i,
			user: fullName,
			email: email,
			register: registerDateStr
		})
	}

	return data
}

const data = ref(generateRandomData(50))
</script>
