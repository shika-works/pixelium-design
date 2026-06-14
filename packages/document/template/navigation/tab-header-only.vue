<template>
	<px-tab :default-active="'1'">
		<px-tab-item index="1" title="Tab A">
			<template #icon>
				<IconHome></IconHome>
			</template>
		</px-tab-item>
		<px-tab-item index="2">
			<template #title>
				<strong>Tab B</strong>
			</template>
			<template #icon>
				<IconCog></IconCog>
			</template>
		</px-tab-item>
		<px-tab-item index="3" title="Tab C" closable>
			<template #icon>
				<IconEnvelope></IconEnvelope>
			</template>
		</px-tab-item>
		<px-tab-item index="4" title="Disabled" disabled>
			<template #icon>
				<IconLock></IconLock>
			</template>
		</px-tab-item>
	</px-tab>
</template>

<script setup lang="ts">
import { IconHome, IconCog, IconEnvelope, IconLock } from '@pixelium/web-vue/icon-hn/es'
</script>
