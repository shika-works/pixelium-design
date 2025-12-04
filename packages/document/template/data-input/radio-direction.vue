<template>
	<px-switch v-model="vertical" active-label="Vertical" inactive-label="Horizontal"></px-switch>
	<br />
	<br />
	<px-radio-group :direction="vertical ? 'vertical' : 'horizontal'">
		<px-radio value="Chicken">Chicken</px-radio>
		<px-radio value="Void Chicken">Void Chicken</px-radio>
		<px-radio value="Golden Chicken">Golden Chicken</px-radio>
	</px-radio-group>
	<px-radio-group variant="retro" :direction="vertical ? 'vertical' : 'horizontal'">
		<px-radio value="Dinosaur">Dinosaur</px-radio>
		<px-radio value="Ostrich">Ostrich</px-radio>
		<px-radio value="Slime">Slime</px-radio>
	</px-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const vertical = ref(false)
</script>

<style lang="css" scoped>
.px-radio-group {
	margin-top: 16px;
	margin-right: 16px;
}
</style>
