<template>
	<px-space direction="vertical">
		<px-circle-progress :percentage="percentage" />
		<px-button-group>
			<px-button theme="info" @click="percentage = Math.max(0, percentage - 10)">
				<template #icon>
					<IconMinus />
				</template>
			</px-button>
			<px-button theme="info" @click="percentage = Math.min(100, percentage + 10)">
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

const percentage = ref(50)
</script>
