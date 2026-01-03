<template>
	<px-space direction="vertical">
		<px-breadcrumb @select="selectHandler">
			<px-breadcrumb-item disabled index="Town Hall">Town Hall</px-breadcrumb-item>
			<px-breadcrumb-item disabled index="Keep">Keep</px-breadcrumb-item>
			<px-breadcrumb-item disabled index="Castle">Castle</px-breadcrumb-item>
		</px-breadcrumb>
		<px-breadcrumb @select="selectHandler">
			<px-breadcrumb-item :clickable="false" index="Great Hall">Great Hall</px-breadcrumb-item>
			<px-breadcrumb-item :clickable="false" index="Stronghold">Stronghold</px-breadcrumb-item>
			<px-breadcrumb-item :clickable="false" index="Fortress">Fortress</px-breadcrumb-item>
		</px-breadcrumb>
	</px-space>
</template>

<script setup lang="ts">
const selectHandler = (index: number | string | symbol) => {
	$message.info(`${String(index)} Selected`)
}
</script>
