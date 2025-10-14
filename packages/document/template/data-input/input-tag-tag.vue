<template>
	<px-space direction="vertical">
		<px-input-tag placeholder="Please input" v-model="tags"></px-input-tag>
		<px-input-tag placeholder="Please input" v-model="tags" tag-variant="plain"></px-input-tag>
		<px-input-tag placeholder="Please input" v-model="tags" tag-theme="primary"></px-input-tag>
		<px-input-tag placeholder="Please input" v-model="tags" tag-color="#E956AE"></px-input-tag>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>

<style lang="css" scoped>
.px-input-tag {
	width: 640px;
}
</style>
