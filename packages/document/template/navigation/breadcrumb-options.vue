<template>
	<px-breadcrumb @select="selectHandler" :options="options"> </px-breadcrumb>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectHandler = (index: number | string | symbol) => {
	$message.info(`${String(index)} Selected`)
}

const options = ref([{ index: 'Home', label: 'Home', href: '/pixelium-design/' }, 'Breadcrumb'])
</script>
