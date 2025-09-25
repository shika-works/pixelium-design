<template>
	<px-row>
		<px-col :span="24"><div class="item">Span 24 | Width 100%</div></px-col>
		<px-col :span="12"><div class="item">Span 12 | Width 50%</div></px-col>
		<px-col :span="12"><div class="item">Span 12 | Width 50%</div></px-col>
		<px-col :span="8"><div class="item">Span 8 | Width 33.3333%</div></px-col>
		<px-col :span="8"><div class="item">Span 8 | Width 33.3333%</div></px-col>
		<px-col :span="8"><div class="item">Span 8 | Width 33.3333%</div></px-col>
		<px-col :span="6"><div class="item">Span 6 | Width 25%</div></px-col>
		<px-col :span="6"><div class="item">Span 6 | Width 25%</div></px-col>
		<px-col :span="6"><div class="item">Span 6 | Width 25%</div></px-col>
		<px-col :span="6"><div class="item">Span 6 | Width 25%</div></px-col>
		<px-col :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-col>
		<px-col :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-col>
		<px-col :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-col>
		<px-col :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-col>
		<px-col :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-col>
		<px-col :span="4"><div class="item">Span 4 | Width 16.6667%</div></px-col>
	</px-row>
</template>
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
