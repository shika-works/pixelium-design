<template>
	<px-space direction="vertical">
		<px-input-tag placeholder="Please input" v-model="tags"></px-input-tag>
		<px-input-tag
			placeholder="Please input"
			v-model="tags"
			:tag-props="{ variant: 'outline' }"
		></px-input-tag>
		<px-input-tag
			placeholder="Please input"
			v-model="tags"
			:tag-props="{ theme: 'primary' }"
		></px-input-tag>
		<px-input-tag
			placeholder="Please input"
			v-model="tags"
			:tag-props="{ color: '#E956AE' }"
		></px-input-tag>
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
