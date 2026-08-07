<template>
	<px-space direction="vertical">
		<div class="row">
			<span class="label">Custom slot:</span>
			<px-count-to :to="100" :autoplay="false" #default="{ text, value }">
				<strong class="custom-text" style="font-size: 24px; color: #d97706">
					Score: {{ text }} ({{ value }})
				</strong>
			</px-count-to>
		</div>
		<div class="row">
			<span class="label">With progress color:</span>
			<px-count-to :to="80" :duration="2000" #default="{ text }">
				<span style="font-size: 24px; color: #00b42a">{{ text }}%</span>
			</px-count-to>
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
