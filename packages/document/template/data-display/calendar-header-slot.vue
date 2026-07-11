<template>
	<px-calendar>
		<template #header="{ year, monthIndex }">
			<span style="color: var(--px-primary); font-weight: bold">
				{{ year }} / {{ monthIndex + 1 }}
			</span>
		</template>
	</px-calendar>
</template>
