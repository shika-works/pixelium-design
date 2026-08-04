<template>
	<px-card>
		{{ date }}
		<px-calendar v-model="date"></px-calendar>
	</px-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>
