<template>
	<px-space>
		<px-button @click="confirm" theme="warning">Async Confirm</px-button>
	</px-space>
</template>

<script setup lang="ts">
const confirm = () => {
	$dialog
		.confirm({
			title: 'Async Confirm',
			content: 'Are you sure to proceed with async operation?',
			onBeforeOk() {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(Math.random() > 0.5)
					}, 2000)
				})
			},
			okText: 'Random Succeed',
			cancelText: 'Cancel',
			okButtonProps: {
				theme: 'warning'
			}
		})
		.then((ok) => {
			if (ok) {
				$message.success('You have confirmed.')
			} else {
				$message.info('You have cancelled.')
			}
		})
}
</script>
