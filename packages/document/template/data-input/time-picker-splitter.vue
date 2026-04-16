<template>
	<px-time-picker
		placeholder-start="Start Time"
		placeholder-end="End Time"
		clearable
		mode="time-range"
	>
		<template #splitter>TO</template>
	</px-time-picker>
</template>
<script setup lang="ts"></script>

<style lang="css" scoped>
.px-time-picker {
	width: 320px;
}
</style>
