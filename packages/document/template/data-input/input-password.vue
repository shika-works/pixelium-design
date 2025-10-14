<template>
	<px-input v-model="input" placeholder="Please input password" password></px-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')
</script>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
