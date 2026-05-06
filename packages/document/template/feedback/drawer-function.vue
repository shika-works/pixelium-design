<template>
	<px-button @click="open" theme="info">Show</px-button>
</template>

<script setup lang="ts">
const open = () => {
	$drawer.open('This is an drawer.')
}
</script>
