<template>
	<px-space direction="vertical">
		<div style="display: flex; align-items: center">
			<px-checkbox v-model="threeLineTable" @change="threeLineTableCheckChangeHandler">
				Three-Line Table
			</px-checkbox>
		</div>
		<div style="display: flex; align-items: center">
			Bordered:
			<px-checkbox-group
				style="margin-left: 16px"
				v-model="bordered"
				:options="borderedOptions"
				@change="borderedCheckChangeHandler"
			></px-checkbox-group>
		</div>
		<div style="display: flex; align-items: center">
			Variant:
			<px-radio-group
				style="margin-left: 16px"
				v-model="variant"
				:options="variantOptions"
			></px-radio-group>
		</div>
		<px-table
			:data="data"
			:columns="columns"
			:variant="variant"
			:bordered="borderedConfig"
		></px-table>
	</px-space>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const data = ref([
	{ key: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
	{ key: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
	{ key: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' }
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
		field: 'email'
	}
]

const borderedOptions = [
	{ label: 'Table', value: 'table' },
	{ label: 'Side', value: 'side' },
	{ label: 'Head', value: 'head' },
	{ label: 'Row', value: 'row' },
	{ label: 'Col', value: 'col' }
]
const bordered = ref<string[]>(['table', 'head'])
const threeLineTable = ref(true)

const borderedCheckChangeHandler = (val: string[]) => {
	if (val.length === 2 && val.includes('table') && val.includes('head')) {
		threeLineTable.value = true
	} else {
		threeLineTable.value = false
	}
}

const threeLineTableCheckChangeHandler = (val: boolean) => {
	if (val) {
		bordered.value = ['table', 'head']
	}
}

const borderedConfig = computed(() => {
	return {
		table: bordered.value.includes('table'),
		side: bordered.value.includes('side'),
		head: bordered.value.includes('head'),
		row: bordered.value.includes('row'),
		col: bordered.value.includes('col')
	}
})

const variantOptions = [
	{ label: 'Normal', value: 'normal' },
	{ label: 'Striped', value: 'striped' },
	{ label: 'Checkered', value: 'checkered' }
]
const variant = ref<string>('normal')
</script>
