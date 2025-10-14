<template>
	<px-input-tag placeholder="Please input" v-model="tags">
		<template #tag="{ tag, index }">
			<div style="display: flex; align-items: center">
				<IconUser style="margin-right: 4px"></IconUser> {{ index }}.{{ tag }}
			</div>
		</template>
	</px-input-tag>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconUser } from '@pixelium/web-vue/icon-hn/es'

const tags = ref<string[]>([])
</script>

<style lang="css" scoped>
.px-input-tag {
	width: 640px;
}
</style>
