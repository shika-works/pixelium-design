<template>
	<px-space direction="vertical">
		<px-checkbox-group v-model="group">
			<px-checkbox value="Abigail">Abigail</px-checkbox>
			<px-checkbox value="Harvey">Harvey</px-checkbox>
			<px-checkbox value="Leah">Leah</px-checkbox>
			<px-checkbox value="Maru">Maru</px-checkbox>
		</px-checkbox-group>
		<px-checkbox-group :default-value="['Elliott']">
			<px-checkbox value="Elliott">Elliott</px-checkbox>
			<px-checkbox value="Haley">Haley</px-checkbox>
			<px-checkbox value="Penny">Penny</px-checkbox>
			<px-checkbox value="Sebastian">Sebastian</px-checkbox>
		</px-checkbox-group>
		<h4>Readonly</h4>
		<px-checkbox-group :default-value="['Sam']" readonly>
			<px-checkbox value="Sam">Elliott</px-checkbox>
			<px-checkbox value="Shane">Shane</px-checkbox>
		</px-checkbox-group>
		<h4>Disabled</h4>
		<px-checkbox-group :default-value="['Alex']" disabled>
			<px-checkbox value="Alex">Alex</px-checkbox>
			<px-checkbox value="Clint">Clint</px-checkbox>
		</px-checkbox-group>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const group = ref<string[]>([])
</script>
