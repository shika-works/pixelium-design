<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly</h4>
		<px-space>
			<px-color-picker disabled></px-color-picker>
			<px-color-picker readonly></px-color-picker>
		</px-space>
		<h4>Composite</h4>
		<px-space direction="vertical">
			<px-input-group>
				<px-input-group-label> Color: </px-input-group-label>
				<px-color-picker> </px-color-picker>
				<px-button>Confirm</px-button>
			</px-input-group>
			<px-input-group>
				<px-input-group-label> Label: </px-input-group-label>
				<px-input placeholder="Input"></px-input>
				<px-color-picker shape="square"> </px-color-picker>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-color-picker> </px-color-picker>
			<px-color-picker status="success"> </px-color-picker>
			<px-color-picker status="warning"> </px-color-picker>
			<px-color-picker status="error"> </px-color-picker>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus & Blur after 2s</px-button>
			</px-space>
			<px-color-picker ref="colorPickerRef"></px-color-picker>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { ColorPicker } from '@pixelium/web-vue'

// If on-demand import
// import { ColorPicker } from '@pixelium/web-vue/es'

const colorPickerRef = shallowRef<InstanceType<typeof ColorPicker> | null>(null)

const focusHandler = () => {
	colorPickerRef.value?.focus()
	setTimeout(() => {
		colorPickerRef.value?.blur()
	}, 2000)
}
</script>

<style lang="css" scoped>
.px-color-picker:not(.px-color-picker__square):not(.px-color-picker__circle) {
	width: 320px;
}
</style>
