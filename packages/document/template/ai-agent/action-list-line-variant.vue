<template>
	<px-space direction="vertical" :width="480" :margin="{ y: 8 }">
		<px-action-list>
			<px-action-list-item
				index="solid-1"
				status="success"
				title="Search the web"
				content="The connector line is solid by default."
			/>
			<px-action-list-item
				index="solid-2"
				status="running"
				title="Read the sources"
				content="The line joins two rows."
			/>
			<px-action-list-item
				index="solid-3"
				status="pending"
				title="Write the summary"
				content="The last row draws no line."
			/>
		</px-action-list>
		<px-action-list line-variant="dashed">
			<px-action-list-item
				index="dashed-1"
				status="success"
				title="Search the web"
				content="The `lineVariant` prop is dashed."
			/>
			<px-action-list-item
				index="dashed-2"
				status="running"
				title="Read the sources"
				content="The line joins two rows."
			/>
			<px-action-list-item
				index="dashed-3"
				status="pending"
				title="Write the summary"
				content="The last row draws no line."
			/>
		</px-action-list>
	</px-space>
</template>
