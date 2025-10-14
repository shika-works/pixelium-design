<template>
	<px-space direction="vertical">
		<px-input-number
			direction="vertical"
			placeholder="Please input number"
			v-model="inputUnit"
			:precision="precision"
			:format="formatUnit"
			:allow-input="allowInputUnit"
			:parse="parseUnit"
		></px-input-number>
		<px-input-number
			placeholder="Please input number"
			v-model="inputSeparator"
			:format="formatSeparator"
			:allow-input="allowInputSeparator"
			:parse="parseSeparator"
		></px-input-number>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputUnit = ref(100)
const precision = ref(4)

const formatUnit = (value: number | null | undefined) => {
	if (value === undefined || value === null || isNaN(value)) {
		return ''
	}
	return value.toFixed(precision.value) + '%'
}
const reg4NumberUnit = /^[+-]?\d+(?:\.\d*)?(%)?$/
const allowInputUnit = (value: string) => {
	if (!value.length) {
		return true
	}
	return reg4NumberUnit.test(value)
}
const parseUnit = (value: string) => {
	if (!value.length) {
		return 0
	}
	return parseFloat(value)
}

function thousandSeparator(num: number): string {
	const numStr = Math.abs(num).toString()
	const [int, decimal] = numStr.split('.')

	const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

	let result
	if (decimal) {
		const formattedDecimal = decimal.replace(/(\d{3})(?=\d)/g, '$1,')
		result = `${formattedInt}.${formattedDecimal}`
	} else {
		result = formattedInt
	}

	return num < 0 ? '-' + result : result
}
const inputSeparator = ref(12345.6789)

const formatSeparator = (value: number | null | undefined) => {
	if (value === undefined || value === null || isNaN(value)) {
		return ''
	}
	return thousandSeparator(value)
}
const reg4Number = /^[+-]?\d+(?:\.\d*)?$/
const allowInputSeparator = (value: string) => {
	if (!value.length) {
		return true
	}
	return reg4Number.test(value.split(',').join(''))
}
const parseSeparator = (value: string) => {
	if (!value.length) {
		return 0
	}
	return parseFloat(value.split(',').join(''))
}
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
