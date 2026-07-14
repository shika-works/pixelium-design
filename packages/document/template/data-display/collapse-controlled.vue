<template>
	<px-space direction="vertical" :width="400">
		<px-button @click="active = []" :disabled="active.length === 0"> Collapse All </px-button>
		<px-collapse :active="active" @update:active="active = $event">
			<px-collapse-item title="Controlled Panel 1" :index="0">
				<p>This panel is controlled via the <code>active</code> prop.</p>
			</px-collapse-item>
			<px-collapse-item title="Controlled Panel 2" :index="1">
				<p>The parent component manages the active state.</p>
			</px-collapse-item>
			<px-collapse-item title="Controlled Panel 3" :index="2">
				<p>Click "Collapse All" to close all panels from outside.</p>
			</px-collapse-item>
		</px-collapse>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number[]>([0])
</script>
