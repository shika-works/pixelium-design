<template>
	<px-space direction="vertical">
		<px-slider v-model="input"></px-slider>
		<px-slider :default-value="[25, 50]" range></px-slider>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input = ref([0, 10])
</script>

<style lang="css" scoped>
.px-slider {
	width: 400px;
}
</style>
