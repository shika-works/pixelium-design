import { isObject } from 'parsnip-kit'
import type { GroupOption, Option } from '../type'
import { GROUP_OPTION_TYPE } from '../const'

export const clamp = (x: number, min: number, max: number): number =>
	Math.max(min, Math.min(max, x))

export const fillArr = (val: number, size: number) => Array(size).fill(val)

export const defaultFilter = <T extends string | Option | GroupOption>(
	keyword: string,
	list: T[] = []
): T[] => {
	if (!keyword) {
		return [...list]
	}
	const keyword4Search = keyword.toLowerCase()
	const len = list.length
	const ans: T[] = []
	for (let i = 0; i < len; i++) {
		const currentElement = list[i]
		if (isObject(currentElement)) {
			if ('type' in currentElement && currentElement.type === GROUP_OPTION_TYPE) {
				const children = defaultFilter(keyword, currentElement.children)
				if (children.length) {
					ans.push({
						...currentElement,
						children
					})
				}
			} else {
				if ((currentElement as Option).label.toLowerCase().includes(keyword4Search)) {
					ans.push(currentElement)
				}
			}
		} else {
			if (currentElement.toLowerCase().includes(keyword4Search)) {
				ans.push(currentElement)
			}
		}
	}

	return ans
}

export const findSameOption = <T extends string | Option | GroupOption>(
	keyword: string,
	list: T[],
	checkLabel: boolean = false
): T[] => {
	if (!keyword) {
		return []
	}
	const len = list.length
	const ans: T[] = []
	for (let i = 0; i < len; i++) {
		const currentElement = list[i]
		if (isObject(currentElement)) {
			if ('type' in currentElement && currentElement.type === GROUP_OPTION_TYPE) {
				const options = findSameOption(keyword, currentElement.children, checkLabel)
				if (options.length) {
					ans.push(options[0] as T, currentElement)
					break
				}
			} else {
				if (
					(checkLabel && (currentElement as any).label === keyword) ||
					(currentElement as Option).value === keyword
				) {
					ans.push(currentElement)
					break
				}
			}
		} else {
			if (currentElement === keyword) {
				ans.push(currentElement)
				break
			}
		}
	}
	return ans
}
