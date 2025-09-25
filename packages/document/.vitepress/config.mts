import { defineConfig } from 'vitepress'
import { componentPreview, containerPreview } from '@vitepress-demo-preview/plugin'
import markdownItKatex from 'markdown-it-katex'
import zh from './zh'
import en from './en'
// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Pixelium Design Doc',
	description: 'Pixelium Design Doc',
	lastUpdated: true,
	cleanUrls: true,
	metaChunk: true,
	markdown: {
		theme: {
			light: 'vitesse-light',
			dark: 'vitesse-dark'
		},
		lineNumbers: true,
		config(md) {
			md.use(componentPreview)
			md.use(containerPreview)
			md.use(markdownItKatex)
		}
	},
	head: [['link', { rel: 'icon', href: '/pixelium-design/logo.png' }]],
	base: '/pixelium-design/',
	locales: {
		zh: { label: '中文', ...zh },
		en: { label: 'English', ...en }
	},
	themeConfig: {
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/shika-works/pixelium-design' },
			{ icon: 'npm', link: 'https://www.npmjs.com/package/@pixelium/web-vue' }
		],
		logo: '/logo.png',
		search: {
			provider: 'local'
		}
	}
})
