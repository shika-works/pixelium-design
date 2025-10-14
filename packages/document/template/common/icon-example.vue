<script lang="ts">
import { h, ref, onMounted } from 'vue'

function copyTextToClipboard(text: string) {
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log('Text copied to clipboard')
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err)
				fallbackCopyTextToClipboard(text)
			})
	} else {
		fallbackCopyTextToClipboard(text)
	}
}

function fallbackCopyTextToClipboard(text: string) {
	const textarea = document.createElement('textarea')
	textarea.value = text
	textarea.style.position = 'fixed'
	textarea.style.opacity = '0'
	document.body.appendChild(textarea)
	textarea.select()
	try {
		const successful = document.execCommand('copy')
		const msg = successful ? 'successful' : 'unsuccessful'
		console.log('Fallback: Copying text command was ' + msg)
	} catch (err) {
		console.error('Fallback: Unable to copy text', err)
	}
	document.body.removeChild(textarea)
}
export default {
	props: {
		group: {
			type: Object
		}
	},
	setup(props: any) {
		const wrapperRef = ref<HTMLDivElement | null>(null)
		const col = ref(1)
		onMounted(() => {
			setTimeout(() => {
				if (wrapperRef.value) {
					col.value = Math.max(Math.floor(wrapperRef.value.clientWidth / 108), 1)
				}
			})
		})
		return () =>
			h('div', {}, [
				Object.keys(props.group).map((groupName) => {
					return h('div', { ref: (el: HTMLDivElement) => (wrapperRef.value = el) }, [
						groupName && h('h4', {}, [groupName]),
						h(
							'table',
							{ style: 'border-collapse: collapse;' },
							Array(Math.ceil(props.group[groupName].length / col.value))
								.fill(0)
								.map((_, rowIdx) => {
									return h(
										'tr',
										{},
										Array(col.value)
											.fill(0)
											.map((_, colIdx) => {
												return props.group[groupName][rowIdx * col.value + colIdx]
													? h(
															'td',
															{
																style:
																	'cursor: pointer; width: 108px; height: 108px; border: solid 1px var(--px-neutral-6);',
																onClick: () => {
																	copyTextToClipboard(
																		props.group[groupName][rowIdx * col.value + colIdx].key
																	)
																	$message.success(
																		props.group[groupName][rowIdx * col.value + colIdx].key +
																			' Copied'
																	)
																}
															},
															[
																h(
																	'div',
																	{
																		style:
																			'display: flex; flex-direction: column; word-break: break-all; text-align: center; justify-content: space-between; align-items: center; height: 100%; padding: 32px 2px 4px 2px; box-sizing: border-box;'
																	},
																	[
																		h(
																			props.group[groupName][rowIdx * col.value + colIdx].icon,
																			{
																				style: 'font-size: 20px; color: var(--px-neutral-9)'
																			}
																		),
																		h(
																			'span',
																			{ style: 'font-size: 12px; color: var(--px-neutral-8)' },
																			[props.group[groupName][rowIdx * col.value + colIdx].key]
																		)
																	]
																)
															]
														)
													: ''
											})
									)
								})
						)
					])
				})
			])
	}
}
</script>
