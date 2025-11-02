import type { VNode } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
import type { GROUP_OPTION_TYPE, SCREEN_SIZE_TYPE } from '../const'

export type NumberOrPercentage = number | `${number}%`

export type RgbaColor = { r: number; g: number; b: number; a: number }

export type ValidContent = string | ((...args: any[]) => VNode | string | JSX.Element)
export type ValidVNodeContent = (...args: any[]) => VNode | JSX.Element

export type ValueWithDeviceWidth<T> = Record<SCREEN_SIZE_TYPE, T>

export interface Option<T = any> {
	value: T
	label: string
}

export interface GroupOption<T = any> {
	children: (Option<T> | string)[]
	type: typeof GROUP_OPTION_TYPE
}

export type LooseRequired<T> = {
	[P in keyof (T & Required<T>)]: T[P]
}
