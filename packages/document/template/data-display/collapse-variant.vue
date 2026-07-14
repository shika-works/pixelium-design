<template>
	<px-space direction="vertical" :width="400">
		<px-radio-group v-model="variant">
			<px-radio value="line">Line</px-radio>
			<px-radio value="card">Card</px-radio>
			<px-radio value="none">None</px-radio>
		</px-radio-group>
		<px-collapse :variant="variant">
			<px-collapse-item title="Panel 1" :index="0">
				<p>
					Current variant: <code>{{ variant }}</code>
				</p>
			</px-collapse-item>
			<px-collapse-item title="Panel 2" :index="1">
				<p>Try switching between different variants.</p>
			</px-collapse-item>
		</px-collapse>
	</px-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const variant = ref<'line' | 'card' | 'none'>('line')
</script>
