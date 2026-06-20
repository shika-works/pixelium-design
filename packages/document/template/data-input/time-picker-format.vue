<template>
	<px-space direction="vertical">
		<px-time-picker
			template="HH MM SS"
			:default-value="new Date()"
			placeholder="Time"
		></px-time-picker>
		<px-time-picker
			:format="format"
			:parse="parse"
			:default-value="new Date()"
			placeholder="Time"
		></px-time-picker>
	</px-space>
</template>
<script setup lang="ts">
const format = (time: Date) => {
	return `${(time.getHours() + 1).toString().padStart(2, '0')} ${(time.getMinutes() + 1)
		.toString()
		.padStart(2, '0')} ${(time.getSeconds() + 1).toString().padStart(2, '0')}`
}
const parse = (timeStr: string) => {
	const [h, m, s] = timeStr.split(' ')
	const ans = new Date(1970, 0, 1)
	ans.setHours(+h, +m, +s)
	return ans
}
</script>

<style lang="css" scoped>
.px-time-picker {
	width: 320px;
}
</style>
