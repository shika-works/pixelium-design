```ts
enum SCREEN_SIZE_TYPE {
	XS = 'xs',
	SM = 'sm',
	MD = 'md',
	LG = 'lg',
	XL = 'xl',
	XXL = 'xxl'
}

type ValueWithDeviceWidth<T> = Record<SCREEN_SIZE_TYPE, T>
```