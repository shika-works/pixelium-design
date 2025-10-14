<template>
	<px-space direction="vertical">
		<px-textarea placeholder="Please input" v-model="input" :rows="4"></px-textarea>
		<px-textarea
			placeholder="Please input"
			v-model="input"
			:rows="4"
			:min-rows="2"
			:max-rows="6"
		></px-textarea>
		<px-textarea
			placeholder="Please input"
			v-model="input"
			auto-resize
			:min-rows="2"
			:max-rows="6"
			:rows="4"
		></px-textarea>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input = ref('Berserker!')
</script>

<style lang="css" scoped>
.px-textarea {
	width: 320px;
}
</style>
