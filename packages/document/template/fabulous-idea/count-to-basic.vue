<template>
	<px-space direction="vertical">
		<div class="row">
			<span class="label">Default:</span>
			<px-count-to :to="1000" style="font-size: 24px"></px-count-to>
		</div>
		<div class="row">
			<span class="label">1.5s:</span>
			<px-count-to :to="1000" :duration="1500" style="font-size: 24px"></px-count-to>
		</div>
		<div class="row">
			<span class="label">Precision:</span>
			<px-count-to
				:to="99.99"
				:precision="2"
				:duration="1500"
				style="font-size: 24px"
			></px-count-to>
		</div>
	</px-space>
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
