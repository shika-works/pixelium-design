<template>
	<div>
		<px-tab v-model:active="active">
			<px-tab-panel index="1" title="Tab 1">
				<p>Content of Tab 1</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab 2">
				<p>Content of Tab 2</p>
			</px-tab-panel>
			<px-tab-panel index="3" title="Tab 3">
				<p>Content of Tab 3</p>
			</px-tab-panel>
		</px-tab>
		<p style="margin-top: 16px">Active: {{ active }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('1')
</script>
