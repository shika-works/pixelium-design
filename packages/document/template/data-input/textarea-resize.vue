<template>
	<px-space direction="vertical">
		<px-textarea placeholder="Please input" v-model="input"></px-textarea>
		<px-textarea placeholder="Please input" v-model="input" :resize="false"></px-textarea>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('Text')
</script>

<style lang="css" scoped>
.px-textarea {
	width: 320px;
}
</style>
