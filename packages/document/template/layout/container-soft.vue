<template>
	<px-container>
		<px-header bordered>Header</px-header>
		<px-container>
			<px-aside bordered width="128px" dark>Aside Left</px-aside>
			<px-container>
				<px-main soft>Main</px-main>
				<px-footer bordered>Footer</px-footer>
			</px-container>
		</px-container>
	</px-container>
</template>

<style lang="css" scoped>
.px-container:not(.px-container .px-container) {
	height: 350px;
}

.px-header,
.px-footer,
.px-aside,
.px-main {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
