<template>
	<px-space direction="vertical">
		<px-input-group shape="round">
			<px-input-group-label>
				<IconSearch></IconSearch>
			</px-input-group-label>
			<px-input placeholder="Please input"> </px-input>
			<px-button>Search</px-button>
		</px-input-group>
		<px-input-group :border-radius="[20, 16, 20, 16]">
			<px-input-group-label>
				<IconSearch></IconSearch>
			</px-input-group-label>
			<px-input placeholder="Please input"> </px-input>
			<px-button>Search</px-button>
		</px-input-group>
	</px-space>
</template>
<script setup lang="ts">
import { IconSearch } from '@pixelium/web-vue/icon-hn/es'
</script>
<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
