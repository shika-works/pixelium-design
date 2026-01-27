<template>
	<px-space direction="vertical">
		<px-progress :percentage="100">
			<template #prepend="{ percentage }">
				<span>Progress: {{ percentage }}%</span>
			</template>
			<template #append="{ percentage }">
				<span>Status: {{ percentage === 100 ? 'Complete' : 'In Progress' }}</span>
			</template>
		</px-progress>
		<px-progress :percentage="100" theme="success">
			<template #prepend> Message </template>
		</px-progress>
	</px-space>
</template>
