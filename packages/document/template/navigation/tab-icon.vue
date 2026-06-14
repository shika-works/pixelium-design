<template>
	<px-tab :default-active="'1'">
		<px-tab-panel index="1" title="Home">
			<template #icon>
				<IconHome></IconHome>
			</template>
			<p>Home content</p>
		</px-tab-panel>
		<px-tab-panel index="2" title="Settings">
			<template #icon>
				<IconCog></IconCog>
			</template>
			<p>Settings content</p>
		</px-tab-panel>
		<px-tab-panel index="3" title="Messages">
			<template #icon>
				<IconEnvelope></IconEnvelope>
			</template>
			<p>Messages content</p>
		</px-tab-panel>
	</px-tab>
</template>

<script setup lang="ts">
import { IconHome, IconCog, IconEnvelope } from '@pixelium/web-vue/icon-hn/es'
</script>
