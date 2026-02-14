<template>
	<px-space direction="vertical">
		<px-radio-group v-model="variant" :options="options"></px-radio-group>
		<px-scroll-bar style="height: 200px" :variant="variant">
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
			Loooooooooooooooong text<br />
		</px-scroll-bar>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const variant = ref('pixel')

const options = [
	{
		label: 'Pixel',
		value: 'pixel'
	},
	{
		label: 'Simple',
		value: 'simple'
	}
]
</script>
