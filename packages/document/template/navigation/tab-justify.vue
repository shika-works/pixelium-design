<template>
	<div>
		<h4>Start (default)</h4>
		<px-tab justify="start" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Content</p>
			</px-tab-panel>
			<px-tab-panel index="3" title="Tab C">
				<p>Content</p>
			</px-tab-panel>
		</px-tab>

		<h4>Center</h4>
		<px-tab justify="center" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Content</p>
			</px-tab-panel>
			<px-tab-panel index="3" title="Tab C">
				<p>Content</p>
			</px-tab-panel>
		</px-tab>

		<h4>End</h4>
		<px-tab justify="end" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Content</p>
			</px-tab-panel>
			<px-tab-panel index="3" title="Tab C">
				<p>Content</p>
			</px-tab-panel>
		</px-tab>
	</div>
</template>

<script setup lang="ts"></script>
