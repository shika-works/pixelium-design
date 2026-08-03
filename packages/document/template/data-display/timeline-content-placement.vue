<template>
	<px-space direction="vertical" :width="560">
		<px-timeline>
			<px-timeline-item
				title="Content on the right"
				content="Rendered when `contentPlacement` is `'end'`."
				mark="2026-01"
				theme="primary"
			/>
			<px-timeline-item
				title="Content on the right"
				content="In vertical mode, content sits to the right of the dot."
				mark="2026-03"
				theme="success"
			/>
		</px-timeline>
		<px-timeline content-placement="start">
			<px-timeline-item
				title="Content on the left"
				content="Rendered when `contentPlacement` is `'start'`."
				mark="2026-01"
				theme="notice"
			/>
			<px-timeline-item
				title="Content on the left"
				content="In vertical mode, content sits to the left of the dot."
				mark="2026-03"
				theme="warning"
			/>
		</px-timeline>
	</px-space>
</template>
