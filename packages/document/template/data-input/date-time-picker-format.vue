<template>
	<px-space direction="vertical">
		<px-date-time-picker
			template="HH MM SS"
			:default-value="new Date()"
			placeholder="Date Time"
		></px-date-time-picker>
		<px-date-time-picker
			:format="format"
			:parse="parse"
			:default-value="new Date()"
			placeholder="Date Time"
		></px-date-time-picker>
	</px-space>
</template>
<script setup lang="ts">
const format = (time: Date) => {
	return `${(time.getMonth() + 1).toString().padStart(2, '0')}/${time
		.getDate()
		.toString()
		.padStart(
			2,
			'0'
		)}/${time.getFullYear()} ${(time.getHours() + 1).toString().padStart(2, '0')} ${(
		time.getMinutes() + 1
	)
		.toString()
		.padStart(2, '0')} ${(time.getSeconds() + 1).toString().padStart(2, '0')}`
}
const parse = (timeStr: string) => {
	const [date, h, m, s] = timeStr.split(' ')
	const [y, month, d] = date.split('/')
	const ans = new Date(1970, 0, 1)
	ans.setFullYear(+y)
	ans.setMonth(+month)
	ans.setDate(+d)
	ans.setHours(+h, +m, +s)
	return ans
}
</script>

<style lang="css" scoped>
.px-date-time-picker {
	width: 320px;
}
</style>
