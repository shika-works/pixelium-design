import type { DefineComponent, StyleValue, VNode } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
import type { GROUP_OPTION_TYPE, SCREEN_SIZE_TYPE } from '../const'

export type NumberOrPercentage = number | `${number}%`

export type RgbaColor = { r: number; g: number; b: number; a: number }
export type RgbColor = { r: number; g: number; b: number }

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

export type RemoveUndefinedFromFields<T, K extends keyof T> = {
	[P in keyof T]: P extends K ? Exclude<T[P], undefined> : T[P]
}

export type VueComponent = DefineComponent<Record<string, never>, Record<string, never>, any>

export type EmitEvent<T extends Record<string, any>> = {
	[K in keyof T as `on${Capitalize<K & string>}`]?: (...args: T[K]) => void
}

export type VueClassValue = string | Record<string, any> | VueClassValue[]

export type RestAttrs = {
	style?: StyleValue | null
	class?: VueClassValue | null
	[x: string]: any
}
export interface NavigationOption {
	index: string | number | symbol
	label?: string
}
