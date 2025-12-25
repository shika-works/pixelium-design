<template>
	<px-space direction="vertical">
		<px-progress :percentage="30" theme="success">
			<template #indicator="{ percentage }">
				<span>{{ percentage }}%</span>
			</template>
		</px-progress>
		<px-progress :percentage="70" variant="checker" indicator-placement="outside">
			<template #indicator="{ percentage }">
				<px-text-outline :outline-width="2" color="var(--px-primary-6)"
					>{{ percentage }}%</px-text-outline
				>
			</template>
		</px-progress>
	</px-space>
</template>
