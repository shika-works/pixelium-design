<template>
	<px-collapse>
		<px-collapse-item title="Active Panel" :index="0">
			<p>This panel can be toggled normally.</p>
		</px-collapse-item>
		<px-collapse-item title="Disabled Panel" :index="1" disabled>
			<p>This content cannot be expanded because the panel is disabled.</p>
		</px-collapse-item>
		<px-collapse-item title="Another Active Panel" :index="2">
			<p>This panel works normally.</p>
		</px-collapse-item>
	</px-collapse>
</template>
