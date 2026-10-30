<template>
	<div class="bubble-demo">
		<div class="bubble-row" v-for="variant in variants" :key="variant">
			<span class="bubble-label">{{ variant }}</span>
			<px-bubble v-for="theme in themes" :key="theme" :variant="variant" :theme="theme">
				{{ theme }}
			</px-bubble>
		</div>
		<div class="bubble-row">
			<span class="bubble-label">color</span>
			<px-bubble color="#8b5cf6">#8b5cf6</px-bubble>
			<px-bubble variant="primary" color="#8b5cf6">#8b5cf6</px-bubble>
		</div>
	</div>
</template>

<script setup lang="ts">
const variants = ['plain', 'primary']
const themes = ['primary', 'sakura', 'success', 'warning', 'danger', 'info', 'notice']
</script>

<style scoped>
.bubble-demo {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
.bubble-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px;
}
.bubble-label {
	width: 64px;
	font-size: 13px;
	color: #909399;
}
</style>
