<template>
	<px-space direction="vertical">
		<px-space>
			<px-checkbox disabled :default-value="true">Checked</px-checkbox>
			<px-checkbox disabled>Unchecked</px-checkbox>
			<px-checkbox readonly :default-value="true">Checked Readonly</px-checkbox>
			<px-checkbox readonly>Unchecked Readonly</px-checkbox>
		</px-space>
		<px-space>
			<px-checkbox variant="retro" disabled :default-value="true">Checked</px-checkbox>
			<px-checkbox variant="retro" disabled>Unchecked</px-checkbox>
			<px-checkbox variant="retro" readonly :default-value="true">Checked Readonly</px-checkbox>
			<px-checkbox variant="retro" readonly>Unchecked Readonly</px-checkbox>
		</px-space>
	</px-space>
</template>
