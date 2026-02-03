---
slice-title: Option, GroupOption
---

```ts
export interface Option<T = any> {
	value: T
	label: string
}

export interface GroupOption<T = any> {
	children: (Option<T> | string)[]
	type: 'group'
}
```
