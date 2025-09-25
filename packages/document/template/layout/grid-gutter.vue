<template>
	<h4>x: 4px, y: 4px</h4>
	<px-grid :gutter="4">
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
	</px-grid>
	<h4>x: 8px, y: 4px</h4>
	<px-grid :gutter="{ x: 8, y: 4 }">
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
	</px-grid>
	<h4>Responsive</h4>
	<px-grid :gutter="gutter">
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Content</div></px-grid-item>
	</px-grid>
</template>
<script setup lang="ts">
const gutter = {
	xxl: 24,
	xl: 16,
	lg: 12,
	md: 8,
	sm: 4,
	xs: 2
}
</script>
<style lang="css" scoped>
.item {
	min-height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	text-align: center;
}
.px-grid {
	margin-bottom: 16px;
	margin-top: 4px;
}
.px-grid:last-of-type {
	margin-bottom: 0px;
}
.px-grid .px-grid-item:nth-child(even) .item {
	background: rgba(0, 168, 145, 1);
}
.px-grid .px-grid-item:nth-child(odd) .item {
	background: rgba(79, 184, 164, 1);
}
</style>
