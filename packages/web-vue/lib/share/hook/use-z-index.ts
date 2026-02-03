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
	usedZIndex: Set<number>
}

export const stateMap: Record<string, ZIndexState> = {}

function ensureNamespace(ns: string, cfg: NamespaceConfig): ZIndexState {
	if (!stateMap[ns]) {
		stateMap[ns] = { initial: cfg.start, usedZIndex: new Set<number>() }
	}
	return stateMap[ns]
}

const allocate = (ns: ZIndexState): number => {
	const curUsedZIndex = ns.usedZIndex
	const maxUsed = curUsedZIndex.size > 0 ? Math.max(...curUsedZIndex) : ns.initial
	const nextZIndex = maxUsed + 1

	curUsedZIndex.add(nextZIndex)
	return nextZIndex
}

export const cleanState = () => {
	Object.keys(stateMap).forEach((key) => delete stateMap[key])
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
		ns.usedZIndex.delete(localZIndex.value)
	}

	onUnmounted(release)

	return [localZIndex, next, release] as const
}
