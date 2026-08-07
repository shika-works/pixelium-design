<template>
	<div class="row">
		<span class="label">Start after 1.5s:</span>
		<px-count-to :to="888" :start-delay="1500" style="font-size: 24px"></px-count-to>
	</div>
</template>

<style scoped>
.row {
	display: flex;
	align-items: center;
}
.label {
	margin-right: 8px;
	color: #86909c;
}
</style>
