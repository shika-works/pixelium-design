<template>
	<px-space>
		<px-popconfirm content="Are you sure you want to delete this item?">
			<px-button theme="danger">Delete</px-button>
		</px-popconfirm>
		<px-popconfirm>
			<template #content>
				<div>
					Shouldn't we make the warning mark bigger?<br />
					It's hard to notice as is.
				</div>
			</template>
			<px-button>Confirm</px-button>
		</px-popconfirm>
	</px-space>
</template>
