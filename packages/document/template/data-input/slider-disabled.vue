<template>
	<px-space direction="vertical">
		<px-slider :default-value="75" readonly></px-slider>
		<px-slider :default-value="25" disabled></px-slider>
	</px-space>
</template>

<style lang="css" scoped>
.px-slider {
	width: 400px;
}
</style>
