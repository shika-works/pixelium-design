<template>
	<px-space direction="vertical">
		<px-switch
			active-label="Active"
			active-tip="active"
			inactive-label="Inactive"
			inactive-tip="inactive"
		>
			<template #active-icon>T</template>
			<template #inactive-icon>F</template>
		</px-switch>
		<px-switch :default-value="true">
			<template #active-icon>T</template>
			<template #inactive-icon>F</template>
			<template #active-label>Active</template>
			<template #inactive-label>Inactive</template>
			<template #active-tip>active</template>
			<template #inactive-tip>inactive</template>
		</px-switch>
	</px-space>
</template>
