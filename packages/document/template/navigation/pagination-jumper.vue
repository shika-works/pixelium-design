<template>
	<px-pagination :total="500" v-model:page="page" show-jumper></px-pagination>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
</script>
