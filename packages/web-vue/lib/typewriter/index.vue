<template>
	<div class="pixelium px-typewriter px-word-wrap">
		<slot :text="currentText">
			<span class="px-typewriter-text">
				<span
					v-for="(seg, index) in segments"
					:key="index"
					class="px-typewriter-segment"
					:class="seg.class"
					:style="seg.color ? { color: seg.color } : undefined"
					>{{ seg.text }}</span
				>
			</span>
		</slot>
		<span v-if="props.caret" class="px-typewriter-caret">
			<slot name="caret" :visible="caretOn">
				<span class="px-typewriter-caret-inner" :style="{ opacity: caretOn ? 1 : 0 }">{{
					props.caretText
				}}</span>
			</slot>
		</span>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type {
	TypewriterEvents,
	TypewriterExpose,
	TypewriterProps,
	TypewriterText
} from './type'

defineOptions({
	name: 'Typewriter'
})

const props = withDefaults(defineProps<TypewriterProps>(), {
	text: () => [],
	typeSpeed: 80,
	deleteSpeed: 40,
	startDelay: 0,
	loop: false,
	start: true,
	pause: false,
	caret: true,
	caretText: '|',
	blinkSpeed: 500
})

const emits = defineEmits<TypewriterEvents>()

type StyleSegment = {
	text: string
	color?: string
	class?: string
}

const segments = ref<StyleSegment[]>([])
const activeColor = ref<string | undefined>(undefined)
const activeClass = ref<string | undefined>(undefined)
const currentText = computed(() => segments.value.map((seg) => seg.text).join(''))
const caretOn = ref(true)
const running = ref(false)

watch(currentText, (text) => {
	emits('textChange', text)
})

let session = 0
let timer: any = null
let resumeCallbacks: (() => void)[] = []

const clearTimer = () => {
	if (timer !== null) {
		clearTimeout(timer)
		timer = null
	}
}

const flushResume = () => {
	const callbacks = resumeCallbacks
	resumeCallbacks = []
	callbacks.forEach((cb) => cb())
}

const wait = (ms: number) =>
	new Promise<void>((resolve) => {
		const mySession = session
		const done = () => resolve()
		const registerResume = () => {
			resumeCallbacks.push(() => {
				if (session !== mySession) {
					done()
					return
				}
				wait(ms).then(done)
			})
		}
		if (session !== mySession) {
			done()
			return
		}
		if (props.pause) {
			registerResume()
			return
		}
		clearTimer()
		timer = setTimeout(() => {
			timer = null
			if (session !== mySession) {
				done()
				return
			}
			if (props.pause) {
				registerResume()
				return
			}
			done()
		}, ms)
	})

const cancelRun = () => {
	session++
	clearTimer()
	flushResume()
}

const appendChar = (char: string) => {
	const list = segments.value
	const last = list[list.length - 1]
	if (last && last.color === activeColor.value && last.class === activeClass.value) {
		last.text += char
	} else {
		list.push({
			text: char,
			color: activeColor.value,
			class: activeClass.value
		})
	}
}

const deleteChar = () => {
	const list = segments.value
	const last = list[list.length - 1]
	if (!last) return
	const chars = Array.from(last.text)
	chars.pop()
	last.text = chars.join('')
	if (last.text === '') {
		list.pop()
	}
}

const processCommand = async (item: TypewriterText) => {
	const mySession = session
	switch (item.type) {
		case 'type': {
			for (const char of item.text) {
				await wait(props.typeSpeed)
				if (session !== mySession) return
				appendChar(char)
			}
			break
		}
		case 'backspace': {
			for (let i = 0; i < item.count; i++) {
				await wait(props.deleteSpeed)
				if (session !== mySession) return
				deleteChar()
			}
			break
		}
		case 'delay': {
			await wait(item.ms)
			break
		}
		case 'clear': {
			segments.value = []
			break
		}
		case 'setTypeColor': {
			activeColor.value = item.color
			break
		}
		case 'setTypeClass': {
			activeClass.value = item.class
			break
		}
	}
}

const run = async () => {
	cancelRun()
	const mySession = session
	running.value = true
	segments.value = []
	activeColor.value = undefined
	activeClass.value = undefined
	emits('start')

	if (props.startDelay) {
		await wait(props.startDelay)
		if (session !== mySession) return
	}

	const list = props.text || []
	while (true) {
		for (let i = 0; i < list.length; i++) {
			if (session !== mySession) return
			emits('indexChange', i)
			await processCommand(list[i])
			if (session !== mySession) return
		}
		if (props.loop) {
			segments.value = []
			continue
		}
		break
	}

	running.value = false
	emits('end')
}

const start = () => {
	run()
}

const stop = () => {
	cancelRun()
	running.value = false
}

const reset = () => {
	cancelRun()
	segments.value = []
	activeColor.value = undefined
	activeClass.value = undefined
	running.value = false
	if (props.start) {
		run()
	}
}

defineExpose<TypewriterExpose>({
	start,
	stop,
	reset
})

let caretTimer: any = null
const startCaret = () => {
	stopCaret()
	if (!props.caret) return
	caretTimer = setInterval(() => {
		caretOn.value = !caretOn.value
	}, props.blinkSpeed)
}
const stopCaret = () => {
	if (caretTimer !== null) {
		clearInterval(caretTimer)
		caretTimer = null
	}
}

watch(
	[() => props.caret, () => props.blinkSpeed],
	() => {
		caretOn.value = true
		if (props.caret) {
			startCaret()
		} else {
			stopCaret()
		}
	},
	{ immediate: true }
)

watch(
	() => props.pause,
	(val) => {
		if (!val) {
			flushResume()
		}
	}
)

watch(
	() => props.text,
	() => {
		if (props.start && (props.text?.length || 0) > 0) {
			run()
		}
	}
)

onMounted(() => {
	if (props.start) {
		run()
	}
})

onUnmounted(() => {
	stopCaret()
	cancelRun()
})
</script>

<style lang="less" src="./index.less"></style>
<style src="../share/style/index.css" />
