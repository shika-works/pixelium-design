<template>
	<div>
		<px-switch v-model="collapsed" inactive-tip="Expanded" active-tip="Collapsed"></px-switch>
		<px-menu :collapsed="collapsed" :default-active="1" style="margin-top: 8px">
			<px-menu-item index="Overview">
				Overview
				<template #icon>
					<IconGrid></IconGrid>
				</template>
			</px-menu-item>
			<px-submenu index="Components" label="Components">
				<template #icon>
					<IconBars></IconBars>
				</template>
				<px-menu-item index="Input">
					Input
					<template #icon>
						<IconPencil></IconPencil>
					</template>
				</px-menu-item>
				<px-menu-item index="Search">
					Search
					<template #icon>
						<IconSearch></IconSearch>
					</template>
				</px-menu-item>
			</px-submenu>
			<px-menu-group index="Help" label="Help">
				<px-menu-item index="Document">
					Document
					<template #icon>
						<IconFolder></IconFolder>
					</template>
				</px-menu-item>
				<px-menu-item index="AI">
					AI
					<template #icon>
						<IconRobot></IconRobot>
					</template>
				</px-menu-item>
			</px-menu-group>
		</px-menu>
	</div>
</template>
<script setup lang="ts">
import {
	IconGrid,
	IconPencil,
	IconSearch,
	IconRobot,
	IconFolder,
	IconBars
} from '@pixelium/web-vue/icon-hn'
import { ref } from 'vue'

const collapsed = ref(true)
</script>
