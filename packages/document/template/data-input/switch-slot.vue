<template>
	<px-space direction="vertical">
		<px-switch size="small">
			<template #active-icon><IconCheckSolid></IconCheckSolid></template>
			<template #inactive-icon><IconTimesSolid></IconTimesSolid></template>
			<template #active-label>Active</template>
			<template #inactive-label>Inactive</template>
			<template #active-tip>active</template>
			<template #inactive-tip>inactive</template>
		</px-switch>
		<px-switch
			active-label="Active"
			active-tip="active"
			inactive-label="Inactive"
			inactive-tip="inactive"
		>
			<template #active-icon><IconCheckSolid></IconCheckSolid></template>
			<template #inactive-icon><IconTimesSolid></IconTimesSolid></template>
		</px-switch>
		<px-switch size="large">
			<template #active-icon><IconCheckSolid></IconCheckSolid></template>
			<template #inactive-icon><IconTimesSolid></IconTimesSolid></template>
			<template #active-label>Active</template>
			<template #inactive-label>Inactive</template>
			<template #active-tip>active</template>
			<template #inactive-tip>inactive</template>
		</px-switch>
	</px-space>
</template>

<script setup lang="ts">
import { IconCheckSolid, IconTimesSolid } from '@pixelium/web-vue/icon-hn/es'
</script>
