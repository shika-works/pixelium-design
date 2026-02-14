<template>
	<px-menu :default-active="'Home'" dark>
		<px-menu-item index="Home">
			Home
			<template #icon>
				<IconHome></IconHome>
			</template>
		</px-menu-item>
		<px-submenu index="Components" label="Components">
			<template #icon>
				<IconBars></IconBars>
			</template>
			<px-menu-item index="Button">
				Button
				<template #icon>
					<IconArrowAltCircleUp></IconArrowAltCircleUp>
				</template>
			</px-menu-item>
			<px-menu-item index="Input">
				Input
				<template #icon>
					<IconPencil></IconPencil>
				</template>
			</px-menu-item>
		</px-submenu>
		<px-menu-group index="More" label="More">
			<px-menu-item index="About">
				About
				<template #icon>
					<IconLink></IconLink>
				</template>
			</px-menu-item>
			<px-menu-item index="Github">
				Github
				<template #icon>
					<IconGithub></IconGithub>
				</template>
			</px-menu-item>
		</px-menu-group>
	</px-menu>
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
</script>
