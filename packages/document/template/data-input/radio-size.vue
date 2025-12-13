<template>
	<px-space direction="vertical">
		<h4>Single Radio</h4>
		<px-space>
			<px-radio size="small">Small</px-radio>
			<px-radio>Medium</px-radio>
			<px-radio size="large">Large</px-radio>
		</px-space>
		<px-space>
			<px-radio variant="retro" size="small">Small & Retro</px-radio>
			<px-radio variant="retro">Medium & Retro</px-radio>
			<px-radio variant="retro" size="large">Large & Retro</px-radio>
		</px-space>
		<h4>Group</h4>
		<px-radio-group :options="options" size="small"></px-radio-group>
		<px-radio-group :options="options"></px-radio-group>
		<px-radio-group :options="options" size="large"></px-radio-group>
	</px-space>
</template>

<script setup lang="ts">
const options = ['Yes', 'or', 'No']
</script>
