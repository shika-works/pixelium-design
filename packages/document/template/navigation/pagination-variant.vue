<template>
	<px-space direction="vertical">
		<px-pagination :total="500" v-model:page="page"></px-pagination>
		<px-pagination :total="500" variant="text" v-model:page="page"></px-pagination>
		<px-pagination :total="500" variant="solid" v-model:page="page"></px-pagination>
		<px-pagination :total="500" variant="outline" v-model:page="page"></px-pagination>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
</script>
