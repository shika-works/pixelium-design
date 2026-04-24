import { defineConfig } from 'vitepress'
import { dfs4Md } from './dfs-4-md'
import { newItems, titleMapEn, additionMapEn } from './share'

const sidebar = dfs4Md('en', titleMapEn, additionMapEn, newItems)

export default defineConfig({
	title: 'Pixelium Design',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/en' },
			{ text: 'Doc', link: '/en/guide/intro' }
		],
		sidebar: sidebar,
		outline: {
			level: [2, 4]
		}
	}
})
