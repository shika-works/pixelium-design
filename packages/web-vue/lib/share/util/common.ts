import { clamp, isObject } from 'parsnip-kit'
import type { GroupOption, Option } from '../type'
import { GROUP_OPTION_TYPE } from '../const'

export const fillArr = (val: number, size: number) => Array(size).fill(val) as number[]

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

export function offsetOutward(
	center: [number, number],
	points: [number, number][],
	offset: number
): [number, number][] {
	const [cx, cy] = center

	return points.map(([x, y]) => {
		const dx = x - cx
		const dy = y - cy

		const xOffset = dx > 0 ? offset : dx < 0 ? -offset : 0
		const yOffset = dy > 0 ? offset : dy < 0 ? -offset : 0

		return [x + xOffset, y + yOffset]
	})
}

export function isUrl(
	url: any,
	options: {
		allowWithoutProtocol?: boolean
		allowIpv6?: boolean
	} = {}
) {
	if (!url || typeof url !== 'string') {
		return false
	}

	const { allowWithoutProtocol = true, allowIpv6 = true } = options

	if (url.includes(' ')) return false

	const [protocol, rest] = extractProtocol(url)
	if (!protocol && !allowWithoutProtocol) {
		return false
	}

	const hostPortPart = rest.split(/[/?#]/)[0]
	if (!hostPortPart) return false

	const { host, port } = parseHostAndPort(hostPortPart) || {}
	if (!host) return false

	let isHostValid = false
	if (isIPv6Host(host)) {
		if (!allowIpv6) return false
		isHostValid = isValidIPv6(host)
	} else {
		isHostValid = isValidIPv4(host) || isValidDomain(host)
	}
	if (!isHostValid) return false

	if (port && !isValidPort(port)) return false

	return true
}

function extractProtocol(url: string): [string | null, string] {
	const protocolMatch = url.match(/^([a-zA-Z0-9+.-]+):\/\//)
	if (protocolMatch) {
		return [protocolMatch[1], url.slice(protocolMatch[0].length)]
	}
	return [null, url]
}

function parseHostAndPort(hostPortPart: string): { host: string; port?: string } | null {
	if (hostPortPart.startsWith('[')) {
		const ipv6Match = hostPortPart.match(/^\[(.*?)\](?::(\d+))?$/)
		if (!ipv6Match) return null
		return { host: ipv6Match[1], port: ipv6Match[2] || undefined }
	}

	const parts = hostPortPart.split(':')
	if (parts.length > 2) return null
	return { host: parts[0], port: parts[1] || undefined }
}

function isIPv6Host(host: string): boolean {
	return host.includes(':')
}

function isValidIPv4(ip: string): boolean {
	const parts = ip.split('.')
	if (parts.length !== 4) return false

	return parts.every((part) => {
		if (!/^\d+$/.test(part) || (part.length > 1 && part[0] === '0')) {
			return false
		}
		const num = Number(part)
		return num >= 0 && num <= 255
	})
}

function isValidIPv6(ip: string): boolean {
	if (!/^[0-9a-fA-F:]+$/.test(ip)) return false

	const doubleColonCount = (ip.match(/::/g) || []).length
	if (doubleColonCount > 1) return false

	let groups = ip.split(':').filter((g) => g !== '')
	const expandCount = 8 - groups.length

	if (expandCount < 0) return false

	return groups.every((group) => group.length >= 1 && group.length <= 4)
}

function isValidDomain(domain: string): boolean {
	if (domain === 'localhost') return true

	if (domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
		return false
	}

	const parts = domain.split('.')
	if (parts.length < 2) return false

	const tld = parts[parts.length - 1]
	if (tld.length < 2) return false

	return parts.every((part) => {
		return (
			part.length > 0 &&
			!part.startsWith('-') &&
			!part.endsWith('-') &&
			/^[a-zA-Z0-9-]+$/.test(part)
		)
	})
}

function isValidPort(port: string): boolean {
	const portNum = Number(port)
	return !isNaN(portNum) && portNum >= 1 && portNum <= 65535
}

export const fixedNumber = (value: number, precision: number) => {
	return parseFloat(value.toFixed(clamp(Math.round(precision), 0, 100)))
}
