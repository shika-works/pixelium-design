<template>
	<px-space>
		<px-form
			:model="form"
			:rules="rules"
			style="width: 500px"
			@submit="submitHandler"
			ref="formRef"
			disabled
		>
			<h4>Disabled</h4>
			<px-form-item label="Username" field="username">
				<px-input v-model="form.username" placeholder="Please input username..."></px-input>
			</px-form-item>
			<px-form-item label="Email" field="email">
				<px-input v-model="form.email" placeholder="Please email..."></px-input>
			</px-form-item>
			<px-space justify="end">
				<px-button native-type="submit">Submit</px-button>
				<px-button theme="info" native-type="reset" style="margin-left: 8px">Reset</px-button>
			</px-space>
		</px-form>
		<px-form
			:model="form"
			:rules="rules"
			style="width: 500px"
			@submit="submitHandler"
			ref="formRef"
			readonly
		>
			<h4>Readonly</h4>
			<px-form-item label="Username" field="username">
				<px-input v-model="form.username" placeholder="Please input username..."></px-input>
			</px-form-item>
			<px-form-item label="Email" field="email">
				<px-input v-model="form.email" placeholder="Please email..."></px-input>
			</px-form-item>
			<px-space justify="end">
				<px-button native-type="submit">Submit</px-button>
				<px-button theme="info" native-type="reset" style="margin-left: 8px">Reset</px-button>
			</px-space>
		</px-form>
	</px-space>
</template>
<script setup lang="ts">
import { Form } from '@pixelium/web-vue'

// If on-demand import
// import { Form } from '@pixelium/web-vue/es'

import { ref, shallowRef } from 'vue'

const form = ref({
	username: '',
	email: ''
})

const rules = {
	username: { required: true, message: 'Please input' },
	email: { required: true, email: true, message: 'Please input email' }
}

const formRef = shallowRef<null | InstanceType<typeof Form>>(null)
const submitHandler = () => {
	formRef.value?.validate().then((res: boolean) => {
		if (res) {
			console.log('submit')
		}
	})
}
</script>
