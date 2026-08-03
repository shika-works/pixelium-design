<template>
	<px-space direction="vertical" :width="560">
		<px-timeline>
			<px-timeline-item
				title="Vertical"
				content="Arranged vertically by default."
				mark="2026-01"
				theme="primary"
			/>
			<px-timeline-item
				title="Vertical"
				content="Set the `direction` prop to `'horizontal'` to switch."
				mark="2026-03"
				theme="notice"
			/>
		</px-timeline>
		<px-timeline direction="horizontal">
			<px-timeline-item
				title="Horizontal"
				content="Time points extend along the horizontal axis."
				mark="2026-01"
				footer="..."
				theme="success"
			/>
			<px-timeline-item
				title="Horizontal"
				content="Good for horizontal steps or flows."
				mark="2026-03"
				theme="warning"
			/>
			<px-timeline-item
				title="Horizontal"
				content="Content sits below the axis."
				mark="2026-06"
				theme="info"
			/>
		</px-timeline>
	</px-space>
</template>
