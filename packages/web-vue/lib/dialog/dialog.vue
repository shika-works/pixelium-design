<template>
	<PopupWrapper
		:destroy-on-hide="props.destroyOnHide"
		:z-index="props.zIndex"
		:close-delay="ANIMATION_DURATION"
		position="fixed"
		:visible="props.visible"
		prevent-document-scroll
	>
		<Transition
			:name="'px-dialog-fade'"
			appear
			@after-enter="afterEnterHandler"
			@after-leave="afterLeaveHandler"
			@after-appear="afterEnterHandler"
		>
			<div
				class="px-dialog px-dialog-wrapper pixelium"
				@keydown.esc="escKeydownHandler"
				tabindex="-1"
				autofocus
				v-show="props.visible"
				ref="dialogWrapper"
			>
				<Mask
					:z-index="0"
					v-bind="props.maskProps"
					v-if="mask"
					@click="maskClickHandler"
					class="px-dialog-mask"
				></Mask>
				<div
					class="px-dialog-container corner-gradient"
					v-bind="{ ...props.containerProps, ...attrs }"
				>
					<div class="px-dialog-header" v-bind="props.headerProps">
						<div
							v-if="slots.icon"
							class="px-dialog-icon-wrapper px-dialog-header-icon-wrapper"
							:class="{
								'px-dialog-header-icon__last': !slots.title && isNullish(props.title)
							}"
						>
							<slot name="icon"></slot>
						</div>
						<slot name="title">
							<span>{{ props.title }}</span>
						</slot>
						<div
							v-if="props.closable"
							class="px-dialog-icon-wrapper px-dialog-close-icon-wrapper"
							:class="{
								'px-dialog-icon-wrapper__last': !slots.title && isNullish(props.title)
							}"
							@click="closeHandler"
						>
							<Times tabindex="0" class="px-dialog-close-icon"></Times>
						</div>
					</div>
					<div class="px-dialog-body" v-bind="props.bodyProps">
						<slot></slot>
					</div>
					<div class="px-dialog-footer" v-bind="props.footerProps" v-if="showFooter">
						<slot name="footer">
							<div class="px-dialog-button">
								<Button
									poll-size-change
									class="px-dialog-cancel-button"
									theme="info"
									@click="closeHandler"
									v-if="props.showCancel"
									v-bind="props.cancelButtonProps"
									>{{ props.cancelText || t('dialog.cancel') }}</Button
								>
								<Button
									poll-size-change
									class="px-dialog-confirm-button"
									@click="okHandler"
									:loading="props.loading || loadingBeforeOk"
									v-bind="props.okButtonProps"
									>{{ props.okText || t('dialog.confirm') }}</Button
								>
							</div>
						</slot>
					</div>
				</div>
			</div>
		</Transition>
	</PopupWrapper>
</template>

<script setup lang="ts">
import type { DialogEvents, DialogProps } from './type'
import PopupWrapper from '../popup-wrapper/index.vue'
import Button from '../button/index.vue'
import Mask from '../mask/index.vue'
import { ref, useAttrs, useSlots, watch } from 'vue'
import { isNullish } from 'parsnip-kit'
// @ts-ignore
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'
import { logError } from '../share/util/console'
import { useLocale } from '../share/util/locale'

const ANIMATION_DURATION = 250

defineOptions({
	name: 'DialogInner',
	inheritAttrs: false
})

const props = withDefaults(
	defineProps<
		Omit<DialogProps, 'defaultVisible' | 'root'> & {
			onBeforeOk?: () => Promise<boolean | void> | boolean | void
		}
	>(),
	{
		visible: undefined,
		title: '',
		closable: true,
		mask: true,
		maskClosable: true,
		showCancel: true,
		loading: false,
		showFooter: true,
		destroyOnHide: false,
		escToClose: true
	}
)

const emits = defineEmits<Omit<DialogEvents, 'onBeforeOk'>>()

const slots = useSlots()

const [t] = useLocale()

const closeHandler = (event: MouseEvent) => {
	emits('cancel', event)
}

const maskClickHandler = (event: MouseEvent) => {
	if (props.maskClosable) {
		emits('cancel', event)
	}
}

watch(
	() => props.visible,
	(val) => {
		if (val) {
			emits('open')
		} else {
			emits('close')
		}
	}
)

const escKeydownHandler = (event: KeyboardEvent) => {
	if (props.escToClose) {
		emits('cancel', event)
	}
}

const afterLeaveHandler = () => {
	emits('afterClose')
}

const afterEnterHandler = () => {
	emits('afterOpen')
}

const loadingBeforeOk = ref(false)

const okHandler = async (event: MouseEvent) => {
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
	emits('ok', event)
}

const attrs = useAttrs()
</script>

<style lang="less" src="./index.less"></style>

<style lang="css" src="../share/style/index.css" />
