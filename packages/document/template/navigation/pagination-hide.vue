<template>
	<px-space direction="vertical">
		<px-switch active-label="Hide" v-model="hide"></px-switch>
		<px-pagination :total="1" :hideWhenSinglePage="hide"></px-pagination>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hide = ref(false)
</script>
