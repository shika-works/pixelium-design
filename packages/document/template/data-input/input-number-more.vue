<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-input-number
				placeholder="Please input number"
				disabled
				:default-value="0"
			></px-input-number>
			<px-input-number
				placeholder="Please input number"
				readonly
				:default-value="0"
			></px-input-number>
			<px-input-number
				placeholder="Please input number"
				loading
				:default-value="0"
			></px-input-number>
			<px-input-number
				placeholder="Please input number"
				clearable
				:default-value="0"
			></px-input-number>
		</px-space>
		<h4>Shape</h4>
		<px-space>
			<px-input-number
				placeholder="Please input number"
				shape="round"
				:default-value="0"
			></px-input-number>
			<px-input-number placeholder="Please input number" :default-value="0"></px-input-number>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-input-number
				placeholder="Please input number"
				size="small"
				:default-value="0"
			></px-input-number>
			<px-input-number placeholder="Please input number" :default-value="0"></px-input-number>
			<px-input-number
				placeholder="Please input number"
				size="large"
				:default-value="0"
			></px-input-number>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-input-number placeholder="Please input number" :default-value="1">
				<template #prefix>+</template>
				<template #suffix>s</template>
			</px-input-number>
			<px-input-number placeholder="Please input number" :default-value="0">
				<template #prepend>
					<IconBolt></IconBolt>
				</template>
			</px-input-number>
			<px-input-number placeholder="Please input number">
				<template #append>
					<IconBolt></IconBolt>
				</template>
			</px-input-number>
		</px-space>
		<h4>Composite</h4>
		<px-space>
			<px-input-group>
				<px-input-group-label>
					<IconBolt></IconBolt>
				</px-input-group-label>
				<px-input-number placeholder="Please input number" :default-value="0">
				</px-input-number>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-input-number placeholder="Please input number"> </px-input-number>
			<px-input-number placeholder="Please input number" status="success"> </px-input-number>
			<px-input-number placeholder="Please input number" status="warning"> </px-input-number>
			<px-input-number placeholder="Please input number" status="error"> </px-input-number>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus</px-button>
				<px-button theme="info" @click="blurHandler">Blur</px-button>
				<px-button theme="info" @click="selectHandler">Select</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-input-number placeholder="Please input" ref="inputNumberRef"></px-input-number>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { IconBolt } from '@pixelium/web-vue/icon-hn/es'
import { ref } from 'vue'
import { InputNumber } from '@pixelium/web-vue'

// If on-demand import
// import { InputNumber } from '@pixelium/web-vue/es'

const inputNumberRef = ref<InstanceType<typeof InputNumber>>(null)

const focusHandler = () => {
	inputNumberRef.value?.focus()
}
const blurHandler = () => {
	inputNumberRef.value?.blur()
}
const clearHandler = () => {
	inputNumberRef.value?.clear()
}
const selectHandler = () => {
	inputNumberRef.value?.select()
}
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
