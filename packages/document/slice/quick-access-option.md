```ts
export type QuickAccessOption = {
	label: string
	key?: string | number | symbol
	targetTime: Date | Date[] | (() => Date | Date[])
	buttonProps?: ButtonProps
}
```
