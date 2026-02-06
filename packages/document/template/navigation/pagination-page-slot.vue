<template>
	<px-space direction="vertical">
		<px-pagination :total="500" :page-slot="7" v-model:page="page"></px-pagination>
		<px-pagination :total="500" v-model:page="page"></px-pagination>
		<px-pagination :total="500" :page-slot="11" v-model:page="page"></px-pagination>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
</script>
