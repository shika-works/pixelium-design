<template>
	<div>
		{{ date }}
		<px-calendar v-model="date"></px-calendar>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>
