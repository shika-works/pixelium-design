// This file references input/src/utils.ts from the element-plus project.
// Licensed under the MIT License.
// https://github.com/element-plus/element-plus/blob/dev/packages/components/input/src/utils.ts

import { parseTemplate } from 'parsnip-kit'
import { clamp } from '../util/common'
import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useResizeObserver } from './use-resize-observer'

let hiddenTextarea: HTMLTextAreaElement | null = null

const HIDDEN_STYLE = `
  position:absolute!important;
  top:-9999px!important;
  left:-9999px!important;
  overflow:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
  width:{width}px!important;
  min-height:0!important;
  height:0!important;
  z-index:-9999!important;
`

const SIZING_STYLE = [
	'letter-spacing',
	'line-height',
	'padding-top',
	'padding-bottom',
	'font-family',
	'font-weight',
	'font-size',
	'font-variant',
	'text-rendering',
	'text-transform',
	'width',
	'padding-left',
	'padding-right',
	'border-width',
	'box-sizing'
] as const

function calculateNodeStyling(target: HTMLElement): {
	sizingStyle: string
	paddingSize: number
	borderSize: number
	boxSizing: string
} {
	const style = window.getComputedStyle(target)

	const boxSizing = style.getPropertyValue('box-sizing')

	const paddingSize =
		parseFloat(style.getPropertyValue('padding-top')) +
		parseFloat(style.getPropertyValue('padding-bottom'))

	const borderSize =
		parseFloat(style.getPropertyValue('border-top-width')) +
		parseFloat(style.getPropertyValue('border-bottom-width'))

	const sizingStyle = SIZING_STYLE.map(
		(name) => `${name}:${style.getPropertyValue(name)}`
	).join(';')

	return { sizingStyle, paddingSize, borderSize, boxSizing }
}

function getHeight(node: HTMLTextAreaElement, minRows = 1, maxRows = Infinity) {
	if (!hiddenTextarea) {
		hiddenTextarea = document.createElement('textarea')
		document.body.appendChild(hiddenTextarea)
	}

	const { sizingStyle, paddingSize, borderSize, boxSizing } = calculateNodeStyling(node)

	const nodeWidth = node.getBoundingClientRect().width
	hiddenTextarea.setAttribute(
		'style',
		`${sizingStyle};${parseTemplate(HIDDEN_STYLE, (pattern: string) => (pattern === 'width' ? String(nodeWidth) : ''))}`
	)

	hiddenTextarea.value = ''
	let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize

	const minHeight =
		singleRowHeight * minRows + (boxSizing === 'border-box' ? paddingSize + borderSize : 0)

	const maxHeight =
		singleRowHeight * maxRows + (boxSizing === 'border-box' ? paddingSize + borderSize : 0)

	hiddenTextarea.value = node.value || node.placeholder || ''
	let height = hiddenTextarea.scrollHeight

	height += +(boxSizing === 'border-box') * borderSize

	height = clamp(height, minHeight, maxHeight)

	return {
		height,
		minHeight,
		maxHeight
	}
}

let textareaMounted = 0

function calcTextareaHeight(textarea: HTMLTextAreaElement, minRows: number, maxRows: number) {
	const height = getHeight(textarea, minRows, maxRows)
	return height
}

function destroyHiddenTextarea() {
	textareaMounted--
	if (hiddenTextarea && textareaMounted <= 0) {
		hiddenTextarea.remove()
		hiddenTextarea = null
	}
}

function recordTextareaMounted() {
	textareaMounted++
}

export const useTextareaHeight = (
	textareaRef: Ref<null | HTMLTextAreaElement>,
	props: {
		minRows?: number
		maxRows?: number
	}
) => {
	const height = ref<undefined | number>(undefined)
	const minHeight = ref<undefined | number>(undefined)
	const maxHeight = ref<undefined | number>(undefined)

	const callback = () => {
		if (textareaRef.value) {
			const data = calcTextareaHeight(
				textareaRef.value,
				props.minRows || 1,
				props.maxRows || Infinity
			)
			height.value = data.height
			maxHeight.value = data.maxHeight
			minHeight.value = data.minHeight
		}
	}
	recordTextareaMounted()
	useResizeObserver(textareaRef, callback, true)
	onBeforeUnmount(() => {
		destroyHiddenTextarea()
	})

	return [height, minHeight, maxHeight, callback] as const
}
