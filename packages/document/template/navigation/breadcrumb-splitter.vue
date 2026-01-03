<template>
	<px-space direction="vertical">
		<px-breadcrumb splitter="/" @select="selectHandler">
			<px-breadcrumb-item index="Home">Home</px-breadcrumb-item>
			<px-breadcrumb-item index="Dashboard">Dashboard</px-breadcrumb-item>
			<px-breadcrumb-item index="Statistic">Statistic</px-breadcrumb-item>
		</px-breadcrumb>
		<px-breadcrumb @select="selectHandler">
			<px-breadcrumb-item index="Home">Home</px-breadcrumb-item>
			<px-breadcrumb-item index="Dashboard">Dashboard</px-breadcrumb-item>
			<px-breadcrumb-item index="Statistic">Statistic</px-breadcrumb-item>
			<template #splitter> → </template>
		</px-breadcrumb>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectHandler = (index: number | string | symbol) => {
	$message.info(`${String(index)} Selected`)
}
</script>
