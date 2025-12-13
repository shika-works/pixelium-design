<template>
	<px-space direction="vertical">
		<px-form
			:model="form"
			style="width: 500px"
			:label-props="{ span: 4 }"
			:content-props="{ span: 20 }"
		>
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
		</px-form>
		<px-form :model="form" style="width: 500px" label-auto-width>
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
		</px-form>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
	input: ''
})
</script>
