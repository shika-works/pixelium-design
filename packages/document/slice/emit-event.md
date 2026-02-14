```ts
export type EmitEvent<T extends Record<string, any>> = {
	[K in keyof T as `on${Capitalize<K & string>}`]?: (...args: T[K]) => void
}
```
