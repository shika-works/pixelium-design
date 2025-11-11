<template>
	<px-space>
		<px-space direction="vertical">
			<px-slider v-model="input" :marks="marks"></px-slider>
			<px-slider v-model="inputRange" range :marks="marks"></px-slider>
			<px-slider v-model="input" reverse :marks="marks"></px-slider>
			<px-slider v-model="inputRange" reverse range :marks="marks"></px-slider>
		</px-space>
		<px-space>
			<px-slider v-model="input" direction="vertical" :marks="marks"></px-slider>
			<px-slider v-model="inputRange" range direction="vertical" :marks="marks"></px-slider>
			<px-slider v-model="input" reverse direction="vertical" :marks="marks"></px-slider>
			<px-slider
				v-model="inputRange"
				reverse
				range
				direction="vertical"
				:marks="marks"
			></px-slider>
		</px-space>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const marks = [
	{ value: 0, label: '0°C' },
	{ value: 20, label: '20°C' },
	{ value: 37, label: '37°C' },
	{ value: 100, label: '100°C' },
	50
]
const inputRange = ref([0, 10])
const input = ref(37)
</script>

<style lang="css" scoped>
.px-slider__horizontal {
	width: 400px;
}
.px-slider__vertical {
	height: 400px;
	margin-right: 24px;
	margin-left: 24px;
}
</style>
