// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import viteSvgLoader from '../plugin/svg-loader.ts'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'vue-macros/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
	plugins: [Vue(), VueJsx(), VueMacros(), viteSvgLoader()],
	build: {
		target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, '../lib/index.ts'),
			name: 'PixeliumVue',
			fileName: 'pixelium-vue',
			cssFileName: 'pixelium-vue',
			formats: ['es', 'cjs', 'umd']
		},
		rollupOptions: {
			external: [
				'vue',
				'@floating-ui/dom',
				'overlayscrollbars',
				'overlayscrollbars-vue',
				'parsnip-kit',
				'vue-router'
			],
			output: {
				exports: 'named',
				globals: {
					vue: 'Vue',
					'@floating-ui/dom': 'FloatingUI',
					overlayscrollbars: 'OverlayScrollbarsGlobal',
					'overlayscrollbars-vue': 'OverlayScrollbarsVue',
					'parsnip-kit': 'parsnip-kit',
					'vue-router': 'VueRouter'
				}
			}
		}
	},
	// @ts-ignore
	test: {
		environment: 'jsdom',
		testTimeout: 10 * 1000,
		coverage: {
			provider: 'v8',
			include: ['lib/**/*.{ts,tsx,js,jsx,vue}'],
			exclude: ['lib/**/type.ts', '**/*.d.ts'],
			reporter: ['text', 'html', 'json']
		}
	}
})
