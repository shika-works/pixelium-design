<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-select placeholder="Please input" disabled :options="options"></px-select>
			<px-select placeholder="Please input" readonly :options="options"></px-select>
			<px-select placeholder="Please input" loading :options="options"></px-select>
			<px-select placeholder="Please input" clearable :options="options"></px-select>
		</px-space>
		<h4>Shape</h4>
		<px-space>
			<px-select placeholder="Please input" shape="round" :options="options"></px-select>
			<px-select placeholder="Please input" :options="options"></px-select>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-select placeholder="Please input" size="small" :options="options"></px-select>
			<px-select placeholder="Please input" :options="options"></px-select>
			<px-select placeholder="Please input" size="large" :options="options"></px-select>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-select placeholder="Please input" :options="options">
				<template #prefix>prefix</template>
				<template #suffix>suffix</template>
			</px-select>
		</px-space>
		<h4>Composite</h4>
		<px-space>
			<px-input-group>
				<px-input-group-label>
					<IconBolt></IconBolt>
				</px-input-group-label>
				<px-select placeholder="Please input" :options="options"> </px-select>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-select placeholder="Please input" :options="options"> </px-select>
			<px-select placeholder="Please input" :options="options" status="success"> </px-select>
			<px-select placeholder="Please input" :options="options" status="warning"> </px-select>
			<px-select placeholder="Please input" :options="options" status="error"> </px-select>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus & Blur after 5s</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-select placeholder="Please input" :options="options" ref="selectRef"></px-select>
		</px-space>
		<h4>Tag Render</h4>
		<px-select placeholder="Please input" multiple :options="options">
			<template #tag="{ label }">
				<div style="display: flex; align-items: center">
					<IconBolt style="margin-right: 4px"></IconBolt> {{ label }}
				</div>
			</template>
		</px-select>
		<h4>Option Render</h4>
		<px-select placeholder="Please input" v-model="input" :options="options">
			<template #group-label="{ option }">
				{{ option.label }}
				<div
					style="margin-left: 12px; color: red; font-size: 16px"
					v-if="option.label === 'citrus fruits'"
				>
					HOT!
				</div>
			</template>
			<template #option="{ option }">
				{{ option.label }}
				<px-tag style="margin-left: 12px" v-if="option.value === 'orange'">NEW!</px-tag>
			</template>
		</px-select>
	</px-space>
</template>

<script setup lang="ts">
import { IconBolt } from '@pixelium/web-vue/icon-hn/es'
import { ref } from 'vue'
import { Select } from '@pixelium/web-vue'

// If on-demand import
// import { Select } from '@pixelium/web-vue/es'

const selectRef = ref<InstanceType<typeof Select>>(null)

const focusHandler = () => {
	setTimeout(() => {
		selectRef.value?.focus()
		setTimeout(() => {
			selectRef.value?.blur()
		}, 5000)
	}, 50)
}
const clearHandler = () => {
	selectRef.value?.clear()
}

const options = ref([
	{
		type: 'group',
		label: 'citrus fruits',
		children: [
			{ label: 'orange', value: 'orange' },
			{ label: 'lemon', value: 'lemon' },
			{ label: 'lime', value: 'lime' },
			{ label: 'grapefruit', value: 'grapefruit' },
			{ label: 'tangerine', value: 'tangerine' }
		]
	},
	{
		type: 'group',
		label: 'tropical fruits',
		children: [
			{ label: 'mango', value: 'mango' },
			{ label: 'pineapple', value: 'pineapple' },
			{ label: 'papaya', value: 'papaya' },
			{ label: 'dragon fruit', value: 'dragon fruit' },
			{ label: 'durian', value: 'durian' },
			{ label: 'lychee', value: 'lychee' },
			{ label: 'longan', value: 'longan' }
		]
	}
])
</script>

<style lang="css" scoped>
.px-select {
	width: 320px;
}
</style>
