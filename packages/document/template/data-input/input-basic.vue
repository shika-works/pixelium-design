<template>
	<px-space direction="vertical">
		<px-input placeholder="Please input" v-model="input"></px-input>
		<px-input placeholder="Please input D-mail"></px-input>
		<px-input placeholder="Please input" default-value="El Psy Kongroo"></px-input>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('Steins; Gate')
</script>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
