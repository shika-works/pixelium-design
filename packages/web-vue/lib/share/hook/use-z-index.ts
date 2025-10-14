// useZIndex.ts
import { ref, onUnmounted } from 'vue'

interface NamespaceConfig {
	start: number
}

const DEFAULT_CONFIG: Record<string, NamespaceConfig> = {
	message: { start: 3000 },
	popup: { start: 1000 }
}

type ZIndexState = {
	max: number
	count: number
	initial: number
}

const stateMap: Record<string, ZIndexState> = {}

function ensureNamespace(ns: string, cfg: NamespaceConfig): ZIndexState {
	if (!stateMap[ns]) {
		stateMap[ns] = { max: cfg.start, count: 0, initial: cfg.start }
	}
	return stateMap[ns]
}

export function useZIndex(namespace: keyof typeof DEFAULT_CONFIG = 'popup') {
	const cfg = DEFAULT_CONFIG[namespace]

	const ns = ensureNamespace(namespace, cfg)
	const localZIndex = ref<number>(++ns.max)
	ns.count++

	const next = (): number => {
		localZIndex.value = ++ns.max
		return localZIndex.value
	}

	const release = () => {
		if (--ns.count === 0) {
			ns.max = ns.initial
		}
	}

	onUnmounted(release)

	return [localZIndex, next, release] as const
}
