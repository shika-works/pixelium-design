<template>
	<px-date-time-picker
		placeholder-start="Start Date Time"
		placeholder-end="End Date Time"
		clearable
		mode="date-time-range"
	>
		<template #splitter>TO</template>
	</px-date-time-picker>
</template>
<script setup lang="ts"></script>

<style lang="css" scoped>
.px-date-time-picker {
	width: 320px;
}
</style>
