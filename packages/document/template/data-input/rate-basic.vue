<template>
	<px-space direction="vertical">
		<px-rate v-model="rateValue"></px-rate>
		<px-rate :default-value="5"></px-rate>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const rateValue = ref(5)
</script>
