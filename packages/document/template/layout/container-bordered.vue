<template>
	<px-container>
		<px-header bordered>Header</px-header>
		<px-container>
			<px-aside bordered width="96px" side="left">Aside Left</px-aside>
			<px-main>Main</px-main>
			<px-aside bordered width="96px" side="right">Aside Right</px-aside>
		</px-container>
		<px-footer bordered>Footer</px-footer>
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
.px-header,
.px-footer {
	background: rgba(79, 184, 164, 1);
}
.px-aside {
	background: rgba(0, 168, 145, 1);
}
</style>
