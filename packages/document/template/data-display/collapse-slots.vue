<template>
	<px-collapse>
		<px-collapse-item :index="0">
			<template #title>
				<span style="color: var(--px-color-primary)">Custom Title Slot</span>
			</template>
			<p>Uses the <code>title</code> slot to render a customized title.</p>
		</px-collapse-item>
		<px-collapse-item title="With Prefix & Suffix" :index="1">
			<template #prefix>
				<span style="color: var(--px-color-success)">🔔</span>
			</template>
			<p>Prefix appears before the title, suffix after.</p>
			<template #suffix>
				<span style="color: var(--px-color-warning)">⭐</span>
			</template>
		</px-collapse-item>
		<px-collapse-item :index="2">
			<template #title>
				<px-tag variant="outline" color="primary">New</px-tag>
			</template>
			<template #default>
				<p>You can combine slots with other components.</p>
			</template>
		</px-collapse-item>
	</px-collapse>
</template>
