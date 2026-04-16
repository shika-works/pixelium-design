<template>
	<px-space direction="vertical">
		<px-date-picker
			template="MM/DD/YYYY"
			:default-value="new Date()"
			placeholder="Date"
		></px-date-picker>
		<px-date-picker
			:format="format"
			:parse="parse"
			:default-value="new Date()"
			placeholder="Date"
		></px-date-picker>
	</px-space>
</template>
<script setup lang="ts">
const format = (time: Date) => {
	return `${(time.getMonth() + 1).toString().padStart(2, '0')}/${time.getDate().toString().padStart(2, '0')}/${time.getFullYear()}`
}
const parse = (timeStr: string) => {
	const [m, d, y] = timeStr.split('/').map((e) => +e)
	const ans = new Date(1970, 0, 1)
	ans.setFullYear(y)
	ans.setMonth(m)
	ans.setDate(d)
	return ans
}
</script>

<style lang="css" scoped>
.px-date-picker {
	width: 320px;
}
</style>
