<template>
	<px-space>
		<div>
			<h4>Loading Prop</h4>
			<div class="lazy-container-left">
				<px-image
					v-for="value in 10"
					:key="value"
					src="https://picsum.photos/id/106/200/100"
					alt="Image"
					style="width: 100%; height: 100px"
					loading="lazy"
				></px-image>
			</div>
		</div>
		<div>
			<h4>Lazy Prop</h4>
			<div class="lazy-container-right">
				<px-image
					v-for="value in 10"
					:key="value"
					src="https://picsum.photos/id/106/200/100"
					alt="Image"
					style="width: 100%; height: 100px"
					lazy
					root=".lazy-container-righ"
				></px-image>
			</div>
		</div>
	</px-space>
</template>

<style lang="css" scoped>
.lazy-container-left,
.lazy-container-right {
	width: 200px;
	height: 500px;
	font-size: 0;
	overflow: auto;
}
</style>
