<template>
	<px-space>
		<px-input-number placeholder="Please input number" v-model="input"></px-input-number>
		<px-input-number placeholder="Please input number" :default-value="0"></px-input-number>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref(47)
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
