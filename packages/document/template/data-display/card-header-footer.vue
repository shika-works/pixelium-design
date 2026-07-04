<template>
	<px-space>
		<px-card title="With Header Only" style="width: 300px">
			<p>Card with header visible (default).</p>
			<p>Footer is hidden by default.</p>
		</px-card>
		<px-card footer style="width: 300px">
			<template #header>
				<b>Custom Header</b>
			</template>
			<p>Card body content here.</p>
			<template #footer>
				<i>Footer Content</i>
			</template>
		</px-card>
		<px-card title="No Header" :header="false" style="width: 300px">
			<p>This card does not show the header section.</p>
		</px-card>
	</px-space>
</template>
