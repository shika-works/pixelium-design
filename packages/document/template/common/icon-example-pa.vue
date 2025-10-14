<script lang="ts" setup>
import Example from './icon-example.vue'
import * as PaIcons from '@pixelium/web-vue/icon-pa/es'

const keys = Object.keys(PaIcons).filter((e) => e !== 'install' && e !== 'default')
const group: Record<string, any[]> = {
	'': keys.map((key) => {
		return {
			key,
			icon: (PaIcons as any)[key]
		}
	})
}
</script>
<template>
	<Example :group="group"></Example>
</template>
