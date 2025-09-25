<template>
	<px-button style="margin-right: 8px" @click="callByWindow">Window</px-button>
	<px-button style="margin-right: 8px" @click="callByCurrentInstance">Current Instance</px-button>
	<px-button @click="callByOnDemandImport">On-demand Import</px-button>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
import { Message } from '@pixelium/web-vue/es'
const instance = getCurrentInstance()

const callByWindow = () => {
	$message('Global Message')
}
const callByCurrentInstance = () => {
	instance.appContext.config.globalProperties.PixeliumVue.message('Global Message')
}
const callByOnDemandImport = () => {
	Message('Global Message')
}
</script>
