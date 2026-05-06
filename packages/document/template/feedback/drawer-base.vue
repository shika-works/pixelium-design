<template>
	<div>
		<px-drawer title="Controlled" v-model:visible="visible"> Hello World </px-drawer>
		<px-drawer title="Uncontrolled" ref="drawer"> Hello World </px-drawer>
		<px-space>
			<px-button theme="info" @click="visible = true">Open Controlled Drawer</px-button>
			<px-button theme="info" @click="drawer?.open()">Open Uncontrolled Drawer</px-button>
		</px-space>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { Drawer } from '@pixelium/web-vue'

// If on-demand import
// import { Drawer } from '@pixelium/web-vue/es';

const visible = ref(false)
const drawer = shallowRef<InstanceType<typeof Drawer> | null>(null)
</script>
