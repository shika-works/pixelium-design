export type UploadImageProps = {
	/**
	 * @property {'small' | 'medium' | 'large'} [size='medium']
	 * @version 0.2.1
	 */
	size?: 'small' | 'medium' | 'large'
	/**
	 * @property {boolean} [abortable=true]
	 * @version 0.2.1
	 */
	abortable?: boolean
	/**
	 * @property {boolean} [previewable=true]
	 * @version 0.2.1
	 */
	previewable?: boolean
	/**
	 * @property {boolean} [showProgress=true]
	 * @version 0.2.1
	 */
	showProgress?: boolean
}
