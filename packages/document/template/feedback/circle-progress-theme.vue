<template>
	<px-space direction="horizontal" wrap>
		<px-circle-progress :percentage="20" />
		<px-circle-progress :percentage="35" theme="sakura" />
		<px-circle-progress :percentage="50" theme="success" />
		<px-circle-progress :percentage="65" theme="warning" />
		<px-circle-progress :percentage="80" theme="danger" />
		<px-circle-progress :percentage="100" theme="notice" />
	</px-space>
</template>
