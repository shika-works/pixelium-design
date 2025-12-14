<template>
	<px-space direction="vertical">
		<px-slider :default-value="50">
			<template #thumb>
				<IconHumanRun></IconHumanRun>
			</template>
		</px-slider>
		<px-slider :default-value="[25, 50]" range>
			<template #thumb-start> L </template>
			<template #thumb-end> R </template>
		</px-slider>
	</px-space>
</template>

<script lang="ts" setup>
import { IconHumanRun } from '@pixelium/web-vue/icon-pa/es'
</script>

<style lang="css" scoped>
.px-slider {
	width: 400px;
}
</style>
