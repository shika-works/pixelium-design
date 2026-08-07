import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/pixelium-vue.css'
import '@pixelium/web-vue/dist/normalize.css'
import PixeliumVue from '@pixelium/web-vue'

import './custom.css'

import IconExampleHn from '../../template/common/icon-example-hn.vue'
import IconExamplePa from '../../template/common/icon-example-pa.vue'
import DemoContainer from './DemoContainer.vue'

import type { App } from 'vue'

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }: { app: App }) {
		app.use(PixeliumVue)
		app.component('demo-preview', DemoContainer)
		app.component('IconExamplePa', IconExamplePa)
		app.component('IconExampleHn', IconExampleHn)

		if (typeof document !== 'undefined') {
			document.body.setAttribute('data-overlayscrollbars-initialize', '')
			document.documentElement.setAttribute('data-overlayscrollbars-initialize', '')
		}
	}
}
