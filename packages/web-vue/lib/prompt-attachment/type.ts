import type { UploadProviderProps } from '../upload-provider/type'

export type PromptAttachmentProps = {
	/**
	 * @property {boolean} [abortable=true]
	 * @version 0.2.1
	 */
	abortable?: boolean
	/**
	 * @property {boolean} [showProgress=true]
	 * @version 0.2.1
	 */
	showProgress?: boolean
	/**
	 * @property {boolean} [previewable=true]
	 * @version 0.2.1
	 */
	previewable?: boolean
}

export type PromptUploadConfig = UploadProviderProps & {
	/**
	 * @property {boolean} [draggable=true]
	 * @version 0.2.1
	 */
	draggable?: boolean
	/**
	 * @property {boolean} [pasteable=true]
	 * @version 0.2.1
	 */
	pasteable?: boolean
}
