<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-auto-complete
				placeholder="Please input"
				disabled
				:options="options"
			></px-auto-complete>
			<px-auto-complete
				placeholder="Please input"
				readonly
				:options="options"
			></px-auto-complete>
			<px-auto-complete
				placeholder="Please input"
				loading
				:options="options"
			></px-auto-complete>
			<px-auto-complete
				placeholder="Please input"
				clearable
				:options="options"
			></px-auto-complete>
		</px-space>
		<h4>Shape</h4>
		<px-space>
			<px-auto-complete
				placeholder="Please input"
				shape="round"
				:options="options"
			></px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options"></px-auto-complete>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-auto-complete
				placeholder="Please input"
				size="small"
				:options="options"
			></px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options"></px-auto-complete>
			<px-auto-complete
				placeholder="Please input"
				size="large"
				:options="options"
			></px-auto-complete>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-auto-complete placeholder="Please input" :options="options">
				<template #prefix>prefix</template>
				<template #suffix>suffix</template>
			</px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options">
				<template #prepend>
					<IconBolt></IconBolt>
				</template>
			</px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options">
				<template #append>
					<IconBolt></IconBolt>
				</template>
			</px-auto-complete>
		</px-space>
		<h4>Composite</h4>
		<px-space>
			<px-input-group>
				<px-input-group-label>
					<IconBolt></IconBolt>
				</px-input-group-label>
				<px-auto-complete placeholder="Please input" :options="options"> </px-auto-complete>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-auto-complete placeholder="Please input" :options="options"> </px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options" status="success">
			</px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options" status="warning">
			</px-auto-complete>
			<px-auto-complete placeholder="Please input" :options="options" status="error">
			</px-auto-complete>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus</px-button>
				<px-button theme="info" @click="blurHandler">Blur</px-button>
				<px-button theme="info" @click="selectHandler">Select</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-auto-complete
				placeholder="Please input"
				:options="options"
				ref="autoCompleteRef"
			></px-auto-complete>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { IconBolt } from '@pixelium/web-vue/icon-hn/es'
import { ref } from 'vue'
import { AutoComplete } from '@pixelium/web-vue'

// If on-demand import
// import { AutoComplete } from '@pixelium/web-vue/es'

const autoCompleteRef = ref<InstanceType<typeof AutoComplete>>(null)

const focusHandler = () => {
	autoCompleteRef.value?.focus()
}
const blurHandler = () => {
	autoCompleteRef.value?.blur()
}
const clearHandler = () => {
	autoCompleteRef.value?.clear()
}
const selectHandler = () => {
	autoCompleteRef.value?.select()
}

const options = ref<string[]>([
	'pear',
	'plum',
	'cherry',
	'blueberry',
	'raspberry',
	'blackberry',
	'lemon',
	'lime',
	'pomegranate',
	'apricot'
])
</script>

<style lang="css" scoped>
.px-auto-complete {
	width: 320px;
}
</style>
