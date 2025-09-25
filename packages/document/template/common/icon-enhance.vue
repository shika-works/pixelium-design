<template>
	<px-space size="large">
		Size:
		<px-space>
			<px-icon v-for="(icon, i) in icons" :key="icon.name + 'size'" :size="sizes[i]">
				<component :is="icon.comp" />
			</px-icon>
		</px-space>
		Color:
		<px-space>
			<px-icon v-for="(icon, i) in icons" :key="icon.name + 'color'" :color="colors[i]">
				<component :is="icon.comp" />
			</px-icon>
		</px-space>
		Rotate:
		<px-space>
			<px-icon v-for="(icon, i) in icons" :key="icon.name + 'rotate'" :rotate="rotates[i]">
				<component :is="icon.comp" />
			</px-icon>
		</px-space>
		Flip:
		<px-space>
			<px-icon v-for="(icon, i) in icons" :key="icon.name + 'flip'" :flip="flips[i]">
				<component :is="icon.comp" />
			</px-icon>
		</px-space>
		Spin:
		<px-space>
			<px-icon v-for="icon in icons" :key="icon.name + 'spin'" spin>
				<component :is="icon.comp" />
			</px-icon>
		</px-space>
	</px-space>
</template>

<script setup lang="ts">
import { IconUser, IconMessage, IconMinds, IconGaming } from '@pixelium/web-vue/icon-hn/es'

const icons = [
	{ name: 'User', comp: IconUser },
	{ name: 'Message', comp: IconMessage },
	{ name: 'Minds', comp: IconMinds },
	{ name: 'Gaming', comp: IconGaming }
]

const sizes = [12, 16, 20, 24]
const colors = ['#A3F9B7', '#D2045C', '#77AAFF', '#FFB347']
const rotates = [45, 90, 180, 270]
const flips = ['none', 'horizontal', 'vertical', 'both']
</script>
