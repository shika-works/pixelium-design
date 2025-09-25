<template>
	<px-grid>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
	</px-grid>
	<px-grid>
		<px-grid-item :span="span"><div class="item">Responsive</div></px-grid-item>
		<px-grid-item :span="span"><div class="item">Responsive</div></px-grid-item>
		<px-grid-item :span="span"><div class="item">Responsive</div></px-grid-item>
		<px-grid-item :span="span"><div class="item">Responsive</div></px-grid-item>
		<px-grid-item :span="span"><div class="item">Responsive</div></px-grid-item>
		<px-grid-item :span="span"><div class="item">Responsive</div></px-grid-item>
	</px-grid>
</template>
<script setup lang="ts">
const span = {
	xxl: 4,
	xl: 6,
	lg: 8,
	md: 12,
	sm: 12,
	xs: 24
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
