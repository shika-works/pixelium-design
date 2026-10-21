<template>
	<px-timeline :spacing="48">
		<px-timeline-item
			title="Timeline spacing"
			content="Timeline sets `spacing` to 8, and every item inherits it."
			mark="09:00"
			footer="Started"
			theme="notice"
		/>
		<px-timeline-item
			title="Item spacing"
			content="This item sets `spacing` to 64, so the gap below it grows."
			mark="09:20"
			footer="Running"
			theme="info"
			:spacing="128"
		/>
		<px-timeline-item
			title="Inherited again"
			content="The next item follows the Timeline spacing again."
			mark="09:40"
			footer="Finished"
			theme="sakura"
		/>
	</px-timeline>
</template>
