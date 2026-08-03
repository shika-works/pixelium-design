<template>
	<px-timeline>
		<px-timeline-item
			title="Released"
			content="The `mark` prop shows marker text beside the time point."
			mark="2026-01"
			footer="v1.0.0"
			theme="primary"
		/>
		<px-timeline-item
			title="Released"
			content="Markers are displayed on every item once any item has one."
			mark="2026-03"
			footer="v1.1.0"
			theme="success"
		>
			<template #mark>
				<span style="color: #d97706">⭐ 2026-03</span>
			</template>
		</px-timeline-item>
		<px-timeline-item
			title="Released"
			content="The `mark` slot can customize the marker content."
			mark="2026-06"
			footer="v2.0.0"
			theme="warning"
		/>
	</px-timeline>
</template>
