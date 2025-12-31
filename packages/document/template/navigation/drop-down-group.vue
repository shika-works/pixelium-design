<template>
	<px-space>
		<px-drop-down :options="options1">
			<px-button>DropDown Group</px-button>
		</px-drop-down>
		<px-drop-down :options="options2">
			<px-button>DropDown Divider</px-button>
		</px-drop-down>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const options1 = ref([
	'Action 1',
	'Action 2',
	'Action 3',
	{
		label: 'Action More',
		index: 'Action More',
		children: ['Action More 1', 'Action More 2', 'Action More 3'],
		type: 'group'
	}
])
const options2 = ref([
	'Action 1',
	'Action 2',
	'Action 3',
	{
		label: 'Action More 1',
		index: 'Action More 1',
		divider: true
	},
	'Action More 2',
	'Action More 3'
])
</script>
