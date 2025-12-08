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
	initial: number
}

const stateMap: Record<string, ZIndexState> = {}

function ensureNamespace(ns: string, cfg: NamespaceConfig): ZIndexState {
	if (!stateMap[ns]) {
		stateMap[ns] = { initial: cfg.start }
	}
	return stateMap[ns]
}

const usedZIndex = new Set<number>()

const allocate = (ns: ZIndexState): number => {
	const maxUsed = usedZIndex.size > 0 ? Math.max(...usedZIndex) : ns.initial
	const nextZIndex = maxUsed + 1

	usedZIndex.add(nextZIndex)
	return nextZIndex
}

export function useZIndex(namespace: keyof typeof DEFAULT_CONFIG = 'popup') {
	const cfg = DEFAULT_CONFIG[namespace]

	const ns = ensureNamespace(namespace, cfg)

	const curZIndex = allocate(ns)
	const localZIndex = ref<number>(curZIndex)

	const next = (): number => {
		localZIndex.value = allocate(ns)
		return localZIndex.value
	}

	const release = () => {
		usedZIndex.delete(localZIndex.value)
	}

	onUnmounted(release)

	return [localZIndex, next, release] as const
}
