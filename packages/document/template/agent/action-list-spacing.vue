<template>
	<px-action-list :spacing="32">
		<px-action-list-item
			index="list-1"
			status="success"
			title="Search the web"
			content="ActionList sets spacing to 32."
		/>
		<px-action-list-item
			index="list-2"
			status="running"
			title="Read the sources"
			:spacing="48"
			content="Every row inherits it."
		/>
		<px-action-list-item
			index="list-3"
			status="pending"
			title="Write the summary"
			content="The last row keeps no spacing."
		/>
	</px-action-list>
</template>
