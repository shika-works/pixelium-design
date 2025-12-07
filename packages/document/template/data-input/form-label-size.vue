<template>
	<px-space direction="vertical">
		<px-radio-group v-model="formSize" :options="radioSizeOptions"></px-radio-group>
		<px-form
			label-auto-width
			:model="form"
			:size="formSize"
			style="width: 500px"
			@submit="submitHandler"
		>
			<px-form-item label="Input" field="input">
				<px-input v-model="form.input"></px-input>
			</px-form-item>
			<px-form-item label="Number" field="number">
				<px-input-number v-model="form.number"></px-input-number>
			</px-form-item>
			<px-form-item label="Radio" field="radio">
				<px-radio-group
					v-model="form.radio"
					:options="radioOptions"
					variant="retro"
				></px-radio-group>
			</px-form-item>
			<px-form-item label="Checkbox" field="checkbox">
				<px-checkbox-group
					v-model="form.checkbox"
					:options="checkboxOptions"
				></px-checkbox-group>
			</px-form-item>
			<px-form-item label="Switch" field="switch">
				<px-switch v-model="form.switch"></px-switch>
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
	number: 114,
	radio: 'Yes',
	switch: false,
	checkbox: [] as string[]
})

const submitHandler = () => {
	console.log('submit')
}

const radioOptions = ref(['Yes', 'No'])
const radioSizeOptions = ref([
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' }
])

const checkboxOptions = ref(['A', 'B', 'C', 'D'])

const formSize = ref('medium')
</script>
