<template>
	<px-space direction="vertical">
		<px-radio v-model="value" label="1" active-color="red">备选项</px-radio>
		<px-radio v-model="value" label="2" active-color="blue">备选项</px-radio>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
