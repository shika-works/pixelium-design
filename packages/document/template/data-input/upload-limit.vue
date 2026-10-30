<template>
	<px-upload :accept="['image/*', '.pdf']" @before-upload="beforeUpload"></px-upload>
</template>

<script setup lang="ts">
const beforeUpload = ({ file }: { file: File }) => file.size <= 1024 * 1024
</script>
