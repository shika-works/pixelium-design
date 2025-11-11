<template>
	<px-space direction="vertical">
		<px-slider v-model="input0" :marks="marks" :step="0.01"></px-slider>
		<px-slider v-model="input1" :marks="marks" step="mark"></px-slider>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input0 = ref(50)
const input1 = ref(50)

const marks = [{ value: 15.87, label: 'μ-σ' }, 50, { value: 84.13, label: 'μ+σ' }]
</script>

<style lang="css" scoped>
.px-slider {
	width: 400px;
}
</style>
