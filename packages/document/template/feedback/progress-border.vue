<template>
	<px-space direction="vertical">
		<px-progress :percentage="30"> </px-progress>
		<px-progress :percentage="60" :border-width="1" border-color="#B4B4B4"> </px-progress>
		<px-progress :percentage="90" theme="success" :border-width="2"> </px-progress>
		<px-progress :percentage="80" theme="sakura" :gap="0" :border-width="0"> </px-progress>
	</px-space>
</template>
