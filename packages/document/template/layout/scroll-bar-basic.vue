<template>
	<px-space direction="vertical">
		<div>scrollOffset: {{ scrollOffset }}</div>
		<px-scroll-bar
			v-model:scroll-offset="scrollOffset"
			style="height: 200px"
			@scroll="scrollHandler"
		>
			To be, or not to be, that is the question:<br />
			Whether 'tis nobler in the mind to suffer<br />
			The slings and arrows of outrageous fortune,<br />
			Or to take arms against a sea of troubles<br />
			And by opposing end them. To die—to sleep,<br />
			No more; and by a sleep to say we end<br />
			The heart-ache and the thousand natural shocks<br />
			That flesh is heir to: 'tis a consummation<br />
			Devoutly to be wish'd. To die, to sleep;<br />
			To sleep, perchance to dream—ay, there's the rub:<br />
			For in that sleep of death what dreams may come,<br />
			When we have shuffled off this mortal coil,<br />
			Must give us pause—there's the respect<br />
			That makes calamity of so long life.
		</px-scroll-bar>
	</px-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const scrollOffset = ref({ left: 0, top: 0 })

const scrollHandler = (e: Event) => {
	console.log((e.target as Element).scrollLeft, (e.target as Element).scrollTop)
}
</script>
