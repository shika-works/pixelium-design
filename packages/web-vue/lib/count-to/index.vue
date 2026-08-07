<template>
	<span class="pixelium px-count-to">
		<slot :text="displayText" :value="displayValue">
			{{ displayText }}
		</slot>
	</span>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { CountToEvents, CountToExpose, CountToProps } from './type'

defineOptions({
	name: 'CountTo'
})

const props = withDefaults(defineProps<CountToProps>(), {
	from: 0,
	duration: 1000,
	precision: 0,
	startDelay: 0,
	autoplay: true
})

const emits = defineEmits<CountToEvents>()

const displayValue = ref(props.from)

const addSeparator = (text: string) => {
	const [intPart, decimalPart] = text.split('.')
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	const formattedDecimal = decimalPart?.replace(/(\d{3})(?=\d)/g, (match) => match + ',')
	return decimalPart !== undefined ? `${formattedInt}.${formattedDecimal}` : formattedInt
}

const displayText = computed(() => {
	if (props.formatter) return props.formatter(displayValue.value)
	const fixed = displayValue.value.toFixed(props.precision)
	return props.separator ? addSeparator(fixed) : fixed
})

let rafId: number | null = null
let delayTimer: ReturnType<typeof setTimeout> | null = null
let animFrom = 0
let animTo = 0
let animDuration = 1000
let startTime = 0
let elapsed = 0
let delayRemaining = 0
let status: 'idle' | 'playing' | 'paused' = 'idle'

const clearRaf = () => {
	if (rafId !== null) {
		cancelAnimationFrame(rafId)
		rafId = null
	}
}

const clearDelay = () => {
	if (delayTimer !== null) {
		clearTimeout(delayTimer)
		delayTimer = null
	}
}

const step = (timestamp: number) => {
	elapsed = timestamp - startTime
	const t = animDuration <= 0 ? 1 : Math.min(elapsed / animDuration, 1)
	displayValue.value = animFrom + (animTo - animFrom) * t
	if (t < 1) {
		rafId = requestAnimationFrame(step)
	} else {
		rafId = null
		status = 'idle'
		emits('end')
	}
}

const startRaf = () => {
	startTime = 0
	rafId = requestAnimationFrame((timestamp) => {
		startTime = timestamp - elapsed
		step(timestamp)
	})
}

const beginDelay = () => {
	if (props.startDelay > 0) {
		delayRemaining = props.startDelay
		delayTimer = setTimeout(() => {
			delayTimer = null
			delayRemaining = 0
			if (status === 'paused') return
			startRaf()
		}, props.startDelay)
	} else {
		startRaf()
	}
}

const playTo = (fromPlay: number, toPlay: number, durationPlay: number) => {
	clearRaf()
	clearDelay()
	animFrom = fromPlay
	animTo = toPlay
	animDuration = durationPlay
	elapsed = 0
	status = 'playing'
	emits('start')
	beginDelay()
}

const start = () => {
	playTo(props.from, props.to, props.duration)
}

const pause = () => {
	if (status !== 'playing') return
	status = 'paused'
	if (delayTimer !== null) {
		clearDelay()
	} else {
		clearRaf()
	}
}

const resume = () => {
	if (status !== 'paused') return
	status = 'playing'
	if (delayRemaining > 0) {
		delayTimer = setTimeout(() => {
			delayTimer = null
			delayRemaining = 0
			if (status === 'paused') return
			startRaf()
		}, delayRemaining)
	} else {
		startRaf()
	}
}

const reset = () => {
	clearRaf()
	clearDelay()
	status = 'idle'
	displayValue.value = props.from
	if (props.autoplay) {
		playTo(props.from, props.to, props.duration)
	}
}

defineExpose<CountToExpose>({
	start,
	pause,
	resume,
	reset
})

watch(
	() => props.to,
	(newTo) => {
		if (props.autoplay) {
			playTo(displayValue.value, newTo, props.duration)
		} else {
			displayValue.value = newTo
		}
	}
)

onMounted(() => {
	if (props.autoplay) {
		playTo(props.from, props.to, props.duration)
	} else {
		displayValue.value = props.from
	}
})

onUnmounted(() => {
	clearRaf()
	clearDelay()
})
</script>

<style lang="less" src="./index.less"></style>
