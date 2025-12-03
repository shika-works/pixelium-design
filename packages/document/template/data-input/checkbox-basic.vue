<template>
	<px-space>
		<px-checkbox v-model="checked">Basic Checkbox</px-checkbox>
		<px-checkbox :default-value="true">Uncontrolled</px-checkbox>
		<px-checkbox label="Set Label By Prop"></px-checkbox>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
