<template>
	<div>
		<px-drawer
			:title="placement.toUpperCase()"
			:placement="placement"
			v-model:visible="visible"
		>
			Rock and Stone!
		</px-drawer>
		<px-button-group theme="info">
			<px-button @click="clickHandler('top')">TOP</px-button>
			<px-button @click="clickHandler('bottom')">BOTTOM</px-button>
			<px-button @click="clickHandler('left')">LEFT</px-button>
			<px-button @click="clickHandler('right')">RIGHT</px-button>
		</px-button-group>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const placement = ref('right')

const clickHandler = (place: 'top' | 'bottom' | 'left' | 'right') => {
	placement.value = place
	visible.value = true
}
</script>
