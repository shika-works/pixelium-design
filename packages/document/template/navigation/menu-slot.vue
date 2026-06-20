<template>
	<px-menu :default-active="'Home'">
		<px-menu-item index="Home">
			<template #icon>
				<IconHome></IconHome>
			</template>
			<div class="slot-content">
				<div>Home</div>
				<div class="menu-item-desc">Back to homepage</div>
			</div>
		</px-menu-item>
		<px-submenu index="Components">
			<template #icon>
				<IconBars></IconBars>
			</template>
			<template #label>
				<div class="slot-content">
					<div>Components</div>
					<div class="menu-item-desc">UI component library</div>
				</div>
			</template>
			<px-menu-item index="Button">
				<template #icon>
					<IconArrowAltCircleUp></IconArrowAltCircleUp>
				</template>
				<div class="slot-content">
					<div>Button</div>
					<div class="menu-item-desc">Click to trigger an action</div>
				</div>
			</px-menu-item>
			<px-menu-item index="Input">
				<template #icon>
					<IconPencil></IconPencil>
				</template>
				<div class="slot-content">
					<div>Input</div>
					<div class="menu-item-desc">Enter text values</div>
				</div>
			</px-menu-item>
		</px-submenu>
		<px-menu-group index="Links">
			<template #label>
				<div class="slot-content">
					<div>Links</div>
					<div class="menu-item-desc">Quick navigation links</div>
				</div>
			</template>
			<px-menu-item index="About">
				<template #icon>
					<IconLink></IconLink>
				</template>
				<div class="slot-content">
					<div>About</div>
					<div class="menu-item-desc">Learn more about us</div>
				</div>
			</px-menu-item>
			<px-menu-item
				index="Github"
				href="https://github.com/shika-works/pixelium-design"
				target="_blank"
			>
				<template #icon>
					<IconGithub></IconGithub>
				</template>
				<div class="slot-content">
					<div>Github</div>
					<div class="menu-item-desc">Star us on GitHub</div>
				</div>
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

<style scoped>
.slot-content {
	padding: 6px 0;
}

.menu-item-desc {
	font-size: 12px;
	color: var(--px-neutral-8);
	line-height: 1.4;
	margin-top: 4px;
}
</style>
