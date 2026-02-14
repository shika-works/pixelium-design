<template>
	<div>
		<px-dialog
			title="Form"
			v-model:visible="visible"
			style="max-height: 70vh; width: 600px"
			@before-ok="submitHandler"
		>
			<px-form
				:model="form"
				:rules="rules"
				style="width: 500px"
				@submit="submitHandler"
				ref="formRef"
				poll-size-change
			>
				<px-form-item label="Input" field="input">
					<px-input v-model="form.input" placeholder="Please input..."></px-input>
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
				<px-form-item label="Number" field="number">
					<px-input-number
						v-model="form.number"
						placeholder="Please input..."
					></px-input-number>
				</px-form-item>
				<px-form-item label="Tags" field="tags">
					<px-input-tag
						v-model="form.tags"
						placeholder="Press enter to confirm..."
					></px-input-tag>
				</px-form-item>
				<px-form-item label="Text" field="text">
					<px-textarea v-model="form.text" placeholder="Please input text..."></px-textarea>
				</px-form-item>
				<px-form-item label="Switch" field="switch">
					<px-switch v-model="form.switch"></px-switch>
				</px-form-item>
				<px-form-item label="Select" field="select">
					<px-select
						:options="options"
						v-model="form.select"
						placeholder="Please select..."
					></px-select>
				</px-form-item>
				<px-form-item label="Email" field="email">
					<px-input v-model="form.email" placeholder="Please email..."></px-input>
				</px-form-item>
				<px-form-item label="URL" field="url">
					<px-input v-model="form.url" placeholder="Please URL..."></px-input>
				</px-form-item>
				<px-form-item label="Slider" field="slider">
					<px-slider v-model="form.slider"></px-slider>
				</px-form-item>
				<px-form-item label="Number String" field="numberString">
					<px-input v-model="form.numberString" placeholder="Please number..."></px-input>
				</px-form-item>
			</px-form>
		</px-dialog>

		<px-button @click="visible = true" variant="plain">Open Form Dialog</px-button>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { Form } from '@pixelium/web-vue'

// If on-demand import
// import { Form } from '@pixelium/web-vue/es'

const visible = ref(false)

const form = ref({
	input: '',
	number: 0,
	tags: [] as string[],
	text: '',
	select: null as null | string,
	email: '',
	url: '',
	numberString: '',
	switch: false,
	radio: null as null | string,
	checkbox: [] as string[],
	slider: 10
})

const rules = {
	input: { required: true, message: 'Please input' },
	select: { required: true, message: 'Please select' },
	switch: { required: true, message: 'Please select' },
	number: { min: 10, message: 'Min is 10' },
	tags: [
		{ required: true, message: 'Please input tags' },
		{ maxLength: 5, message: 'Length less than or equal 5' }
	],
	text: { required: true, message: 'Just a tip', level: 'warning' },
	email: { required: true, email: true, message: 'Please input email' },
	url: { required: true, url: true, message: 'Please input a URL' },
	numberString: { required: true, numberString: true, message: 'Please input number' },
	radio: {
		required: true,
		validator(value: string) {
			return value !== 'Yes' ? 'Please select Yes' : undefined
		}
	},
	checkbox: [
		{ required: true, message: 'Please select' },
		{ maxLength: 2, message: 'You can select up to 2 items' }
	],
	slider: { max: 90, message: 'Max is 90' }
}

const options = ref(['vue', 'react', 'angular'])
const radioOptions = ref(['Yes', 'No'])
const checkboxOptions = ref(['A', 'B', 'C', 'D'])

const formRef = shallowRef<null | InstanceType<typeof Form>>(null)
const submitHandler = () => {
	return formRef.value?.validate().then(({ isValid }) => {
		if (isValid) {
			console.log('submit')
			return true
		} else {
			return false
		}
	})
}
</script>
