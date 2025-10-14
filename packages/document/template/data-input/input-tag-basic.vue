<template>
	<px-space direction="vertical">
		<px-input-tag
			placeholder="Please input"
			:default-value="['Madoka']"
			default-input-value="Homura"
		></px-input-tag>
		<px-input-tag
			placeholder="Please input"
			v-model="tags"
			v-model:input-value="inputValue"
		></px-input-tag>
		<span>modelValue: {{ tags }}; inputValue: {{ inputValue }}</span>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>(['Sayaka', 'Mami'])
const inputValue = ref('Kyoko')
</script>

<style lang="css" scoped>
.px-input-tag {
	width: 640px;
}
</style>
