<template>
	<px-calendar :cell-props="cellProps"></px-calendar>
</template>
<script setup lang="ts">
import type { CalendarItem } from '@pixelium/web-vue'

const cellProps = (item: CalendarItem) => {
	if (item.isCurrentMonth && (item.date === 1 || item.date === 15)) {
		return {
			style: {
				background: 'var(--px-primary-6)'
			},
			title: 'Pay day'
		}
	}
	return {}
}
</script>
