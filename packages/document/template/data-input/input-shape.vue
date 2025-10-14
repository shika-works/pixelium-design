<template>
	<px-space direction="vertical">
		<px-input placeholder="Please input"></px-input>
		<px-input placeholder="Please input" shape="round"></px-input>
		<px-input placeholder="Please input" :border-radius="[20, 0]"></px-input>
	</px-space>
</template>

<style lang="css" scoped>
.px-input {
	width: 320px;
}
</style>
