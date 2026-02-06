export const BEGIN_PAGE = 1

export function generatePagination(page: number, pageCount: number, pageSlot: number) {
	const pages = []
	const halfVisible = Math.floor((pageSlot - 2) / 2)

	if (pageCount <= pageSlot) {
		for (let i = BEGIN_PAGE; i <= pageCount; i++) pages.push(i)
		return pages
	}

	pages.push(BEGIN_PAGE)

	const hasLeftEllipsis = page > halfVisible + 1 + BEGIN_PAGE

	if (hasLeftEllipsis) {
		pages.push('...')
	}

	let start = Math.max(2, page - halfVisible + +hasLeftEllipsis)
	let end = Math.min(pageCount - 1, page + halfVisible)
	if (end < pageCount - 1) {
		end--
	}

	if (start === 2) {
		end = Math.min(pageCount - 1, pageSlot - 2)
	}
	if (end === pageCount - 1) {
		start = Math.max(2, pageCount - pageSlot + 2)
		if (start > 2) {
			start++
		}
	}

	for (let i = start; i <= end; i++) {
		pages.push(i)
	}

	if (end < pageCount - 1) {
		pages.push('...')
	}

	if (pageCount > BEGIN_PAGE) {
		pages.push(pageCount)
	}

	return pages
}
