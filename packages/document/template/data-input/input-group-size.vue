<template>
	<px-space direction="vertical">
		<px-input-group size="small">
			<px-input-group-label>
				<IconBolt></IconBolt>
			</px-input-group-label>
			<px-input-number placeholder="Please input number" :default-value="0"> </px-input-number>
			<px-button>Confirm</px-button>
		</px-input-group>
		<px-input-group>
			<px-input-group-label>
				<IconBolt></IconBolt>
			</px-input-group-label>
			<px-input-number placeholder="Please input number" :default-value="0"> </px-input-number>
			<px-button>Confirm</px-button>
		</px-input-group>
		<px-input-group size="large">
			<px-input-group-label>
				<IconBolt></IconBolt>
			</px-input-group-label>
			<px-input-number placeholder="Please input number" :default-value="0"> </px-input-number>
			<px-button>Confirm</px-button>
		</px-input-group>
	</px-space>
</template>

<script setup lang="ts">
import { IconBolt } from '@pixelium/web-vue/icon-hn/es'
</script>

<style lang="css" scoped>
.px-input-number {
	width: 320px;
}
</style>
