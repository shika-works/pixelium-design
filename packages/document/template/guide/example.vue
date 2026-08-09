<template>
	<div class="dashboard-iframe-wrapper">
		<iframe
			class="dashboard-iframe"
			src="https://shika-works.github.io/pixelium-dashboard/dashboard"
			title="Dashboard Example"
			allowfullscreen
			loading="lazy"
		></iframe>
	</div>
</template>

<style lang="less" scoped>
.dashboard-iframe-wrapper {
	width: 100%;
	height: 720px;
	border: 1px solid #e5e6eb;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.dashboard-iframe {
	width: 100%;
	height: 100%;
	border: none;
	display: block;
}
</style>
