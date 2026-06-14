<template>
	<px-tab :default-active="'1'">
		<px-tab-panel index="1" title="Tab 1">
			<p>Content of Tab 1</p>
		</px-tab-panel>
		<px-tab-panel index="2" title="Disabled Tab" disabled>
			<p>This tab is disabled</p>
		</px-tab-panel>
		<px-tab-panel index="3" title="Tab 3">
			<p>Content of Tab 3</p>
		</px-tab-panel>
	</px-tab>
</template>

<script setup lang="ts"></script>
