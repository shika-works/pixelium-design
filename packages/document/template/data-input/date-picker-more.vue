<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-date-picker placeholder="Date" disabled></px-date-picker>
			<px-date-picker placeholder="Date" readonly></px-date-picker>
			<px-date-picker placeholder="Date" loading></px-date-picker>
			<px-date-picker placeholder="Date" clearable></px-date-picker>
		</px-space>
		<h4>Shape</h4>
		<px-space>
			<px-date-picker placeholder="Year" mode="year" shape="round"></px-date-picker>
			<px-date-picker
				placeholder-start="Start Year"
				placeholder-end="End Year"
				mode="year-range"
			></px-date-picker>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-date-picker placeholder="Month" mode="month" size="small"></px-date-picker>
			<px-date-picker
				placeholder-start="Start Month"
				placeholder-end="End Month"
				mode="month-range"
			></px-date-picker>
			<px-date-picker placeholder="Month" size="large" mode="month"></px-date-picker>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-date-picker placeholder="Quarter" mode="quarter">
				<template #prefix>prefix</template>
				<template #suffix>suffix</template>
			</px-date-picker>
		</px-space>
		<h4>Composite</h4>
		<px-space>
			<px-input-group>
				<px-input-group-label> Start: </px-input-group-label>
				<px-date-picker
					placeholder-start="Start Quarter"
					placeholder-end="End Quarter"
					mode="quarter-range"
				>
				</px-date-picker>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-date-picker placeholder="Date"> </px-date-picker>
			<px-date-picker placeholder="Date" status="success"> </px-date-picker>
			<px-date-picker placeholder="Date" status="warning"> </px-date-picker>
			<px-date-picker placeholder="Date" status="error"> </px-date-picker>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus & Blur after 2s</px-button>
				<px-button theme="info" @click="selectHandler">Select</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-date-picker placeholder="Date" ref="datePickerRef"></px-date-picker>
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
			<px-date-picker
				placeholderStart="Start Date"
				placeholderEnd="End Date"
				ref="datePickerRangeRef"
				mode="date-range"
			></px-date-picker>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { DatePicker } from '@pixelium/web-vue'

// If on-demand import
// import { DatePicker } from '@pixelium/web-vue/es'

const datePickerRef = shallowRef<InstanceType<typeof DatePicker> | null>(null)
const datePickerRangeRef = shallowRef<InstanceType<typeof DatePicker> | null>(null)

const focusHandler = () => {
	setTimeout(() => {
		datePickerRef.value?.focus()
		setTimeout(() => {
			datePickerRef.value?.blur()
		}, 2000)
	}, 0)
}
const clearHandler = () => {
	setTimeout(() => {
		datePickerRef.value?.clear()
	}, 0)
}
const selectHandler = () => {
	setTimeout(() => {
		datePickerRef.value?.select()
	}, 0)
}

const focusStartHandler = () => {
	setTimeout(() => {
		datePickerRangeRef.value?.focus('start')
	}, 0)
}
const focusEndHandler = () => {
	setTimeout(() => {
		datePickerRangeRef.value?.focus('end')
	}, 0)
}

const selectStartHandler = () => {
	setTimeout(() => {
		datePickerRangeRef.value?.select('start')
	}, 0)
}
const selectEndHandler = () => {
	setTimeout(() => {
		datePickerRangeRef.value?.select('end')
	}, 0)
}

const clearRangeHandler = () => {
	datePickerRangeRef.value?.clear()
}
</script>

<style lang="css" scoped>
.px-date-picker {
	width: 320px;
}
</style>
