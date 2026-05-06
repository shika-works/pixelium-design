<template>
	<div>
		<px-drawer class="drawer__wide" title="Wide" v-model:visible="visible[0]" show-footer>
			Wide
			<template #footer>
				<px-button @click="visible[1] = true">Next</px-button>
			</template>
		</px-drawer>
		<px-drawer title="Normal" v-model:visible="visible[1]" show-footer>
			Normal
			<template #footer>
				<px-button @click="visible[2] = true">Next</px-button>
			</template>
		</px-drawer>
		<px-drawer style="width: 400px" title="Thin" v-model:visible="visible[2]">Thin</px-drawer>
		<px-button @click="visible[0] = true">Open</px-button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref([false, false, false])
</script>

<style lang="css">
.drawer__wide {
	width: 560px !important;
}
</style>
