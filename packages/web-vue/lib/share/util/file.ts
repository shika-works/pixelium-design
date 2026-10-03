export const IMAGE_EXTENSIONS = [
	'jpg',
	'jpeg',
	'png',
	'gif',
	'webp',
	'bmp',
	'svg',
	'avif',
	'ico',
	'tiff'
]

export const isImageFile = (file: { name: string; type?: string }) =>
	!!file.type?.startsWith('image/') ||
	IMAGE_EXTENSIONS.includes(file.name.split('.').pop()?.toLowerCase() ?? '')

// Only the three literal wildcards defined by the HTML `accept` attribute are valid,
const ACCEPT_WILDCARDS = ['audio/', 'image/', 'video/']

const isAcceptWildcard = (value: string) =>
	value.endsWith('/*') && ACCEPT_WILDCARDS.includes(value.slice(0, -1))

export const matchAccept = (file: { name: string; type?: string }, accept: string[]) =>
	accept.some((rule) => {
		const value = rule.trim().toLowerCase()
		if (!value) {
			return false
		}
		if (value.startsWith('.')) {
			return file.name.toLowerCase().endsWith(value)
		}
		const type = file.type?.toLowerCase()
		if (!type) {
			return false
		}
		if (isAcceptWildcard(value)) {
			return type.startsWith(value.slice(0, -1))
		}
		return type === value
	})
