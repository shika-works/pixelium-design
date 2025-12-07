<template>
	<px-space direction="vertical">
		<h4>Single Checkbox</h4>
		<px-space>
			<px-checkbox size="small">Small</px-checkbox>
			<px-checkbox>Medium</px-checkbox>
			<px-checkbox size="large">Large</px-checkbox>
		</px-space>
		<px-space>
			<px-checkbox variant="retro" size="small">Small & Retro</px-checkbox>
			<px-checkbox variant="retro">Medium & Retro</px-checkbox>
			<px-checkbox variant="retro" size="large">Large & Retro</px-checkbox>
		</px-space>
		<h4>Group</h4>
		<px-checkbox-group :options="options" size="small"></px-checkbox-group>
		<px-checkbox-group :options="options"></px-checkbox-group>
		<px-checkbox-group :options="options" size="large"></px-checkbox-group>
	</px-space>
</template>

<script setup lang="ts">
const options = ['A', 'B', 'C', 'D']
</script>
