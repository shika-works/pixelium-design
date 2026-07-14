<template>
	<px-collapse accordion>
		<px-collapse-item title="Panel 1" :index="0">
			<p>Only one panel can be open at a time in accordion mode.</p>
		</px-collapse-item>
		<px-collapse-item title="Panel 2" :index="1">
			<p>Opening this panel will close panel 1.</p>
		</px-collapse-item>
		<px-collapse-item title="Panel 3" :index="2">
			<p>Clicking an open panel will close it.</p>
		</px-collapse-item>
	</px-collapse>
</template>
