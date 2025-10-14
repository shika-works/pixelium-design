<template>
	<px-space direction="vertical">
		<px-input-group>
			<px-input-group-label>
				<IconSearch></IconSearch>
			</px-input-group-label>
			<px-input placeholder="Please input"> </px-input>
			<px-button>Search</px-button>
		</px-input-group>
		<px-input-group>
			<px-input placeholder="Please input file name"> </px-input>
			<px-input-group-label> .ini </px-input-group-label>
		</px-input-group>
		<px-input-group>
			<px-input placeholder="Please input"> </px-input>
			<px-input-number placeholder="Please input" :default-value="0"> </px-input-number>
		</px-input-group>
	</px-space>
</template>
<script setup lang="ts">
import { IconSearch } from '@pixelium/web-vue/icon-hn/es'
</script>
<style lang="css" scoped>
.px-input,
.px-input-number {
	width: 320px;
}
</style>
