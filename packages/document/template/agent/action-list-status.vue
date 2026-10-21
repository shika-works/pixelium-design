<template>
	<px-action-list>
		<px-action-list-item
			index="pending"
			status="pending"
			title="Pending"
			content="This step has not started yet."
		/>
		<px-action-list-item
			index="running"
			status="running"
			title="Running"
			content="This step is being executed."
		/>
		<px-action-list-item
			index="success"
			status="success"
			title="Success"
			content="This step finished successfully."
		/>
		<px-action-list-item
			index="warning"
			status="warning"
			title="Warning"
			content="This step finished with a warning."
		/>
		<px-action-list-item
			index="error"
			status="error"
			title="Error"
			content="This step failed."
		/>
		<px-action-list-item
			index="skipped"
			status="skipped"
			title="Skipped"
			content="This step was skipped."
		/>
		<px-action-list-item
			index="custom"
			status="success"
			color="#E956AE"
			title="Custom color"
			content="A custom color overrides the color of the status."
		/>
	</px-action-list>
</template>
