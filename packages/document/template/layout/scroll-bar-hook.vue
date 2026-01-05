<template>
	<px-space direction="vertical">
		<span> Scroll bar ready ? {{ initialized }} </span>
		<div style="height: 200px" ref="targetRef" data-overlayscrollbars-initialize>
			Now might I do it pat, now he is praying;<br />
			And now I'll do't. And so he goes to heaven;<br />
			And so am I revenged. That would be scann'd:<br />
			A villain kills my father; and for that,<br />
			I, his sole son, do this same villain send<br />
			To heaven.<br />
			O, this is hire and salary, not revenge.<br />
			He took my father grossly, full of bread;<br />
			With all his crimes broad blown, as flush as May;<br />
			And how his audit stands who knows save heaven?<br />
			But in our circumstance and course of thought,<br />
			'Tis heavy with him: and am I then revenged,<br />
			To take him in the purging of his soul,<br />
			When he is fit and season'd for his passage?<br />
			No!<br />
			Up, sword; and know thou a more horrid bent:<br />
			When he is drunk asleep, or in his rage,<br />
			Or in the incestuous pleasure of his bed;<br />
			At gaming, swearing, or about some act<br />
			That has no relish of salvation in't;<br />
			Then trip him, that his heels may kick at heaven,<br />
			And that his soul may be as damn'd and black<br />
			As hell, whereto it goes. My mother stays:<br />
			This physic but prolongs thy sickly days.
		</div>
	</px-space>
</template>

<script lang="ts" setup>
import { useScrollBar } from '@pixelium/web-vue'

// If on-demand import
// import { useScrollBar } from '@pixelium/web-vue/es'

import { onMounted, shallowRef } from 'vue'
const [init, getInstance, initialized] = useScrollBar()

const targetRef = shallowRef<HTMLDivElement | null>(null)

onMounted(() => {
	if (!targetRef.value) {
		return
	}
	init({
		target: targetRef.value
	})
})
</script>
