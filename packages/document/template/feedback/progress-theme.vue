<template>
	<px-space direction="vertical">
		<px-progress :percentage="progress"> </px-progress>
		<px-progress :percentage="progress" theme="success"> </px-progress>
		<px-progress :percentage="progress" theme="warning"> </px-progress>
		<px-progress :percentage="progress" theme="danger"> </px-progress>
		<px-progress :percentage="progress" theme="sakura"> </px-progress>
		<px-button-group>
			<px-button theme="info" @click="progress = Math.max(0, progress - 10)">
				<template #icon>
					<IconMinus />
				</template>
			</px-button>
			<px-button theme="info" @click="progress = Math.min(100, progress + 10)">
				<template #icon>
					<IconPlus />
				</template>
			</px-button>
		</px-button-group>
	</px-space>
</template>

<script setup lang="ts">
import { IconMinus, IconPlus } from '@pixelium/web-vue/icon-hn/es'
import { ref } from 'vue'

const progress = ref(10)
</script>
