<template>
	<px-space>
		<px-tooltip content="Controlled" v-model:visible="visible">
			<px-button>Controlled {{ visible }}</px-button>
		</px-tooltip>
		<px-tooltip content="Uncontrolled">
			<px-button>Uncontrolled</px-button>
		</px-tooltip>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>
