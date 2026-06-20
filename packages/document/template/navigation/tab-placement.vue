<template>
	<div>
		<h4>Top (default)</h4>
		<px-tab placement="top" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Top content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Top content</p>
			</px-tab-panel>
		</px-tab>

		<h4>Bottom</h4>
		<px-tab placement="bottom" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Bottom content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Bottom content</p>
			</px-tab-panel>
		</px-tab>

		<h4>Left</h4>
		<px-tab placement="left" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Left content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Left content</p>
			</px-tab-panel>
		</px-tab>

		<h4>Right</h4>
		<px-tab placement="right" :default-active="'1'">
			<px-tab-panel index="1" title="Tab A">
				<p>Right content</p>
			</px-tab-panel>
			<px-tab-panel index="2" title="Tab B">
				<p>Right content</p>
			</px-tab-panel>
		</px-tab>
	</div>
</template>

<script setup lang="ts"></script>
