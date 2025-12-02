<template>
	<px-radio-group v-model="value">
		<px-radio label="1">张三</px-radio>
		<px-radio label="2">里斯</px-radio>
	</px-radio-group>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const value = ref('1')
</script>
