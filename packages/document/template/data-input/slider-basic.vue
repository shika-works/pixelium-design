<template>
	<px-space direction="vertical">
		<h4>Controlled</h4>
		<px-slider v-model="input"></px-slider>
		<px-input-number v-model="input" :min="0" :max="100"></px-input-number>
		<h4>Uncontrolled</h4>
		<px-slider :default-value="50"></px-slider>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input = ref(0)
</script>

<style lang="css" scoped>
.px-slider,
.px-input-number {
	width: 400px;
}
</style>
