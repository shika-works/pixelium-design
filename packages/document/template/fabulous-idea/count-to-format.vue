<template>
	<px-space direction="vertical">
		<div class="row">
			<span class="label">Separator:</span>
			<px-count-to :to="1234567" separator style="font-size: 24px"></px-count-to>
		</div>
		<div class="row">
			<span class="label">Separator + precision:</span>
			<px-count-to
				:to="1234567.89"
				:precision="2"
				separator
				style="font-size: 24px"
			></px-count-to>
		</div>
		<div class="row">
			<span class="label">Formatter:</span>
			<px-count-to
				:to="100"
				:formatter="(value: number) => `$${value.toFixed(2)}`"
				style="font-size: 24px; color: #00b42a"
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
