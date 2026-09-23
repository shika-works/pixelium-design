<template>
	<px-timeline line-variant="dashed">
		<px-timeline-item
			title="Search the release notes"
			content="Timeline sets the line variant of every item."
			mark="2026-01"
			footer="v1.0.0"
			theme="primary"
		/>
		<px-timeline-item
			title="Review the draft"
			content="The item overrides the line variant of Timeline."
			mark="2026-03"
			footer="v1.1.0"
			theme="success"
			line-variant="solid"
		/>
		<px-timeline-item
			title="Publish the release"
			content="The last item draws no connector line."
			mark="2026-05"
			footer="v2.0.0"
			theme="warning"
		/>
	</px-timeline>
</template>
