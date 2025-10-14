<template>
	<px-space>
		<px-button color="#409EFF" @click="call('#409EFF')">#409EFF Color</px-button>
		<px-button color="#FAE13C" @click="call('#FAE13C')">#FAE13C Color</px-button>
		<px-button color="#E956AE" @click="call('#E956AE')">#E956AE Color</px-button>
		<px-button color="#909399" @click="call('#909399')">#909399 Color</px-button>
	</px-space>
</template>
<script lang="ts" setup>
const call = (color: string) => {
	$message({
		content: `${color}`,
		color
	})
}
</script>
