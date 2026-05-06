<template>
	<div>
		<px-drawer title="Config" v-model:visible="visible" show-footer>
			<px-form :model="form" ref="formRef">
				<px-form-item label="Dark Mode" field="dark">
					<px-switch v-model="form.dark"></px-switch>
				</px-form-item>
				<px-form-item label="Theme" field="theme">
					<px-color-picker v-model="form.theme"></px-color-picker>
				</px-form-item>
			</px-form>
			<template #footer>
				<px-button @click="submitHandler">Confirm</px-button>
			</template>
		</px-drawer>
		<px-button @click="visible = true">Setting</px-button>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'

import { Form } from '@pixelium/web-vue'

// If on-demand import
// import { Form } from '@pixelium/web-vue/es'

const visible = ref(false)

const form = ref({
	dark: false,
	theme: '#00A891'
})

const formRef = shallowRef<null | InstanceType<typeof Form>>(null)
const submitHandler = () => {
	formRef.value?.validate().then(({ isValid }) => {
		if (isValid) {
			$message('Config Changed')
			visible.value = false
		}
	})
}
</script>
