<template>
	<px-space direction="vertical">
		<px-radio-group v-model="group">
			<px-radio value="Egg Festival">Egg Festival</px-radio>
			<px-radio value="Desert Festival">Desert Festival</px-radio>
			<px-radio value="Flower Dance">Flower Dance</px-radio>
		</px-radio-group>
		<px-radio-group default-value="Luau">
			<px-radio value="Luau">Luau</px-radio>
			<px-radio value="Trout Derby">Trout Derby</px-radio>
			<px-radio value="Dance of the Moonlight Jellies">Dance of the Moonlight Jellies</px-radio>
		</px-radio-group>
		<h4>Retro Style</h4>
		<px-radio-group default-value="Night Market" variant="retro">
			<px-radio value="Night Market">Night Market</px-radio>
			<px-radio value="Feast of the Winter Star">Feast of the Winter Star</px-radio>
		</px-radio-group>
		<h4>Readonly</h4>
		<px-radio-group default-value="Stardew Valley Fai" readonly>
			<px-radio value="Stardew Valley Fai">Stardew Valley Fai</px-radio>
			<px-radio value="Spirit's Eve">Spirit's Eve</px-radio>
		</px-radio-group>
		<h4>Disabled</h4>
		<px-radio-group default-value="Festival of Ice" disabled>
			<px-radio value="Festival of Ice">Festival of Ice</px-radio>
			<px-radio value="SquidFest">SquidFest</px-radio>
		</px-radio-group>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const group = ref<string | null>(null)
</script>
