<template>
	<div style="font-family: monospace">
		<div style="font-size: 18px; padding: 16px">
			<px-typewriter :text="text1" :typeSpeed="80">
				<template #caret="{ visible }">
					<span :style="{ color: visible ? '#0960bd' : 'transparent' }">▊</span>
				</template>
			</px-typewriter>
		</div>
		<div style="font-size: 18px; padding: 16px">
			<px-typewriter :text="text2" :typeSpeed="80">
				<template #default="{ text }">
					<strong style="color: #00b42a">{{ text }}</strong>
				</template>
			</px-typewriter>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text1 = ref([{ type: 'type', text: 'Custom caret' }])

const text2 = ref([{ type: 'type', text: 'Styled text via default slot' }])
</script>
