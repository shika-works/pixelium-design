<template>
	<h4>Small</h4>
	<px-space margin="small">
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
	</px-space>
	<h4>Medium</h4>
	<px-space>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
	</px-space>
	<h4>Large</h4>
	<px-space margin="large">
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
	</px-space>
	<h4>16px</h4>
	<px-space :margin="16">
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
	</px-space>
	<h4>x: 8px, y: 4px</h4>
	<px-space :margin="{ x: 8, y: 4 }" style="width: 320px">
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
	</px-space>
</template>
<style lang="css" scoped>
.px-row {
	margin-bottom: 16px;
	margin-top: 4px;
}
.px-row:last-of-type {
	margin-bottom: 0px;
}
</style>
