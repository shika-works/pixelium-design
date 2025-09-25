<template>
	<h4>Flex Start</h4>
	<px-row align="start">
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Flex End</h4>
	<px-row align="end">
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Center</h4>
	<px-row align="center">
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Stretch</h4>
	<px-row align="stretch">
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
		<px-col :span="6"><div class="item">Content</div></px-col>
	</px-row>
</template>
<style lang="css" scoped>
.item {
	min-height: 64px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	text-align: center;
}
.px-row {
	margin-bottom: 16px;
	margin-top: 4px;
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
.px-row .px-col:nth-child(odd) .item {
	min-height: 96px;
}
</style>
