<template>
	<px-space direction="vertical">
		<px-slider v-model="input0" :marks="marks" :step="0.01">
			<template #mark="{ value, label }">
				<div
					style="display: flex; align-items: center"
					:style="{ color: value < 50 ? '#FF7D00' : '#00B42A' }"
				>
					<IconAnalytics style="margin-right: 4px"></IconAnalytics>
					{{ label || 'μ' }}
				</div>
			</template>
		</px-slider>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { IconAnalytics } from '@pixelium/web-vue/icon-hn/es'

const input0 = ref(50)

const marks = [{ value: 15.87, label: 'μ-σ' }, 50, { value: 84.13, label: 'μ+σ' }]
</script>

<style lang="css" scoped>
.px-slider {
	width: 400px;
}
</style>
