<template>
	<px-input placeholder="Please input" v-model="input" loading></px-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('You can enter text as usual')
</script>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
