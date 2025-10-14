<template>
	<px-space direction="vertical">
		<h4>Disabled, Readonly, Loading & Clearable</h4>
		<px-space>
			<px-input-tag placeholder="Please input" disabled></px-input-tag>
			<px-input-tag placeholder="Please input" readonly></px-input-tag>
			<px-input-tag placeholder="Please input" loading></px-input-tag>
			<px-input-tag placeholder="Please input" clearable></px-input-tag>
		</px-space>
		<h4>Size</h4>
		<px-space>
			<px-input-tag placeholder="Please input" size="small"></px-input-tag>
			<px-input-tag placeholder="Please input"></px-input-tag>
			<px-input-tag placeholder="Please input" size="large"></px-input-tag>
		</px-space>
		<h4>Count</h4>
		<px-space>
			<px-input-tag placeholder="Please input" show-count> </px-input-tag>
			<px-input-tag placeholder="Please input" show-count :max-length="255"> </px-input-tag>
		</px-space>
		<h4>Slot</h4>
		<px-space>
			<px-input-tag placeholder="Please input" :default-value="['Pixel Art', 'Dark Mode']">
				<template #prefix>feat:</template>
			</px-input-tag>
			<px-input-tag placeholder="Please input">
				<template #append>
					<IconBolt></IconBolt>
				</template>
			</px-input-tag>
		</px-space>
		<px-space>
			<px-input-group>
				<px-input-group-label>
					<IconBolt></IconBolt>
				</px-input-group-label>
				<px-input-tag placeholder="Please input"> </px-input-tag>
				<px-button>Confirm</px-button>
			</px-input-group>
		</px-space>
		<h4>Status</h4>
		<px-space>
			<px-input-tag placeholder="Please input"> </px-input-tag>
			<px-input-tag placeholder="Please input" status="success"> </px-input-tag>
			<px-input-tag placeholder="Please input" status="warning"> </px-input-tag>
			<px-input-tag placeholder="Please input" status="error"> </px-input-tag>
		</px-space>
		<h4>Expose</h4>
		<px-space direction="vertical">
			<px-space>
				<px-button theme="info" @click="focusHandler">Focus</px-button>
				<px-button theme="info" @click="blurHandler">Blur</px-button>
				<px-button theme="warning" @click="clearHandler">Clear</px-button>
			</px-space>
			<px-input-tag placeholder="Please input" ref="inputTagRef"></px-input-tag>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { IconBolt } from '@pixelium/web-vue/icon-hn/es'
import { ref } from 'vue'
import { InputTag } from '@pixelium/web-vue'

// If on-demand import
// import { InputTag } from '@pixelium/web-vue/es'

const inputTagRef = ref<InstanceType<typeof InputTag>>(null)

const focusHandler = () => {
	inputTagRef.value?.focus()
}
const blurHandler = () => {
	inputTagRef.value?.blur()
}
const clearHandler = () => {
	inputTagRef.value?.clear()
}
</script>

<style lang="css" scoped>
.px-input-tag {
	width: 400px;
}
</style>
