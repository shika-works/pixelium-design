<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-date-time-picker placeholder="Date Time" disabled></px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" readonly></px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" loading></px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" clearable></px-date-time-picker>
		</px-space>
		<h4>Shape</h4>
		<px-space>
			<px-date-time-picker
				placeholder-start="Start Date Time"
				placeholder-end="End Date Time"
				mode="date-time-range"
				shape="round"
			></px-date-time-picker>
			<px-date-time-picker
				placeholder-start="Start Date Time"
				placeholder-end="Ens Date Time"
				mode="date-time-range"
			></px-date-time-picker>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-date-time-picker placeholder="Date Time" size="small"></px-date-time-picker>
			<px-date-time-picker placeholder="Date Time"></px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" size="large"></px-date-time-picker>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-date-time-picker
				placeholder-start="Start Date Time"
				placeholder-end="End Date Time"
				mode="date-time-range"
			>
				<template #prefix>prefix</template>
				<template #suffix>suffix</template>
			</px-date-time-picker>
		</px-space>
		<h4>Composite</h4>
		<px-space>
			<px-input-group>
				<px-input-group-label> Start: </px-input-group-label>
				<px-date-time-picker placeholder="Date Time"> </px-date-time-picker>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-date-time-picker placeholder="Date Time"> </px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" status="success"> </px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" status="warning"> </px-date-time-picker>
			<px-date-time-picker placeholder="Date Time" status="error"> </px-date-time-picker>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus & Blur after 2s</px-button>
				<px-button theme="info" @click="selectHandler">Select</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-date-time-picker
				placeholder="Date Time"
				ref="dateTimePickerRef"
			></px-date-time-picker>
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
			<px-date-time-picker
				placeholderStart="Start Date Time"
				placeholderEnd="End Date Time"
				ref="dateTimePickerRangeRef"
				mode="date-time-range"
			></px-date-time-picker>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { DateTimePicker } from '@pixelium/web-vue'

// If on-demand import
// import { DateTimePicker } from '@pixelium/web-vue/es'

const dateTimePickerRef = shallowRef<InstanceType<typeof DateTimePicker> | null>(null)
const dateTimePickerRangeRef = shallowRef<InstanceType<typeof DateTimePicker> | null>(null)

const focusHandler = () => {
	dateTimePickerRef.value?.focus()
	setTimeout(() => {
		dateTimePickerRef.value?.blur()
	}, 2000)
}
const clearHandler = () => {
	dateTimePickerRef.value?.clear()
}
const selectHandler = () => {
	dateTimePickerRef.value?.select()
}

const focusStartHandler = () => {
	dateTimePickerRangeRef.value?.focus('start')
}
const focusEndHandler = () => {
	dateTimePickerRangeRef.value?.focus('end')
}

const selectStartHandler = () => {
	dateTimePickerRangeRef.value?.select('start')
}
const selectEndHandler = () => {
	dateTimePickerRangeRef.value?.select('end')
}

const clearRangeHandler = () => {
	dateTimePickerRangeRef.value?.clear()
}
</script>

<style lang="css" scoped>
.px-date-time-picker {
	width: 320px;
}
</style>
