<template>
	<px-container>
		<px-header bordered dark>Header</px-header>
		<px-container>
			<px-aside bordered dark side="left" width="64px">Aside</px-aside>
			<px-aside bordered dark side="left" width="128px">Aside</px-aside>
			<px-container>
				<px-main>Main</px-main>
				<px-footer bordered dark>Footer</px-footer>
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
