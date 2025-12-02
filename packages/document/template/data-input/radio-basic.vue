<template>
	<px-radio v-model="value" label="1">备选项</px-radio>
	<px-radio v-model="value" label="2">备选项</px-radio>
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
