<template>
	<h4>Column 24</h4>
	<px-grid>
		<px-grid-item :span="24"><div class="item">Span 24 | Width 100%</div></px-grid-item>
		<px-grid-item :span="12"><div class="item">Span 12 | Width 50%</div></px-grid-item>
		<px-grid-item :span="12"><div class="item">Span 12 | Width 50%</div></px-grid-item>
		<px-grid-item :span="8"><div class="item">Span 8 | Width 33.3333%</div></px-grid-item>
		<px-grid-item :span="8"><div class="item">Span 8 | Width 33.3333%</div></px-grid-item>
		<px-grid-item :span="8"><div class="item">Span 8 | Width 33.3333%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="6"><div class="item">Span 6 | Width 25%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-grid-item>
	</px-grid>
	<h4>Column 16</h4>
	<px-grid :column="16">
		<px-grid-item :span="8"><div class="item">Span 8 | Width 50%</div></px-grid-item>
		<px-grid-item :span="8"><div class="item">Span 8 | Width 50%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 25%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 25%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 25%</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4 | Width 25%</div></px-grid-item>
	</px-grid>
	<h4>Responsive</h4>
	<px-grid :column="column">
		<px-grid-item :span="4"><div class="item">Span 4</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4</div></px-grid-item>
		<px-grid-item :span="4"><div class="item">Span 4</div></px-grid-item>
	</px-grid>
</template>
<script setup lang="ts">
const column = {
	xxl: 24,
	xl: 20,
	lg: 16,
	md: 12,
	sm: 8,
	xs: 4
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
