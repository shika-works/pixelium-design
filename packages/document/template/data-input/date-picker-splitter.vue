<template>
	<px-date-picker
		placeholder-start="Start Date"
		placeholder-end="End Date"
		clearable
		mode="date-range"
	>
		<template #splitter>TO</template>
	</px-date-picker>
</template>
<script setup lang="ts"></script>

<style lang="css" scoped>
.px-date-picker {
	width: 320px;
}
</style>
