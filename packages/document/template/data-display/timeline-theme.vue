<template>
	<px-timeline>
		<px-timeline-item
			title="Primary theme"
			content="Use the `theme` prop to set the theme color."
			mark="2026-01"
			footer="v1.0.0"
			theme="primary"
		/>
		<px-timeline-item
			title="Success theme"
			content="Different theme colors are available."
			mark="2026-03"
			footer="v1.1.0"
			theme="success"
		/>
		<px-timeline-item
			title="Warning theme"
			content="Or use the `color` prop to set a custom color."
			mark="2026-06"
			footer="v2.0.0"
			theme="warning"
		/>
		<px-timeline-item
			title="Custom color"
			content="A custom color overrides the theme color."
			mark="2026-09"
			footer="v2.1.0"
			color="#ff7875"
		/>
		<px-timeline-item
			title="Dashed line"
			content="The `line-variant` prop controls the connector line style."
			mark="2026-11"
			footer="v2.2.0"
			theme="info"
			line-variant="dashed"
		/>
		<px-timeline-item
			title="Solid line"
			content="The last item does not draw a connector line."
			mark="2026-12"
			footer="v2.3.0"
			theme="danger"
		/>
	</px-timeline>
</template>
