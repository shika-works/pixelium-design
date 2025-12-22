<template>
	<div>
		<px-dialog title="Title" v-model:visible="visible">
			Content Content Content Content Content Content Content Content Content Content Content
			Content Content Content Content Content Content Content Content Content Content Content
			Content Content Content Content Content Content Content Content Content Content
		</px-dialog>
		<px-dialog title="Uncontrolled Dialog" ref="dialog">
			Content Content Content Content Content Content Content Content Content Content Content
			Content Content Content Content Content Content Content Content Content Content Content
			Content Content Content Content Content Content Content Content Content Content
		</px-dialog>
		<px-space>
			<px-button @click="visible = true">Open Controlled Dialog</px-button>
			<px-button @click="dialog?.open()">Open Uncontrolled Dialog</px-button>
		</px-space>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { Dialog } from '@pixelium/web-vue'

// If on-demand import
// import { Dialog } from '@pixelium/web-vue/es';

const visible = ref(false)
const dialog = shallowRef<InstanceType<typeof Dialog> | null>(null)
</script>
