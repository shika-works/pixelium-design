<template>
	<px-space>
		<px-slider v-model="input" direction="vertical"></px-slider>
		<px-slider v-model="input" direction="vertical" :marks="marks"></px-slider>
		<px-slider v-model="input" range direction="vertical"></px-slider>
		<px-slider v-model="input" range direction="vertical" :marks="marks">
			<template #mark="{ value, label }">
				<div
					style="display: flex; align-items: center"
					:style="{ color: value < 30 ? '#FF7D00' : '#00B42A' }"
				>
					<IconBolt style="margin-right: 4px"></IconBolt>
					{{ label || 'μ' }}
				</div>
			</template>
		</px-slider>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { IconBolt } from '@pixelium/web-vue/icon-hn/es'

const input = ref(0)

const marks = [
	{ value: 0, label: '0%' },
	{ value: 25, label: '25%' },
	{ value: 50, label: '50%' },
	{ value: 75, label: '75%' },
	{ value: 100, label: '100%' }
]
</script>

<style lang="css" scoped>
.px-slider {
	height: 400px;
	margin-right: 48px;
}
</style>
