<template>
	<px-form :model="form" :rules="rules" style="width: 600px" ref="formRef">
		<p>The Answer to the Great Question Of Life, the Universe and Everything...</p>
		<px-form-item label="Answer" field="number" label-align="left">
			<px-input-number v-model="form.number"></px-input-number>
		</px-form-item>
	</px-form>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
	number: 0
})

const rules = {
	number: {
		validator: (value: number | null) => {
			if (value === 42) {
				return
			}
			return 'Could you think again?'
		}
	}
}
</script>
