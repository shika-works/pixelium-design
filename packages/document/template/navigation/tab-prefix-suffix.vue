<template>
	<px-tab :default-active="'1'">
		<template #prefix>
			<IconArrowLeft style="margin: 0 4px"></IconArrowLeft>
		</template>
		<px-tab-panel index="1" title="Tab A">
			<p>Content A</p>
		</px-tab-panel>
		<px-tab-panel index="2" title="Tab B">
			<p>Content B</p>
		</px-tab-panel>
		<px-tab-panel index="3" title="Tab C">
			<p>Content C</p>
		</px-tab-panel>
		<template #suffix>
			<IconArrowRight style="margin: 0 4px"></IconArrowRight>
		</template>
	</px-tab>
</template>

<script setup lang="ts">
import { IconArrowLeft, IconArrowRight } from '@pixelium/web-vue/icon-hn/es'
</script>
