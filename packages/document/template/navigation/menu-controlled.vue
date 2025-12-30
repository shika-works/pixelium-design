<template>
	<div>
		<px-menu v-model:active="active" v-model:expanded="expanded">
			<px-menu-item index="1">Home</px-menu-item>
			<px-submenu index="2" label="Features">
				<px-menu-item index="2-1">One</px-menu-item>
				<px-menu-item index="2-2">Two</px-menu-item>
			</px-submenu>
		</px-menu>

		<div style="margin-top: 12px">Active: {{ active }} | Expanded: {{ expanded }}</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
const expanded = ref(['2'])
</script>
