<template>
	<px-calendar>
		<template #cell="{ item }">
			<div
				class="custom-cell"
				:class="{
					'is-weekend':
						new Date(item.year, item.month, item.date).getDay() === 0 ||
						new Date(item.year, item.month, item.date).getDay() === 6
				}"
			>
				{{ item.date }}
			</div>
		</template>
	</px-calendar>
</template>

<style lang="css" scoped>
.custom-cell.is-weekend {
	background-color: var(--px-warning-1);
}

.custom-cell {
	padding: 8px;
	font-size: 16px;
	height: 100%;
}

:deep(.px-calendar-day__today) .custom-cell {
	color: var(--px-primary-6);
	text-shadow: 0 0 6px;
}

:deep(.px-calendar-day__selected) .custom-cell.is-weekend {
	color: var(--px-warning-6);
}
</style>
