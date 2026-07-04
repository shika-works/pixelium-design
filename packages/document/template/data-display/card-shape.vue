<template>
	<px-space>
		<px-card title="Round Card (Default)" style="width: 300px">
			<p>Default shape is round with pixelSize × 4 border radius.</p>
		</px-card>
		<px-card title="Rect Card" shape="rect" style="width: 300px">
			<p>Rect shape has no rounded corners.</p>
		</px-card>
		<px-card title="Custom Radius" :border-radius="28" shape="round" style="width: 300px">
			<p>Custom border radius of 28px.</p>
		</px-card>
		<px-card
			title="Custom Radius Array"
			:border-radius="[12, 2, 12, 2]"
			shape="round"
			style="width: 300px"
		>
			<p>
				Individual corner radii: top-left 12px, top-right 2px, bottom-right 12px, bottom-left
				2px.
			</p>
		</px-card>
	</px-space>
</template>
