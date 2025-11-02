<template>
	<px-space direction="vertical">
		<px-form :model="form" label-align="top" style="width: 500px">
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
		</px-form>
		<px-form :model="form" style="width: 500px" label-align="left">
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
		</px-form>
		<px-form :model="form" style="width: 500px">
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
