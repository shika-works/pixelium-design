<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="info" @click="focusHandler">Focus</px-button>
			<px-button theme="info" @click="blurHandler">Blur</px-button>
			<px-button theme="info" @click="selectHandler">Select</px-button>
			<px-button theme="warning" @click="clearHandler">Clear</px-button>
		</px-space>
		<px-input placeholder="Please input" ref="inputRef"></px-input>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@pixelium/web-vue'

// If on-demand import
// import { Input } from '@pixelium/web-vue/es'

const inputRef = ref<InstanceType<typeof Input>>(null)

const focusHandler = () => {
	inputRef.value?.focus()
}
const blurHandler = () => {
	inputRef.value?.blur()
}
const clearHandler = () => {
	inputRef.value?.clear()
}
const selectHandler = () => {
	inputRef.value?.select()
}
</script>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
