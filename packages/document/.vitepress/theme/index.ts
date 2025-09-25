import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import '@pixelium/web-vue/dist/font.css'
import '@pixelium/web-vue/dist/pixelium-vue.css'
import PixeliumVue from '@pixelium/web-vue'
import '@vitepress-demo-preview/component/dist/style.css'

import './custom.css'

import { AntDesignContainer } from '@vitepress-demo-preview/component'
import IconExample from '../../template/common/icon-example.vue'

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }) {
		app.use(PixeliumVue)
		app.component('demo-preview', AntDesignContainer)
		app.component('IconExample', IconExample)
	}
}
