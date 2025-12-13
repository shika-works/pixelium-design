import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/pixelium-vue.css'
import '@pixelium/web-vue/dist/normalize.css'
import PixeliumVue from '@pixelium/web-vue'
import '@vitepress-demo-preview/component/dist/style.css'

import './custom.css'

import { AntDesignContainer } from '@vitepress-demo-preview/component'
import IconExampleHn from '../../template/common/icon-example-hn.vue'
import IconExamplePa from '../../template/common/icon-example-pa.vue'

import { defineClientComponentConfig } from '@vitepress-demo-preview/core'

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
		defineClientComponentConfig({
			copySuccessText: 'Code copied to clipboard!',
			vueApp: app,
			i18n: {
				en: {
					copySuccessText: 'Code copied to clipboard!',
					copyCode: 'Copy code',
					foldCode: 'Fold code',
					expandCode: 'Expand code',
					hideSourceCode: 'Hide source code'
				},
				zh: {
					copySuccessText: '代码已复制到剪贴板！',
					copyCode: '复制代码',
					foldCode: '折叠代码',
					expandCode: '展开代码',
					hideSourceCode: '隐藏源代码'
				}
			},
			defaultLanguage: 'en'
		})
		app.use(PixeliumVue)
		app.component('demo-preview', AntDesignContainer)
		app.component('IconExamplePa', IconExamplePa)
		app.component('IconExampleHn', IconExampleHn)
	}
}
