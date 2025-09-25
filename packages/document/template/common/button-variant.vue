<template>
	<div>
		<div v-for="variant in variants" :key="variant" style="margin-bottom: 8px">
			<px-button
				v-for="theme in themes"
				:key="theme"
				:variant="variant !== 'default' ? variant : undefined"
				:theme="theme !== 'default' ? theme : undefined"
				style="margin-right: 8px"
			>
				{{ variantLabels[variant] }}
			</px-button>
		</div>
	</div>
</template>

<script setup>
const variants = ['default', 'plain', 'outline', 'text']
const themes = ['default', 'success', 'warning', 'danger', 'info', 'sakura']
const variantLabels = {
	default: 'Primary',
	plain: 'Plain',
	outline: 'Outline',
	text: 'Text'
}
</script>
