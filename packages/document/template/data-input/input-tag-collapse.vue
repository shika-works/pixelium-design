<template>
	<px-space direction="vertical">
		<px-input-tag
			placeholder="Please input"
			v-model="tags"
			collapse-tags
			:max-display-tags="8"
		></px-input-tag>
		<px-input-tag
			placeholder="Please input"
			v-model="tags"
			collapse-tags
			:max-display-tags="8"
			:collapse-tags-popover="false"
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
