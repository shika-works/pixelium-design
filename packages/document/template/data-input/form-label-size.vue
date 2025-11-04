<template>
	<px-space direction="vertical">
		<px-form :model="form" size="small" style="width: 500px" @submit="submitHandler">
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
			<px-form-item label="Number" field="number">
				<px-input-number v-model="form.number"></px-input-number>
			</px-form-item>
			<px-space justify="end">
				<px-button native-type="submit">Submit</px-button>
			</px-space>
		</px-form>
		<px-form :model="form" size="medium" style="width: 500px" @submit="submitHandler">
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
			<px-form-item label="Number" field="number">
				<px-input-number v-model="form.number"></px-input-number>
			</px-form-item>
			<px-space justify="end">
				<px-button native-type="submit">Submit</px-button>
			</px-space>
		</px-form>
		<px-form :model="form" size="large" style="width: 500px" @submit="submitHandler">
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
			<px-form-item label="Number" field="number">
				<px-input-number v-model="form.number"></px-input-number>
			</px-form-item>
			<px-space justify="end">
				<px-button native-type="submit">Submit</px-button>
			</px-space>
		</px-form>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
	input: 'text',
	number: 114
})

const submitHandler = () => {
	console.log('submit')
}
</script>
