<template>
	<px-space vertical>
		<px-drop-down :options="options1">
			<px-button>Option Slot</px-button>
			<template #option="{ option }">
				<span style="display: flex; align-items: center; gap: 4px">
					<IconPencil v-if="typeof option === 'object' && option.index === '2'" />
					<IconHome v-else-if="typeof option === 'object' && option.href" />
					<IconBars v-else />
					{{ typeof option === 'string' ? option : option.label }}
				</span>
			</template>
		</px-drop-down>
		<px-drop-down :options="options2">
			<px-button>Group-Label Slot</px-button>
			<template #group-label="{ option }">
				<span
					style="display: flex; align-items: center; gap: 4px; color: var(--px-color-primary)"
				>
					<IconFolder />
					{{ option.label }}
				</span>
			</template>
		</px-drop-down>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { IconPencil, IconHome, IconBars, IconFolder } from '@pixelium/web-vue/icon-hn/es'

const options1 = ref([
	{ label: 'Home', index: '1', href: '/pixelium-design/' },
	{ label: 'Settings', index: '2' },
	{ label: 'Help', index: '3' }
])

const options2 = ref([
	{
		type: 'group',
		label: 'Fruits',
		index: 'group1',
		children: ['Apple', 'Banana', 'Orange']
	},
	{
		type: 'group',
		label: 'Vegetables',
		index: 'group2',
		children: ['Carrot', 'Broccoli', 'Spinach']
	}
])
</script>
