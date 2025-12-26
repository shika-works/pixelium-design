<script setup lang="tsx">
import { useSlots, shallowRef, useAttrs, ref } from 'vue'
import Popup from '../popup/index.vue'
import Button from '../button/index.vue'
import type { PopconfirmProps, PopconfirmEvents, PopconfirmExpose } from './type'
import { forwardEmits } from '../share/util/reactivity'
import { logError } from '../share/util/console'
import ExclamationTriangleSolid from '@hackernoon/pixel-icon-library/icons/SVG/solid/exclamation-triangle-solid.svg'
import { useLocale } from '../share/util/locale'
import { useControlledMode } from '../share/hook/use-controlled-mode'

defineOptions({
	name: 'Popconfirm'
})

const props = withDefaults(
	defineProps<
		PopconfirmProps & {
			onBeforeOk?: () => Promise<boolean | void> | boolean | void
		}
	>(),
	{
		placement: 'top',
		offset: 8,
		variant: 'light',
		root: 'body',
		arrow: true,
		visible: undefined,
		defaultVisible: undefined,
		destroyOnHide: false,
		loading: false,
		showCancel: true,
		showFooter: true,
		showIcon: true
	}
)

const emits = defineEmits<Omit<PopconfirmEvents, 'beforeOk'>>()

const popupRef = shallowRef<InstanceType<typeof Popup> | null>(null)

defineExpose<PopconfirmExpose>({
	get triggerContent() {
		return popupRef.value?.triggerContent
	},
	updateRenderState() {
		popupRef.value?.updateRenderState()
	},
	close: () => {
		setVisible(false)
	},
	open: () => {
		setVisible(true)
	}
})

const slots = useSlots()

const forward = forwardEmits(emits, ['open', 'close'])

const [visible, setVisible] = useControlledMode('visible', props, emits, {
	defaultField: 'defaultVisible',
	transform: (val) => val || false
})

const updateVisibleHandler = (val: boolean) => {
	setVisible(val)
}

const [t] = useLocale()

const loadingBeforeOk = ref(false)

const okHandler = async (e: MouseEvent) => {
	if (props.onBeforeOk) {
		try {
			loadingBeforeOk.value = true
			const result = await props.onBeforeOk()
			if (result === false) {
				loadingBeforeOk.value = false
				return
			}
		} catch (error) {
			logError(error)
			loadingBeforeOk.value = false
			return
		}
	}
	loadingBeforeOk.value = false
	await setVisible(false)
	emits('ok', e)
}
const cancelHandler = async (e: MouseEvent) => {
	await setVisible(false)
	emits('cancel', e)
}

const contentRender = () => {
	return (
		<div class="px-popconfirm px-popconfirm-container" {...props.containerProps}>
			<div class="px-popconfirm-content" {...props.contentProps}>
				{props.showIcon && (
					<div class="px-popconfirm-icon-wrapper">
						{slots.icon ? (
							slots.icon()
						) : (
							// @ts-ignore
							<ExclamationTriangleSolid class="px-popconfirm-warning-icon"></ExclamationTriangleSolid>
						)}
					</div>
				)}
				{slots.content ? slots.content() : <span>{props.content}</span>}
			</div>
			{props.showFooter && (
				<div class="px-popconfirm-footer" {...props.footerProps}>
					{slots.footer ? (
						slots.footer()
					) : (
						<div>
							{[
								props.showCancel && (
									<Button
										size="small"
										theme="info"
										class="px-popconfirm-cancel-button"
										// @ts-ignore
										onClick={cancelHandler}
										{...props.cancelButtonProps}
									>
										{props.cancelText || t('popconfirm.cancel')}
									</Button>
								),
								<Button
									size="small"
									class="px-popconfirm-confirm-button"
									loading={props.loading || loadingBeforeOk.value}
									// @ts-ignore
									onClick={okHandler}
									{...props.okButtonProps}
								>
									{props.okText || t('popconfirm.confirm')}
								</Button>
							]}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

defineRender(() => {
	return (
		<Popup
			ref={popupRef}
			placement={props.placement}
			trigger="click"
			offset={props.offset}
			variant={props.variant}
			root={props.root}
			arrow={props.arrow}
			zIndex={props.zIndex}
			disabled={props.disabled}
			destroyOnHide={props.destroyOnHide}
			visible={visible.value}
			onUpdate:visible={updateVisibleHandler}
			{...{ ...forward, ...props.popoverProps }}
		>
			{{
				default: slots.default,
				content: contentRender
			}}
		</Popup>
	)
})
</script>

<style lang="less" src="./index.less"></style>
<style lang="less" src="../share/style/index.css" />
