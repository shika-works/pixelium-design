<template>
	<px-space direction="vertical">
		<px-input placeholder="Please input">
			<template #prefix>$</template>
		</px-input>
		<px-input placeholder="Please input">
			<template #suffix>km</template>
		</px-input>
	</px-space>
</template>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
