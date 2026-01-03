<template>
	<px-breadcrumb @select="selectHandler">
		<px-breadcrumb-item index="Home" href="/pixelium-design/" target="_self">
			<template #icon>
				<IconHome></IconHome>
			</template>
			Home
		</px-breadcrumb-item>
		<px-breadcrumb-item index="Current" label="Breadcrumb"></px-breadcrumb-item>
	</px-breadcrumb>
</template>

<script setup lang="ts">
import { IconHome } from '@pixelium/web-vue/icon-hn/es'

const selectHandler = (index: number | string | symbol) => {
	$message.info(`${String(index)} Selected`)
}
</script>
