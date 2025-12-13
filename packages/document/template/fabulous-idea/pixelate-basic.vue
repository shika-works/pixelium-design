<template>
	<px-space direction="vertical">
		<px-image :src="'/pixelium-design/majyou.jpg'" style="height: 300px"></px-image>
		<px-image :src="pixel" style="height: 300px"></px-image>
	</px-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { pixelateImage, imageDataToDataURL } from '@pixelium/web-vue'

// When on-demand import
// import { pixelateImage, imageDataToDataURL } from '@pixelium/web-vue/es'

const pixel = ref('')

// Pokémon Ruby & Sapphire Exterior Palette
// from https://lospec.com/palette-list/pokemon-ruby-sapphire-exterior
const data = [
	'#000000',
	'#83838b',
	'#dee6ee',
	'#ffffff',
	'#7b4141',
	'#835a5a',
	'#9c7373',
	'#a4a4a4',
	'#bdbdbd',
	'#d5d5d5',
	'#c54141',
	'#ff625a',
	'#de6a62',
	'#6a5a5a',
	'#a4625a',
	'#bd948b',
	'#deb4a4',
	'#eed5cd',
	'#ee9473',
	'#de9473',
	'#ffbd83',
	'#ffc594',
	'#ffd5b4',
	'#413931',
	'#cd9c52',
	'#ffc55a',
	'#bd9c5a',
	'#d5b46a',
	'#bdbd83',
	'#decd83',
	'#eee6a4',
	'#395200',
	'#398b31',
	'#83c562',
	'#b4ff83',
	'#18a46a',
	'#41b483',
	'#73c5a4',
	'#a4d5c5',
	'#528bc5',
	'#62acee',
	'#73bdf6',
	'#102039',
	'#182952',
	'#293962',
	'#4a73ac',
	'#62a4de',
	'#29315a',
	'#394a7b',
	'#9cb4de',
	'#bdcde6',
	'#414a6a',
	'#62627b',
	'#413141',
	'#624152',
	'#cd4152'
]

pixelateImage('/pixelium-design/majyou.jpg', 8, {
	palette: data
}).then((res) => {
	if (!res) {
		return
	}
	pixel.value = imageDataToDataURL(res)
})
</script>
