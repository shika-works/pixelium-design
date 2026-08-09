<template>
	<px-space direction="horizontal" wrap align="center">
		<px-circle-progress :percentage="60" :stroke-width="8" />
		<px-circle-progress :percentage="60" :stroke-width="12" theme="success" />
		<px-circle-progress :percentage="60" :stroke-width="20" theme="danger" />
		<px-circle-progress :percentage="60" :stroke-width="36" theme="warning" />
	</px-space>
</template>
