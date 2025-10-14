<template>
	<px-space>
		<px-popover content="Controlled" v-model:visible="visible">
			<px-button>Controlled {{ visible }}</px-button>
		</px-popover>
		<px-popover content="Uncontrolled">
			<px-button>Uncontrolled</px-button>
		</px-popover>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>
