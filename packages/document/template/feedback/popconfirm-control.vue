<template>
	<px-popconfirm content="Controlled confirm" v-model:visible="visible">
		<px-button>Controlled {{ visible }}</px-button>
	</px-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>
