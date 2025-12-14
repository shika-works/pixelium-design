<template>
	<px-space direction="vertical">
		<px-space>
			<px-radio disabled :default-value="true">Checked</px-radio>
			<px-radio disabled>Unchecked</px-radio>
			<px-radio readonly :default-value="true">Checked Readonly</px-radio>
			<px-radio readonly>Unchecked Readonly</px-radio>
		</px-space>
		<px-space>
			<px-radio variant="retro" disabled :default-value="true">Checked</px-radio>
			<px-radio variant="retro" disabled>Unchecked</px-radio>
			<px-radio variant="retro" readonly :default-value="true">Checked Readonly</px-radio>
			<px-radio variant="retro" readonly>Unchecked Readonly</px-radio>
		</px-space>
	</px-space>
</template>
