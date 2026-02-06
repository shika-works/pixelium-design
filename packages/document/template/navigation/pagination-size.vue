<template>
	<px-space direction="vertical">
		<px-pagination :total="500" size="small" v-model:page="page"></px-pagination>
		<px-pagination :total="500" v-model:page="page"></px-pagination>
		<px-pagination :total="500" size="large" v-model:page="page"></px-pagination>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
</script>
