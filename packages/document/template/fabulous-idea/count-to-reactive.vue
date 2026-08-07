<template>
	<px-space direction="vertical">
		<px-space>
			<px-button theme="success" @click="increase">+1000</px-button>
			<px-button theme="danger" @click="decrease">-1000</px-button>
		</px-space>
		<px-count-to :from="0" :to="target" separator style="font-size: 24px"></px-count-to>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref(1000)

const increase = () => {
	target.value += 1000
}
const decrease = () => {
	target.value -= 1000
}
</script>
