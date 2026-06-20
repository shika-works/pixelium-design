import { defineComponent, h, reactive } from 'vue'
import type { DialogOptions, DialogReturn, DialogEvents } from './type'
import { isFunction, isString } from 'parsnip-kit'
import type { EmitEvent, ValidContent } from '../share/type'
import Dialog from './dialog.vue'

// @ts-ignore
import InfoCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/info-circle-solid.svg'
// @ts-ignore
import ExclamationTriangleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclamation-triangle-solid.svg'
// @ts-ignore
import OctagonTimesSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/octagon-times-solid.svg'
// @ts-ignore
import CheckCircleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/check-circle-solid.svg'

import DialogWrapped from './dialog-wrapped.vue'
import { t } from '../share/util/locale'
import { ModalOverlayManager } from '../overlay/modal-overlay'

type DialogManagerOptions = Required<Pick<DialogOptions, 'content' | 'root'>> &
	Omit<DialogOptions, 'content' | 'root'> &
	EmitEvent<DialogEvents>
type DialogManagerState = DialogManagerOptions & { visible: boolean; loading: boolean }
class DialogManager extends ModalOverlayManager<DialogManagerOptions, DialogManagerState> {
	constructor(options: DialogManagerOptions) {
		super(options)
		this.renderVNode()
	}
	protected getContainerClass(): string {
		return 'px-dialog-wrapper'
	}
	protected initState() {
		return reactive({
			...this.options,
			visible: true,
			loading: false
		})
	}
	protected createVNode() {
		const contentRender = this.options.content
		const titleRender = this.options.title
		const footerRender = this.options.footer

		const component = defineComponent({
			setup: () => {
				return () =>
					h(Dialog, this.state as any, {
						title: isString(titleRender) ? undefined : titleRender ? titleRender : undefined,
						default: isString(contentRender) ? () => contentRender : contentRender,
						footer: isString(footerRender)
							? () => footerRender
							: footerRender
								? footerRender
								: undefined,
						icon: this.options.icon ? this.options.icon : undefined
					})
			}
		})

		return h(component)
	}
}

const dialogTitles = {
	info: () => t('dialog.infoTitle'),
	notice: () => t('dialog.infoTitle'),
	success: () => t('dialog.successTitle'),
	warning: () => t('dialog.warningTitle'),
	error: () => t('dialog.errorTitle'),
	confirm: () => t('dialog.confirmTitle'),
	normal: () => ''
}

const dialogIcons = {
	info: () => h(InfoCircleSolid, { style: { fill: 'var(--px-primary-6)', marginTop: '1px' } }),
	notice: () => h(InfoCircleSolid, { style: { fill: 'var(--px-notice-6)', marginTop: '1px' } }),
	success: () =>
		h(CheckCircleSolid, { style: { fill: 'var(--px-success-6)', marginTop: '1px' } }),
	warning: () =>
		h(ExclamationTriangleSolid, { style: { fill: 'var(--px-warning-6)', marginTop: '1px' } }),
	error: () =>
		h(OctagonTimesSolid, { style: { fill: 'var(--px-danger-6)', marginTop: '1px' } }),
	confirm: undefined,
	normal: undefined
}

const dialogCall = (
	options: ValidContent | (DialogOptions & EmitEvent<DialogEvents>)
): DialogReturn => {
	let currentOptions = options as DialogOptions & EmitEvent<DialogEvents>
	if (isString(options) || isFunction(options)) {
		currentOptions = {
			content: options
		}
	}

	currentOptions = Object.assign(currentOptions, {
		type: currentOptions.type || 'normal',
		root: currentOptions.root || 'body'
	})

	if (!('title' in currentOptions)) {
		currentOptions.title = dialogTitles[currentOptions.type || 'normal']()
	}
	if (!('icon' in currentOptions) && currentOptions.title) {
		currentOptions.icon = dialogIcons[currentOptions.type || 'normal']
	}
	if (!('showCancel' in currentOptions)) {
		currentOptions.showCancel =
			currentOptions.type === 'confirm' || currentOptions.type === 'normal'
	}

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	const originCancel = currentOptions.onCancel
	currentOptions.onCancel = (event) => {
		try {
			originCancel?.call(currentOptions, event)
			currentManager.close()
			resolve(false)
		} catch (error) {
			reject(error)
		}
	}

	const originClose = currentOptions.onClose
	currentOptions.onClose = () => {
		try {
			originClose?.call(currentOptions)
			currentManager.close()
			resolve(false)
		} catch (error) {
			reject(error)
		}
	}

	const originOk = currentOptions.onOk
	currentOptions.onOk = (event) => {
		try {
			originOk?.call(currentOptions, event)
			currentManager.close()
			resolve(true)
		} catch (error) {
			reject(error)
		}
	}

	const currentManager = new DialogManager(currentOptions as any)

	;(promise as DialogReturn).close = () => currentManager.close()
	return promise as DialogReturn
}

;(['info', 'success', 'warning', 'error', 'normal', 'confirm', 'notice'] as const).forEach(
	(key) => {
		;(DialogWrapped as any)[key] = (options: ValidContent | Omit<DialogOptions, 'type'>) => {
			if (isString(options) || isFunction(options)) {
				options = {
					content: options
				}
			}
			return dialogCall({
				...options,
				type: key
			})
		}
	}
)

export default DialogWrapped as typeof DialogWrapped & {
	[key in DialogOptions['type'] & string]: (
		options:
			| (Omit<DialogOptions, 'type'> & Omit<EmitEvent<DialogEvents>, 'update:visible'>)
			| string
	) => DialogReturn
}
