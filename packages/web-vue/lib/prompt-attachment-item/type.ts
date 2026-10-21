import type { FileInfo } from '../upload-provider/type'

export type PromptAttachmentItemProps = {
	/**
	 * @property {FileInfo} item
	 * @version 0.2.1
	 */
	item: FileInfo
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
