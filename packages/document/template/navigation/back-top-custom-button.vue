<template>
	<div>
		<p>
			Customize the inner button with <code>buttonProps</code> and replace the icon via the
			<code>icon</code> slot.
		</p>
		<px-back-top :button-props="{ theme: 'primary', shape: 'circle' }" :bottom="100">
			<template #icon>
				<IconArrowUp />
			</template>
		</px-back-top>
		<px-back-top :bottom="160">
			<template #trigger>
				<px-button> Scroll to Top! </px-button>
			</template>
		</px-back-top>
	</div>
</template>

<script setup lang="ts">
import { IconArrowUp } from '@pixelium/web-vue/icon-pa/es'
</script>
