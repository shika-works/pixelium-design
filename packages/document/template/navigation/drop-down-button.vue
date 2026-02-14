<template>
	<px-space>
		<px-drop-down :options="options">
			<px-button
				>DropDown <IconChevronDown style="margin-left: 8px"></IconChevronDown
			></px-button>
		</px-drop-down>
		<px-button-group>
			<px-button>DropDown</px-button>

			<px-drop-down :options="options">
				<px-button shape="square"><IconChevronDown /></px-button>
			</px-drop-down>
		</px-button-group>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown } from '@pixelium/web-vue/icon-hn/es'

const options = ref(['Action 1', 'Action 2', 'Action 3'])
</script>
