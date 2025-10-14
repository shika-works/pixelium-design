<template>
	<px-space direction="vertical">
		<px-input placeholder="Please input" default-value="🎺🎸🎹🥁" show-count></px-input>
		<px-input
			placeholder="Please input"
			default-value="🎺🎸🎹🥁"
			show-count
			:max-length="20"
		></px-input>
		<px-input
			placeholder="Please input"
			default-value="🎺🎸🎹🥁"
			show-count
			:max-length="20"
			:countGraphemes="countGraphemes"
			:sliceGraphemes="sliceGraphemes"
		></px-input>
	</px-space>
</template>

<script setup lang="ts">
import GraphemeSplitter from 'grapheme-splitter'

const splitter = new GraphemeSplitter()
const countGraphemes = (val: string) => {
	return splitter.countGraphemes(val)
}
const sliceGraphemes = (val: string, limit: number) => {
	const arr = splitter.splitGraphemes(val)
	return arr.slice(0, limit).join('')
}
</script>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
