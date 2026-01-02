<template>
	<px-space>
		<px-drop-down :options="options1" @select="selectHandler">
			<px-button>String Option</px-button>
		</px-drop-down>
		<px-drop-down :options="options2" @select="selectHandler">
			<px-button>Object Option</px-button>
		</px-drop-down>
	</px-space>
</template>
<script setup lang="ts">
import type { DropDownListOption } from '@pixelium/web-vue'

// On-demand import
// import type { DropDownListOption } from '@pixelium/web-vue/es';

import { ref } from 'vue'

const options1 = ref(['Action 1', 'Action 2', 'Action 3'])
const options2 = ref([
	{ label: 'Home', index: 'Home', href: '/pixelium-design/' },
	{
		label: 'Github',
		index: 'Github',
		target: '_blank',
		href: 'https://github.com/shika-works/pixelium-design'
	},
	{ label: 'Action 1', index: 'Action 1' },
	{ label: 'Action 2', index: 'Action 2', disabled: true },
	{ label: 'Action 3', index: 'Action 3' }
])

const selectHandler = (index: string, option: string | DropDownListOption) => {
	$message.info(
		`Selected index: ${index}, option: ${
			typeof option === 'string' ? option : JSON.stringify(option)
		}`
	)
}
</script>
