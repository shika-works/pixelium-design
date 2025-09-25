<template>
	<px-container>
		<px-header>Header</px-header>
		<px-main>Main</px-main>
		<px-footer>Footer</px-footer>
	</px-container>
</template>

<style lang="css" scoped>
.px-container {
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
