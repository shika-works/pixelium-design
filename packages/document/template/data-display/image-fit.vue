<template>
	<px-space>
		<px-image
			v-for="value in objectFit"
			src="https://picsum.photos/id/106/200/100"
			alt="Image"
			:object-fit="value"
			style="width: 100px; height: 100px"
		></px-image>
	</px-space>
</template>

<script setup lang="ts">
const objectFit = ['fill', 'contain', 'cover', 'none', 'scale-down']
</script>
