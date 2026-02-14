---
slice-title: OptionListOption, OptionListOption
---

```ts
export interface OptionListOption<T = any> extends Option<T> {
	disabled?: boolean
	key?: string | number | symbol
}

export interface OptionListGroupOption extends GroupOption {
	label: string
	key: string | number | symbol
	children: (OptionListOption | string)[]
}
```
