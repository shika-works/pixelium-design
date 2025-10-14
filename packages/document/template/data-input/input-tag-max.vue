<template>
	<px-input-tag placeholder="Please input" v-model="tags" :max-length="12"></px-input-tag>
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
