<template>
	<px-input placeholder="Please input" v-model="input" clearable></px-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('Test')
</script>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
