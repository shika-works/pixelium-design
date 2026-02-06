<template>
	<px-pagination
		show-size
		:total="500"
		v-model:page-size="pageSize"
		v-model:page="page"
	></px-pagination>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>
