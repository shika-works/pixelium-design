<template>
	<Teleport :to="props.root || 'body'">
		<slot> </slot>
	</Teleport>
</template>

<script setup lang="ts">
import type { PopupPortalProps } from './type'

defineOptions({
	name: 'PopupPortal'
})

const props = withDefaults(defineProps<PopupPortalProps>(), {
	root: 'body'
})
</script>
