// This file references use-composition/index.ts from the element-plus project.
// Licensed under the MIT License.
// https://github.com/element-plus/element-plus/blob/dev/packages/hooks/use-composition/index.ts

import { nextTick, ref } from 'vue'

interface UseCompositionOptions {
	afterComposition: (event: CompositionEvent) => void
}

export function useComposition({ afterComposition }: UseCompositionOptions) {
	const isComposing = ref(false)

	const compositionStartHandler = (_: CompositionEvent) => {
		isComposing.value = true
	}

	const compositionEndHandler = (event: CompositionEvent) => {
		if (isComposing.value) {
			isComposing.value = false
			nextTick(() => afterComposition(event))
		}
	}

	return [isComposing, compositionStartHandler, compositionEndHandler] as const
}
