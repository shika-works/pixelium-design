<template>
	<px-space>
		<px-tag closable @close="closeHandler">Primary</px-tag>
		<px-tag closable @close="closeHandler" theme="success">Success</px-tag>
		<px-tag closable @close="closeHandler" theme="warning">Warning</px-tag>
		<px-tag closable @close="closeHandler" theme="danger">Danger</px-tag>
		<px-tag closable @close="closeHandler" theme="info">Info</px-tag>
		<px-tag closable @close="closeHandler" theme="sakura">Sakura</px-tag>
	</px-space>
</template>
<script setup lang="ts">
const closeHandler = () => {
	$message.info('Tag close')
}
</script>
