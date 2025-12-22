<template>
	<px-space>
		<px-button @click="info" variant="outline">Info</px-button>
		<px-button @click="success" theme="success" variant="outline">Success</px-button>
		<px-button @click="warning" theme="warning" variant="outline">Warning</px-button>
		<px-button @click="error" theme="danger" variant="outline">Error</px-button>
		<px-button @click="confirm" theme="info" variant="outline">Confirm</px-button>
	</px-space>
</template>

<script setup lang="ts">
const info = () => {
	$dialog.info('This is an informational dialog.')
}
const success = () => {
	$dialog.success('This is a success dialog.')
}
const warning = () => {
	$dialog.warning('This is a warning dialog.')
}
const error = () => {
	$dialog.error('This is an error dialog.')
}
const confirm = () => {
	$dialog.confirm('Are you sure to proceed?').then((ok) => {
		if (ok) {
			$dialog.success('You have confirmed.')
		} else {
			$dialog.info('You have cancelled.')
		}
	})
}
</script>
