<template>
	<px-menu :options="options"> </px-menu>
</template>

<script setup lang="ts">
import {
	IconHome,
	IconArrowAltCircleUp,
	IconPencil,
	IconGithub,
	IconLink,
	IconBars
} from '@pixelium/web-vue/icon-hn/es'
import { h, ref } from 'vue'

const options = ref([
	{
		label: 'Home',
		index: 'Home',
		href: '/pixelium-design/',
		icon: h(IconHome)
	},
	{
		label: 'Components',
		index: 'Components',
		icon: h(IconBars),
		type: 'submenu',
		children: [
			{
				label: 'Button',
				index: 'Button',
				icon: h(IconArrowAltCircleUp)
			},
			{
				label: 'Input',
				index: 'Input',
				icon: h(IconPencil)
			}
		]
	},
	{
		label: 'More',
		index: 'More',
		type: 'group',
		children: [
			{
				label: 'About',
				index: 'About',
				icon: h(IconLink)
			},
			{
				label: 'Github',
				index: 'Github',
				href: 'https://github.com/shika-works/pixelium-design',
				target: '_blank',
				icon: h(IconGithub)
			},
			'Contact us'
		]
	}
])
</script>
