<template>
	<px-space :margin="{ x: 16 }">
		<px-loading-dots :dot-size="4" :interval="4"></px-loading-dots>
		<px-loading-dots :dot-size="8" :interval="8" theme="warning"></px-loading-dots>
		<px-loading-dots :dot-size="12" :interval="12" theme="danger"></px-loading-dots>
		<px-loading-dots dot-size="1rem" interval="0.5rem" theme="success"></px-loading-dots>
	</px-space>
</template>
