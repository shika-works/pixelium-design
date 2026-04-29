<template>
	<px-space direction="vertical">
		<px-color-picker default-value="hsv(336, 80%, 60%)" size="large"></px-color-picker>
		<px-color-picker default-value="hsv(336, 80%, 75%)" shape="round"></px-color-picker>
		<px-color-picker default-value="hsv(336, 80%, 90%)" size="small"></px-color-picker>
		<px-space>
			<px-color-picker
				default-value="hsv(179, 80%, 45%)"
				size="large"
				shape="square"
			></px-color-picker>
			<px-color-picker
				default-value="hsv(179, 80%, 55%)"
				size="large"
				shape="circle"
			></px-color-picker>
			<px-color-picker default-value="hsv(179, 80%, 65%)" shape="square"></px-color-picker>
			<px-color-picker default-value="hsv(179, 80%, 75%)" shape="circle"></px-color-picker>
			<px-color-picker
				default-value="hsv(179, 80%, 85%)"
				size="small"
				shape="square"
			></px-color-picker>
			<px-color-picker
				default-value="hsv(179, 80%, 95%)"
				size="small"
				shape="circle"
			></px-color-picker>
		</px-space>
	</px-space>
</template>

<style lang="css" scoped>
.px-color-picker:not(.px-color-picker__square):not(.px-color-picker__circle) {
	width: 320px;
}
</style>
