```ts
import type { StyleValue } from 'vue'

export type VueClassValue = string | Record<string, any> | VueClassValue[]
export type VueStyleValue = StyleValue

export type RestAttrs = {
	style?: VueStyleValue | null
	class?: VueClassValue | null
	[x: string]: any
}
```
