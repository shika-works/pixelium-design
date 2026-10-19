import { computed, onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'
import { logError } from '../share/util/console'
import { inBrowser } from '../share/util/env'
import type { PromptSpeechSpectrum } from './type'

export type AudioMeterSource = 'microphone' | 'simulated'

type UseAudioMeterOptions = {
	active: Ref<boolean>
	source: Ref<AudioMeterSource>
	lanes: Ref<number>
	spectrum?: Ref<PromptSpeechSpectrum | undefined>
}

type ResolvedSpectrum = {
	minHz: number
	maxHz: number
	minDb: number
	maxDb: number
	smoothing: number
	fftSize: number
}

const DEFAULT_MIN_HZ = 80
const DEFAULT_MAX_HZ = 8000
const DEFAULT_MIN_DB = -80
const DEFAULT_MAX_DB = -25
const DEFAULT_SMOOTHING = 0.5
const DEFAULT_LANES = 36
const DEFAULT_FFT_SIZE = 2048
const BYTE_MAX = 255

const AUDIO_CONSTRAINTS = {
	autoGainControl: false,
	noiseSuppression: false,
	echoCancellation: false
}

const createLevels = (lanes: number) => Array.from({ length: lanes }, () => 0)

const resolveLanes = (lanes?: number) => {
	const count = Math.floor(lanes ?? 0)
	return count > 0 ? count : DEFAULT_LANES
}

const resolveSpectrum = (spectrum?: PromptSpeechSpectrum): ResolvedSpectrum => ({
	minHz: spectrum?.minHz ?? DEFAULT_MIN_HZ,
	maxHz: spectrum?.maxHz ?? DEFAULT_MAX_HZ,
	minDb: spectrum?.minDb ?? DEFAULT_MIN_DB,
	maxDb: spectrum?.maxDb ?? DEFAULT_MAX_DB,
	smoothing: spectrum?.smoothing ?? DEFAULT_SMOOTHING,
	fftSize: spectrum?.fftSize ?? DEFAULT_FFT_SIZE
})

const createBands = (
	lanes: number,
	binWidth: number,
	binCount: number,
	spectrum: ResolvedSpectrum
) => {
	const ratio = (spectrum.maxHz / spectrum.minHz) ** (1 / lanes)
	const last = binCount - 1
	let cursor = 1
	return Array.from({ length: lanes }, (_, index) => {
		const start = Math.min(
			last,
			Math.max(cursor, 1, Math.round((spectrum.minHz * ratio ** index) / binWidth))
		)
		const end = Math.min(
			last,
			Math.max(start, Math.round((spectrum.minHz * ratio ** (index + 1)) / binWidth))
		)
		cursor = Math.min(last, end + 1)
		return { start, end }
	})
}

export const useAudioMeter = (options: UseAudioMeterOptions) => {
	const levels = ref(createLevels(resolveLanes(options.lanes.value)))
	const source = ref<AudioMeterSource | null>(null)

	const stream = shallowRef<MediaStream | null>(null)
	let context: AudioContext | null = null
	let frame: number | null = null
	let run = 0

	const stopFrame = () => {
		if (frame === null) {
			return
		}
		cancelAnimationFrame(frame)
		frame = null
	}

	const release = () => {
		run++
		stopFrame()
		stream.value?.getTracks().forEach((track) => track.stop())
		stream.value = null
		context?.close()
		context = null
	}

	const animateSimulated = (smoothing: number) => {
		source.value = 'simulated'
		const current = run
		const step = () => {
			if (current !== run) {
				return
			}
			levels.value = levels.value.map((level) => {
				const target = Math.random()
				return level + (target - level) * smoothing
			})
			frame = requestAnimationFrame(step)
		}
		step()
	}

	const animateMicrophone = (
		analyser: AnalyserNode,
		sampleRate: number,
		spectrum: ResolvedSpectrum
	) => {
		source.value = 'microphone'
		const current = run
		const bands = createBands(
			resolveLanes(options.lanes.value),
			sampleRate / analyser.fftSize,
			analyser.frequencyBinCount,
			spectrum
		)
		const data = new Uint8Array(analyser.frequencyBinCount)
		const step = () => {
			if (current !== run) {
				return
			}
			analyser.getByteFrequencyData(data)
			levels.value = bands.map(({ start, end }) => {
				let peak = 0
				for (let bin = start; bin <= end; bin++) {
					peak = Math.max(peak, data[bin])
				}
				return peak / BYTE_MAX
			})
			frame = requestAnimationFrame(step)
		}
		step()
	}

	const startMicrophone = async (spectrum: ResolvedSpectrum) => {
		const current = ++run
		const AudioContextCtor = inBrowser()
			? (window as unknown as { AudioContext?: new () => AudioContext }).AudioContext
			: undefined
		const mediaDevices = inBrowser() ? navigator.mediaDevices : undefined
		if (!AudioContextCtor || !mediaDevices?.getUserMedia) {
			animateSimulated(spectrum.smoothing)
			return
		}
		try {
			const acquired = await mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS })
			if (current !== run) {
				acquired.getTracks().forEach((track) => track.stop())
				return
			}
			stream.value = acquired
			const audioContext = new AudioContextCtor()
			context = audioContext
			if (audioContext.state === 'suspended') {
				await audioContext.resume()
			}
			if (current !== run) {
				return
			}
			const analyser = audioContext.createAnalyser()
			analyser.fftSize = spectrum.fftSize
			analyser.minDecibels = spectrum.minDb
			analyser.maxDecibels = spectrum.maxDb
			analyser.smoothingTimeConstant = spectrum.smoothing
			audioContext.createMediaStreamSource(acquired).connect(analyser)
			animateMicrophone(analyser, audioContext.sampleRate, spectrum)
		} catch (error) {
			logError(error)
			if (current === run) {
				release()
				animateSimulated(spectrum.smoothing)
			}
		}
	}

	const start = () => {
		if (!inBrowser() || typeof requestAnimationFrame !== 'function') {
			return
		}
		release()
		source.value = null
		levels.value = createLevels(resolveLanes(options.lanes.value))
		const spectrum = resolveSpectrum(options.spectrum?.value)
		if (options.source.value === 'simulated') {
			animateSimulated(spectrum.smoothing)
		} else {
			startMicrophone(spectrum)
		}
	}

	const stop = () => {
		release()
		source.value = null
		levels.value = createLevels(resolveLanes(options.lanes.value))
	}

	const signature = computed(() => {
		const spectrum = resolveSpectrum(options.spectrum?.value)
		return [
			options.active.value,
			resolveLanes(options.lanes.value),
			spectrum.fftSize,
			spectrum.minHz,
			spectrum.maxHz,
			spectrum.minDb,
			spectrum.maxDb,
			spectrum.smoothing
		]
	})

	watch(signature, ([active]) => {
		if (active) {
			start()
		} else {
			stop()
		}
	})

	onBeforeUnmount(stop)

	return { levels, source, stream }
}
