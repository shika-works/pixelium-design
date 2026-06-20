<template>
	<PopupWrapper
		:destroy-on-hide="props.destroyOnHide"
		:z-index="props.zIndex"
		:close-delay="ANIMATION_DURATION"
		position="fixed"
		:visible="props.visible"
		prevent-document-scroll
		esc-to-close
		@esc-keydown="escKeydownHandler"
	>
		<Transition
			:name="`px-drawer-fade__${props.placement}`"
			appear
			@after-enter="afterEnterHandler"
			@after-leave="afterLeaveHandler"
			@after-appear="afterEnterHandler"
		>
			<div
				class="px-drawer px-drawer-wrapper pixelium"
				:class="{
					[`px-drawer__${props.placement}`]: props.placement
				}"
				v-show="props.visible"
			>
				<Mask
					:z-index="0"
					v-bind="props.maskProps"
					v-if="mask"
					@click="maskClickHandler"
					class="px-drawer-mask"
				></Mask>
				<div class="px-drawer-container" v-bind="{ ...props.containerProps, ...attrs }">
					<div class="px-drawer-header" v-bind="props.headerProps">
						<slot name="title">
							<span>{{ props.title }}</span>
						</slot>
						<div
							v-if="props.closable"
							class="px-drawer-icon-wrapper px-drawer-close-icon-wrapper"
							:class="{
								'px-drawer-icon-wrapper__last': !slots.title && isNullish(props.title)
							}"
							@click="closeHandler"
						>
							<Times class="px-drawer-close-icon"></Times>
						</div>
					</div>
					<div class="px-drawer-body" v-bind="props.bodyProps">
						<slot></slot>
					</div>
					<div class="px-drawer-footer" v-if="props.showFooter" v-bind="props.footerProps">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</Transition>
	</PopupWrapper>
</template>

<script setup lang="ts">
import type { DrawerEvents, DrawerProps } from './type'
import PopupWrapper from '../popup-wrapper/index.vue'
import Mask from '../mask/index.vue'
import { useAttrs, useSlots, watch } from 'vue'
import { isNullish } from 'parsnip-kit'
// @ts-ignore
import Times from '@hackernoon/pixel-icon-library/icons/SVG/regular/times.svg'

const ANIMATION_DURATION = 250

defineOptions({
	name: 'DrawerInner',
	inheritAttrs: false
})

const props = withDefaults(defineProps<DrawerProps>(), {
	visible: undefined,
	title: '',
	closable: true,
	mask: true,
	maskClosable: true,
	destroyOnHide: false,
	escToClose: true,
	placement: 'right'
})

const emits = defineEmits<Omit<DrawerEvents, 'onBeforeOk'>>()

const slots = useSlots()

const closeHandler = (event: MouseEvent) => {
	emits('exit', event)
}

const maskClickHandler = (event: MouseEvent) => {
	if (props.maskClosable) {
		emits('exit', event)
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
		emits('exit', event)
	}
}

const afterLeaveHandler = () => {
	emits('afterClose')
}

const afterEnterHandler = () => {
	emits('afterOpen')
}

const attrs = useAttrs()
</script>

<style lang="less" src="./index.less"></style>

<style lang="css" src="../share/style/index.css" />
