<template>
	<px-button style="margin-right: 8px" color="#409EFF" @click="call('#409EFF')">#409EFF Color</px-button>
	<px-button style="margin-right: 8px" color="#FAE13C" @click="call('#FAE13C')">#FAE13C Color</px-button>
	<px-button style="margin-right: 8px" color="#E956AE" @click="call('#E956AE')">#E956AE Color</px-button>
	<px-button color="#909399" @click="call('#909399')">#909399 Color</px-button>
</template>
<script lang="ts" setup>
const call = (color: string) => {
	$message({
		content: `${color}`,
		color
	})
}
</script>
