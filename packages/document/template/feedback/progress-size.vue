<template>
	<px-space direction="vertical">
		<px-progress :percentage="20" size="small"> </px-progress>
		<px-progress :percentage="26" variant="checker" theme="success"> </px-progress>
		<px-progress :percentage="36" size="large" theme="sakura"> </px-progress>
		<px-progress :percentage="52" :size="52" theme="danger"> </px-progress>
	</px-space>
</template>
