<template>
	<px-space direction="vertical">
		<px-space>
			<span>Variant:</span>
			<px-radio-group v-model="variant" :options="variantOptions"></px-radio-group>
		</px-space>
		<px-space>
			<span>Placement:</span>
			<px-radio-group v-model="placement" :options="placementOptions"></px-radio-group>
		</px-space>
		<px-space>
			<span>Justify:</span>
			<px-radio-group v-model="justify" :options="justifyOptions"></px-radio-group>
		</px-space>
		<px-tab
			:variant="variant"
			:placement="placement"
			:justify="justify"
			:default-active="'1'"
			style="height: 400px"
		>
			<px-tab-panel index="1" title="Tab A">
				<p>Content of Tab A</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Content of Tab B</p>
			</px-tab-panel>
			<px-tab-panel index="3" title="Tab C">
				<p>Content of Tab C</p>
			</px-tab-panel>
		</px-tab>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const variant = ref('line')
const placement = ref('top')
const justify = ref('start')

const variantOptions = [
	{ label: 'Line', value: 'line' },
	{ label: 'Card', value: 'card' }
]

const placementOptions = [
	{ label: 'Top', value: 'top' },
	{ label: 'Bottom', value: 'bottom' },
	{ label: 'Left', value: 'left' },
	{ label: 'Right', value: 'right' }
]

const justifyOptions = [
	{ label: 'Start', value: 'start' },
	{ label: 'Center', value: 'center' },
	{ label: 'End', value: 'end' }
]
</script>
