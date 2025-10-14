<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-textarea placeholder="Please input text" disabled></px-textarea>
			<px-textarea placeholder="Please input text" readonly></px-textarea>
			<px-textarea placeholder="Please input text" loading></px-textarea>
			<px-textarea placeholder="Please input text" clearable></px-textarea>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-textarea placeholder="Please input text" size="small"></px-textarea>
			<px-textarea placeholder="Please input text"></px-textarea>
			<px-textarea placeholder="Please input text" size="large"></px-textarea>
		</px-space>
		<h4>Count</h4>
		<px-space>
			<px-textarea placeholder="Please input text" show-count> </px-textarea>
			<px-textarea placeholder="Please input text" show-count :max-length="255"> </px-textarea>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-textarea placeholder="Please input text"> </px-textarea>
			<px-textarea placeholder="Please input text" status="success"> </px-textarea>
			<px-textarea placeholder="Please input text" status="warning"> </px-textarea>
			<px-textarea placeholder="Please input text" status="error"> </px-textarea>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus</px-button>
				<px-button theme="info" @click="blurHandler">Blur</px-button>
				<px-button theme="info" @click="selectHandler">Select</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-textarea placeholder="Please input" ref="textareaRef"></px-textarea>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@pixelium/web-vue'

// If on-demand import
// import { Textarea } from '@pixelium/web-vue/es'

const textareaRef = ref<InstanceType<typeof Textarea>>(null)

const focusHandler = () => {
	textareaRef.value?.focus()
}
const blurHandler = () => {
	textareaRef.value?.blur()
}
const clearHandler = () => {
	textareaRef.value?.clear()
}
const selectHandler = () => {
	textareaRef.value?.select()
}
</script>

<style lang="css" scoped>
.px-textarea {
	width: 320px;
}
</style>
