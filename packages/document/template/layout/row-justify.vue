<template>
	<h4>Flex Start</h4>
	<px-row justify="start">
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Flex End</h4>
	<px-row justify="end">
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Center</h4>
	<px-row justify="center">
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Space Between</h4>
	<px-row justify="space-between">
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Space Around</h4>
	<px-row justify="space-around">
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
	</px-row>
	<h4>Space Evenly</h4>
	<px-row justify="space-evenly">
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
		<px-col :span="4"><div class="item">Content</div></px-col>
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
</style>
