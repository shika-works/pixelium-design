<template>
	<h4>Flex Start</h4>
	<px-space justify="start">
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
	</px-space>
	<h4>Flex End</h4>
	<px-space justify="end">
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
	</px-space>
	<h4>Center</h4>
	<px-space justify="center">
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
	</px-space>
	<h4>Space Between</h4>
	<px-space justify="space-between">
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
	</px-space>
	<h4>Space Around</h4>
	<px-space justify="space-around">
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
	</px-space>
	<h4>Space Evenly</h4>
	<px-space justify="space-evenly">
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
		<div class="item">Content</div>
	</px-space>
</template>
<style lang="css" scoped>
.item {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	text-align: center;
	padding: 8px;
}
.px-space {
	margin-bottom: 16px;
	margin-top: 4px;
}
.px-space:last-of-type {
	margin-bottom: 0px;
}
.px-space :deep(.px-space-item):nth-child(even) .item {
	background: rgba(0, 168, 145, 1);
}
.px-space :deep(.px-space-item):nth-child(odd) .item {
	background: rgba(79, 184, 164, 1);
}
</style>
