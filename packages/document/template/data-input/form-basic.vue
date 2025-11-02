<template>
	<px-form
		:model="form"
		:rules="rules"
		style="width: 500px"
		@submit="submitHandler"
		ref="formRef"
	>
		<px-form-item label="Input" field="input">
			<px-input v-model="form.input" placeholder="Please input..."></px-input>
		</px-form-item>
		<px-form-item label="Number" field="number">
			<px-input-number v-model="form.number" placeholder="Please input..."></px-input-number>
		</px-form-item>
		<px-form-item label="Tags" field="tags">
			<px-input-tag v-model="form.tags" placeholder="Press enter to confirm..."></px-input-tag>
		</px-form-item>
		<px-form-item label="Text" field="text">
			<px-textarea v-model="form.text" placeholder="Please input text..."></px-textarea>
		</px-form-item>
		<px-form-item label="Select" field="select">
			<px-select
				:options="options"
				v-model="form.select"
				placeholder="Please select..."
			></px-select>
		</px-form-item>
		<px-form-item label="Nest" field="nest.value">
			<px-input v-model="form.nest.value"></px-input>
		</px-form-item>
		<px-form-item label="Email" field="email">
			<px-input v-model="form.email" placeholder="Please email..."></px-input>
		</px-form-item>
		<px-form-item label="URL" field="url">
			<px-input v-model="form.url" placeholder="Please URL..."></px-input>
		</px-form-item>
		<px-form-item label="Number String" field="numberString">
			<px-input v-model="form.numberString" placeholder="Please number..."></px-input>
		</px-form-item>
		<px-space justify="end">
			<px-button native-type="submit">Submit</px-button>
			<px-button theme="info" native-type="reset" style="margin-left: 8px">Reset</px-button>
		</px-space>
	</px-form>
</template>
<script setup lang="ts">
import { Form } from '@pixelium/web-vue'

// If on-demand import
// import { Form } from '@pixelium/web-vue/es'

import { ref, shallowRef } from 'vue'

const form = ref({
	input: '',
	number: 0,
	tags: [] as string[],
	text: '',
	nest: {
		value: ''
	},
	select: null,
	email: '',
	url: '',
	numberString: ''
})

const rules = {
	input: { required: true, message: 'Please input' },
	number: { min: 10, message: 'Min is 10' },
	tags: [
		{ required: true, message: 'Please input tags' },
		{ maxLength: 5, message: 'Length less than or equal 5' }
	],
	text: { required: true, message: 'Just a tip', level: 'warning' },
	'nest.value': { required: true, message: 'Please input' },
	email: { required: true, email: true, message: 'Please input email' },
	url: { required: true, url: true, message: 'Please input a URL' },
	numberString: { required: true, numberString: true, message: 'Please input number.' }
}

const options = ref(['vue', 'react', 'angular'])

const formRef = shallowRef<null | InstanceType<typeof Form>>(null)
const submitHandler = () => {
	formRef.value?.validate().then((res: boolean) => {
		if (res) {
			console.log('submit')
		}
	})
}
</script>
