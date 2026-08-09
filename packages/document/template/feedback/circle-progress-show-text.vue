<template>
	<px-space>
		<px-circle-progress :percentage="75" theme="success" :show-text="false" />
		<px-circle-progress :percentage="60" theme="notice">
			<template #default="{ percentage }">
				<span style="font-size: 20px">{{ percentage }}%</span>
			</template>
		</px-circle-progress>
	</px-space>
</template>
