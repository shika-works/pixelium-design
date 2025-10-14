<template>
	<px-row>
		<px-col :span="6" :offset="6"><div class="item">Span 6 | Offset 6</div></px-col>
		<px-col :span="8" :offset="4"><div class="item">Span 8 | Offset 4</div></px-col>
	</px-row>
	<px-row>
		<px-col :span="6" :offset="offset"
			><div class="item">Span 6 | Offset Responsive</div></px-col
		>
	</px-row>
</template>
<script setup lang="ts">
const offset = {
	xxl: 18,
	xl: 12,
	lg: 8,
	md: 6,
	sm: 4,
	xs: 0
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
.px-row {
	margin-bottom: 16px;
}
.px-row:last-of-type {
	margin-bottom: 0px;
}
.px-row .px-col:nth-child(even) .item {
	background: rgba(0, 168, 145, 1);
}
.px-row .px-col:nth-child(odd) .item {
	background: rgba(79, 184, 164, 1);
}
</style>
