<template>
	<div style="width: 500px">
		<px-form :form="userForm" :rules="userRules" label-auto-width>
			<px-form-item field="username" label="Username">
				<px-input v-model="userForm.model.value.username" placeholder="Username"></px-input>
			</px-form-item>
			<px-form-item field="email" label="Email">
				<px-input v-model="userForm.model.value.email" placeholder="Email"></px-input>
			</px-form-item>
			<px-space justify="end">
				<px-button @click="handleClearValidationUser" theme="info">Clear Validation</px-button>
				<px-button @click="handleResetUser" theme="warning">Reset</px-button>
				<px-button @click="handleSubmitUser">Submit</px-button>
			</px-space>
		</px-form>
	</div>
</template>

<script setup lang="ts">
import { useForm } from '@pixelium/web-vue'

// When on-demand import
// import { useForm } from '@pixelium/web-vue/es'

const userForm = useForm({
	initialValues: { username: '', email: '' }
})

const userRules = {
	username: [{ required: true, message: 'Please input username' }],
	email: [{ required: true, email: true, message: 'Please input valid email' }]
}

const handleSubmitUser = () => {
	userForm.validate().then(({ isValid }) => {
		if (isValid) {
			console.log('Submit User Form')
		}
	})
}

const handleResetUser = () => {
	userForm.reset()
}

const handleClearValidationUser = () => {
	userForm.clearValidation()
}
</script>
