import type { VNode } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
import type { SCREEN_SIZE_TYPE } from '../const'

export type NumberOrPercentage = number | `${number}%`

export type RgbaColor = { r: number; g: number; b: number; a: number }

export type ValidContent = string | (() => VNode | string | JSX.Element)
export type ValidVNodeContent = () => VNode | JSX.Element

export type ValueWithDeviceWidth<T> = Record<SCREEN_SIZE_TYPE, T>
