<template>
	<px-pagination :total="500" show-total v-model:page="page">
		<template #total-label="{ total }"> Here has {{ total }} rows </template>
	</px-pagination>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
</script>
