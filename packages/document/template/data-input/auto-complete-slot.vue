<template>
	<px-auto-complete placeholder="Please input" v-model="input" :options="options">
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
	</px-auto-complete>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')
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
.px-auto-complete {
	width: 320px;
}
</style>
