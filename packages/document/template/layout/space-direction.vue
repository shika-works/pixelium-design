<template>
	<h4>Horizontal</h4>
	<px-space>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
		<px-button>Content</px-button>
	</px-space>
	<h4>Vertical</h4>
	<px-space direction="vertical">
		<px-button block>Content</px-button>
		<px-button block>Content</px-button>
		<px-button block>Content</px-button>
		<px-button block>Content</px-button>
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
