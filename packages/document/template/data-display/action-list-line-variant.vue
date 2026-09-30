<template>
	<px-action-list line-variant="dashed" :spacing="48">
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
			content="The row overrides the line variant with solid."
			line-variant="solid"
		/>
		<px-action-list-item
			index="dashed-3"
			status="pending"
			title="Write the summary"
			content="The last row draws no line."
		/>
	</px-action-list>
</template>
