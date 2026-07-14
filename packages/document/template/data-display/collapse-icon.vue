<template>
	<px-space direction="vertical" :width="400">
		<px-collapse>
			<px-collapse-item title="Left Arrow (Default)" :index="0">
				<p>The expand arrow is on the left by default.</p>
			</px-collapse-item>
		</px-collapse>
		<px-collapse expand-icon-placement="right">
			<px-collapse-item title="Right Arrow" :index="0">
				<p>The expand arrow can be placed on the right.</p>
			</px-collapse-item>
		</px-collapse>
		<px-collapse :show-expand-icon="false">
			<px-collapse-item title="No Arrow" :index="0">
				<p>The expand arrow can be hidden entirely.</p>
			</px-collapse-item>
		</px-collapse>
	</px-space>
</template>
