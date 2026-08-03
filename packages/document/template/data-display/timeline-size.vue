<template>
	<px-space direction="vertical" :width="560">
		<px-timeline size="medium">
			<px-timeline-item
				title="Medium size"
				content="The `size` prop is `'medium'`, good for regular content."
				mark="2026-01"
				theme="primary"
			/>
			<px-timeline-item
				title="Medium size"
				content="Dot, font, and spacing all use the default sizes."
				mark="2026-03"
				theme="notice"
			/>
		</px-timeline>
		<px-timeline size="large">
			<px-timeline-item
				title="Large size"
				content="The `size` prop is `'large'`, good for emphasized timelines."
				mark="2026-06"
				theme="success"
			/>
			<px-timeline-item
				title="Large size"
				content="Dot, font, and spacing all increase accordingly."
				mark="2026-09"
				theme="warning"
			/>
		</px-timeline>
	</px-space>
</template>
