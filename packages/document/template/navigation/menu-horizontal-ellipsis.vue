<template>
	<px-menu direction="horizontal" :ellipsis="true">
		<px-menu-item :key="i" :index="i" v-for="i in 15">Item {{ i }}</px-menu-item>
	</px-menu>
</template>
