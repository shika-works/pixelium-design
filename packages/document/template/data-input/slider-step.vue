<template>
	<px-space direction="vertical">
		<px-slider v-model="input0" :min="0" :max="114514" :step="114"></px-slider>
		<px-input-number v-model="input0" :min="0" :max="114514" :step="114"></px-input-number>
		<px-slider v-model="input1" :min="0" :max="114514" :step="0"></px-slider>
		<px-input-number v-model="input1"></px-input-number>
		<px-slider v-model="input2" :min="0" :max="114514" :step="0" :precision="null"></px-slider>
		<px-input-number v-model="input2"></px-input-number>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input0 = ref(0)
const input1 = ref(0)
const input2 = ref(0)
</script>

<style lang="css" scoped>
.px-slider,
.px-input-number {
	width: 400px;
}
</style>
