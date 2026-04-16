<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-time-picker placeholder="Time" disabled></px-time-picker>
			<px-time-picker placeholder="Time" readonly></px-time-picker>
			<px-time-picker placeholder="Time" loading></px-time-picker>
			<px-time-picker placeholder="Time" clearable></px-time-picker>
		</px-space>
		<h4>Shape</h4>
		<px-space>
			<px-time-picker
				placeholder-start="Start Time"
				placeholder-end="End Time"
				mode="time-range"
				shape="round"
			></px-time-picker>
			<px-time-picker
				placeholder-start="Start Time"
				placeholder-end="Ens Time"
				mode="time-range"
			></px-time-picker>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-time-picker placeholder="Time" size="small"></px-time-picker>
			<px-time-picker placeholder="Time"></px-time-picker>
			<px-time-picker placeholder="Time" size="large"></px-time-picker>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-time-picker
				placeholder-start="Start Time"
				placeholder-end="End Time"
				mode="time-range"
			>
				<template #prefix>prefix</template>
				<template #suffix>suffix</template>
			</px-time-picker>
		</px-space>
		<h4>Composite</h4>
		<px-space>
			<px-input-group>
				<px-input-group-label> Start: </px-input-group-label>
				<px-time-picker placeholder="Time"> </px-time-picker>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-time-picker placeholder="Time"> </px-time-picker>
			<px-time-picker placeholder="Time" status="success"> </px-time-picker>
			<px-time-picker placeholder="Time" status="warning"> </px-time-picker>
			<px-time-picker placeholder="Time" status="error"> </px-time-picker>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus & Blur after 2s</px-button>
				<px-button theme="info" @click="selectHandler">Select</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-time-picker placeholder="Time" ref="timePickerRef"></px-time-picker>
			<px-space>
				<px-button-group>
					<px-button theme="info" @click="focusStartHandler">Focus Start</px-button>
					<px-button theme="info" @click="focusEndHandler">Focus End</px-button>
				</px-button-group>
				<px-button-group>
					<px-button theme="info" @click="selectStartHandler">Select Start</px-button>
					<px-button theme="info" @click="selectEndHandler">Select End</px-button>
				</px-button-group>
				<px-button theme="warning" @click="clearRangeHandler">Clear</px-button>
			</px-space>
			<px-time-picker
				placeholderStart="Start Time"
				placeholderEnd="End Time"
				ref="timePickerRangeRef"
				mode="time-range"
			></px-time-picker>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { TimePicker } from '@pixelium/web-vue'

// If on-demand import
// import { TimePicker } from '@pixelium/web-vue/es'

const timePickerRef = shallowRef<InstanceType<typeof TimePicker> | null>(null)
const timePickerRangeRef = shallowRef<InstanceType<typeof TimePicker> | null>(null)

const focusHandler = () => {
	timePickerRef.value?.focus()
	setTimeout(() => {
		timePickerRef.value?.blur()
	}, 2000)
}
const clearHandler = () => {
	timePickerRef.value?.clear()
}
const selectHandler = () => {
	timePickerRef.value?.select()
}

const focusStartHandler = () => {
	timePickerRangeRef.value?.focus('start')
}
const focusEndHandler = () => {
	timePickerRangeRef.value?.focus('end')
}

const selectStartHandler = () => {
	timePickerRangeRef.value?.select('start')
}
const selectEndHandler = () => {
	timePickerRangeRef.value?.select('end')
}

const clearRangeHandler = () => {
	timePickerRangeRef.value?.clear()
}
</script>

<style lang="css" scoped>
.px-time-picker {
	width: 320px;
}
</style>
