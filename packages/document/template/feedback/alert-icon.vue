<template>
	<px-space direction="vertical">
		<px-alert :show-icon="false"> No Icon </px-alert>
		<px-alert type="success">
			Custom Icon
			<template #icon>
				<IconAt />
			</template>
		</px-alert>
		<px-alert type="warning" icon-placement="start" text-align="center">
			Text Center & Icon Start
		</px-alert>
		<px-alert type="error" icon-placement="start" text-align="end">
			Text End & Icon Start
		</px-alert>
	</px-space>
</template>

<script lang="ts" setup>
import { IconAt } from '@pixelium/web-vue/icon-hn/es'
</script>
