<template>
	<div class="narrow-list">
		<px-action-list>
			<px-action-list-item
				index="search"
				status="success"
				ellipsis
				title="Search the web for the latest pixel rendering articles"
				content="The content is hidden once the title alone overflows the row."
			/>
			<px-action-list-item
				index="read"
				status="running"
				ellipsis
				title="Read"
				content="Both the title and the content are truncated with an ellipsis."
			/>
			<px-action-list-item index="write" status="pending" ellipsis title="Write the summary" />
		</px-action-list>
	</div>
</template>

<style scoped>
.narrow-list {
	width: 280px;
}
</style>
